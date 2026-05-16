# S023 Design — Ethereum NFT DApp (APP26)

> **Change ID**: S023
> **狀態**: ✅ Design 完成
> **建立日期**: 2026-05-16

---

## 1. 架構圖

```
用戶瀏覽器
    │
    ├── Next.js 前端（RainbowKit + wagmi + viem）
    │       │
    │       ├── /                ← 首頁：NFT Grid 展示
    │       ├── /mint            ← 鑄造頁面
    │       ├── /my-nfts         ← 個人收藏
    │       └── /market          ← 市場頁面
    │
    └── MetaMask / 其他錢包
            │
            ▼
    Alchemy RPC（Sepolia Testnet）
            │
            ▼
    ┌────────────────────────────────┐
    │      Ethereum Sepolia          │
    │                                │
    │  ┌──────────────┐              │
    │  │  MyNFT.sol   │ ← ERC721    │
    │  │              │              │
    │  │  mint()      │              │
    │  │  withdraw()  │              │
    │  └──────┬───────┘              │
    │         │ ERC721 transfers     │
    │  ┌──────▼───────┐              │
    │  │ NFTMarket.sol│              │
    │  │              │              │
    │  │  listItem()  │              │
    │  │  buyItem()   │              │
    │  │  cancel()    │              │
    │  └──────────────┘              │
    └────────────────────────────────┘
```

---

## 2. 合約設計

### 2.1 MyNFT.sol

**繼承**: `ERC721URIStorage`, `Ownable`

```
狀態變數:
  _tokenIdCounter   Counters.Counter    自動遞增 Token ID
  MAX_SUPPLY        uint256 = 100       最大鑄造上限
  mintPrice         uint256 = 0.01 ETH  鑄造費用（可由擁有者修改）

函數:
  mint(tokenURI)    payable external    鑄造 + 設定 metadata URI
  totalSupply()     view returns uint   已鑄造數量
  setMintPrice()    external onlyOwner  修改鑄造費用
  withdraw()        external onlyOwner  提領合約 ETH

事件:
  NFTMinted(address to, uint256 tokenId, string tokenURI)

修飾器/覆寫:
  tokenURI()        ERC721URIStorage override
  supportsInterface() ERC721URIStorage override
```

**安全考量**:
- `require(totalSupply < MAX_SUPPLY)` — 防止超發
- `require(msg.value >= mintPrice)` — 強制付費
- `_safeMint` — 確認接收方支援 ERC721

### 2.2 NFTMarket.sol

**繼承**: `ReentrancyGuard`

```
資料結構:
  Listing {
    seller    address   賣家地址
    price     uint256   售價（wei）
    isActive  bool      是否在架上
  }

狀態變數:
  listings    mapping(address => mapping(uint256 => Listing))
  FEE_PERCENT uint256 = 25     手續費率（25/1000 = 2.5%）
  FEE_BASE    uint256 = 1000
  feeRecipient address         手續費接收者

函數:
  listItem(nftContract, tokenId, price)  external
  buyItem(nftContract, tokenId)          external payable nonReentrant
  cancelListing(nftContract, tokenId)    external
  getListing(nftContract, tokenId)       view returns Listing

事件:
  ItemListed(nftContract, tokenId, seller, price)
  ItemSold(nftContract, tokenId, buyer, seller, price)
  ListingCancelled(nftContract, tokenId, seller)
```

**安全考量（Checks-Effects-Interactions 模式）**:
1. **Check**: 驗證 isActive, 付款金額, 非自賣
2. **Effect**: 先設 `isActive = false`（防重入）
3. **Interaction**: 最後才轉帳 ETH + 轉移 NFT

**交易流程**:
```
賣家流程:
  ① 呼叫 MyNFT.approve(marketAddress, tokenId)  ← 授權市場轉移
  ② 呼叫 NFTMarket.listItem(nftAddr, tokenId, price)

買家流程:
  ① 呼叫 NFTMarket.buyItem(nftAddr, tokenId) {value: price}
  ② 市場合約扣手續費(2.5%) → 轉給賣家(97.5%)
  ③ NFT 所有權從賣家 → 買家
```

---

## 3. 前端設計

### 3.1 技術框架（Scaffold-ETH 2 預設）

```typescript
// 核心 hooks（Scaffold-ETH 2 提供）
useScaffoldReadContract    // 讀取合約狀態（不消耗 Gas）
useScaffoldWriteContract   // 寫入合約（消耗 Gas + MetaMask 簽名）
useAccount                 // 取得當前連接的錢包地址
```

### 3.2 四頁面規格

**頁面 1: 首頁（`/`）**
```
元素:
  - NFT Grid（3 欄，每格：圖片 + 名稱 + 擁有者地址縮寫）
  - 統計欄：已鑄造 X/100 個
  - CTA 按鈕：前往鑄造 / 前往市場

資料來源:
  - MyNFT.totalSupply() → 已鑄造數量
  - Transfer 事件過濾 → 所有 Token ID 列表
  - tokenURI(id) → IPFS metadata → 圖片/名稱
```

**頁面 2: 鑄造（`/mint`）**
```
元素:
  - 輸入欄：Token URI（ipfs://...）
  - 顯示：鑄造費用（從合約讀取 mintPrice）
  - 顯示：剩餘可鑄造數量（MAX_SUPPLY - totalSupply）
  - 按鈕：立即鑄造（disabled 若未連接錢包）
  - 交易狀態：等待中 / 確認中 / 成功 / 失敗

核心邏輯:
  await writeContractAsync({
    functionName: "mint",
    args: [tokenURI],
    value: mintPrice,
  })
```

**頁面 3: 我的 NFT（`/my-nfts`）**
```
元素:
  - NFT 卡片 Grid（只顯示當前帳號持有的）
  - 每張卡片：圖片 + Token ID + 按鈕（上架到市場）
  - 若未連接錢包：顯示提示

核心邏輯:
  - useAccount() → 取得地址
  - Transfer 事件 filter(to === myAddress) → 我的 Token IDs
  - 上架：先 approve，再 listItem
```

**頁面 4: 市場（`/market`）**
```
元素:
  - 掛售列表（只顯示 isActive === true 的）
  - 每筆：NFT 圖片 + 名稱 + 售價 + 按鈕（購買 or 取消）
  - 若是自己掛的 → 顯示「取消」；別人的 → 顯示「購買」

核心邏輯:
  - ItemListed 事件過濾 → 所有掛售記錄
  - getListing(addr, id) 確認 isActive
  - 購買：buyItem({value: price})
  - 取消：cancelListing(addr, id)
```

---

## 4. 部署策略

### 4.1 本地開發（Hardhat Network）

```bash
yarn chain    # Chain ID: 31337，自動提供測試帳號（10000 ETH 各）
yarn deploy   # 部署到本地，Hot Reload 自動更新前端 ABI
yarn start    # http://localhost:3000，內建 Burner Wallet
```

### 4.2 Sepolia 測試網

```
前置條件:
  - dapp/packages/hardhat/.env 已設定 DEPLOYER_PRIVATE_KEY / ALCHEMY_API_KEY
  - 部署者帳號有 Sepolia ETH（從 sepoliafaucet.com 領取）

部署指令:
  yarn deploy --network sepolia

合約驗證:
  yarn hardhat verify --network sepolia <MYNFT_ADDR> "<OWNER>"
  yarn hardhat verify --network sepolia <MARKET_ADDR> "<FEE_RECIPIENT>"

前端切換:
  scaffold.config.ts → targetNetworks: [chains.sepolia]
```

---

## 5. 測試策略

### Hardhat 測試（TypeScript）

```
測試檔: packages/hardhat/test/NFT.test.ts

覆蓋場景:
  MyNFT:
    ✓ mint 成功（正確金額）
    ✓ mint 失敗（金額不足）
    ✓ mint 失敗（超過 MAX_SUPPLY）
    ✓ withdraw 成功（owner 呼叫）
    ✓ withdraw 失敗（非 owner 呼叫）

  NFTMarket:
    ✓ listItem 成功（已 approve）
    ✓ listItem 失敗（未 approve）
    ✓ buyItem 成功（NFT 轉移 + ETH 分配）
    ✓ buyItem 失敗（金額不足）
    ✓ buyItem 失敗（自己買自己）
    ✓ cancelListing 成功
    ✓ cancelListing 失敗（非賣家）
```

---

## 6. 開發順序（依賴關係）

```
Phase 1（串行，有依賴）:
  S023.0.1 MyNFT.sol
      ↓
  S023.0.2 NFTMarket.sol
      ↓
  S023.0.3 部署腳本

Phase 2（可並行）:
  S023.0.4 /mint 頁面  ←┐
  S023.0.5 /my-nfts   ←┤ 同時進行（各自獨立）
  S023.0.6 /market    ←┘

Phase 3（最後）:
  S023.0.7 合約測試（依賴合約設計定案）
```
