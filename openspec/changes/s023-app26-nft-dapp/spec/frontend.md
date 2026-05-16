# S023 Spec — 前端規格

> **Change ID**: S023
> **Spec 版本**: v1.0
> **更新日期**: 2026-05-16
> **框架**: Next.js 14 App Router + wagmi v2 + Scaffold-ETH 2 hooks

---

## 共用規則

### 路徑前提
Scaffold-ETH 2 已 clone 到：
`C:\flaskspace\Claude\project\Ethereum_NFT_DApp\dapp\`

所有前端檔案在：
`dapp\packages\nextjs\app\`

### Scaffold-ETH 2 核心 Hooks

```typescript
// 讀取合約（不消耗 Gas）
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
const { data: mintPrice } = useScaffoldReadContract({
  contractName: "MyNFT",
  functionName: "mintPrice",
});

// 寫入合約（消耗 Gas）
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
const { writeContractAsync } = useScaffoldWriteContract("MyNFT");
await writeContractAsync({
  functionName: "mint",
  args: ["ipfs://YOUR_CID"],
  value: mintPrice,
});

// 取得當前帳號
import { useAccount } from "wagmi";
const { address, isConnected } = useAccount();
```

---

## Section 0.4 — 前端 /mint 頁面

### 檔案
`dapp/packages/nextjs/app/mint/page.tsx`

### UI 元素

| 元素 | 說明 |
|------|------|
| 標題 | "鑄造 NFT" |
| 輸入框 | Token URI（placeholder: `ipfs://Qm...`）|
| 資訊列 | 鑄造費用：讀取 `mintPrice`（格式化為 ETH）|
| 資訊列 | 剩餘名額：`MAX_SUPPLY - totalSupply()`（= 100 - N）|
| 鑄造按鈕 | disabled 若：未輸入 URI / 未連接錢包 / 已售完 |
| 交易狀態 | 等待中 / 確認中（Sepolia 需 ~15s）/ 成功（含 tokenId）/ 失敗（含 error）|
| 連結 | 成功後顯示：「前往我的 NFT 查看」|

### 核心邏輯

```typescript
// 1. 讀取合約狀態
const { data: mintPrice } = useScaffoldReadContract({ contractName: "MyNFT", functionName: "mintPrice" });
const { data: totalSupply } = useScaffoldReadContract({ contractName: "MyNFT", functionName: "totalSupply" });

// 2. 鑄造
const { writeContractAsync, isMining } = useScaffoldWriteContract("MyNFT");
const handleMint = async () => {
  try {
    const tx = await writeContractAsync({
      functionName: "mint",
      args: [tokenURI],
      value: mintPrice,
    });
    // tx.hash → 顯示 Etherscan 連結
  } catch (e) {
    // 顯示 error message
  }
};

// 3. 格式化（viem）
import { formatEther } from "viem";
const priceInEth = mintPrice ? formatEther(mintPrice) : "0.01";
```

### 驗收條件
- 輸入 URI + 連接 MetaMask → 按鈕可點擊
- 點擊後出現 MetaMask 確認視窗
- 交易確認後顯示成功訊息（含 Token ID）
- 未連接錢包時按鈕 disabled

---

## Section 0.5 — 前端 /my-nfts 頁面

### 檔案
`dapp/packages/nextjs/app/my-nfts/page.tsx`

### UI 元素

| 元素 | 說明 |
|------|------|
| 標題 | "我的 NFT" |
| 未連接提示 | "請先連接錢包" |
| NFT Grid | 3 欄，每格：圖片 + Token ID + 上架按鈕 |
| 上架流程 | ① 輸入售價（ETH）→ ② approve → ③ listItem |
| 上架狀態 | 等待 approve / 等待上架 / 成功 / 失敗 |

### 核心邏輯

```typescript
// 取得我的 NFT（透過 Transfer 事件過濾）
// Transfer(from=0x0, to=myAddress, tokenId) → mint 給我的
// 需過濾掉我已轉出的（from=myAddress）

// 上架流程（兩步驟）
// Step 1: MyNFT.approve(marketAddress, tokenId)
const { writeContractAsync: approveNFT } = useScaffoldWriteContract("MyNFT");
await approveNFT({
  functionName: "approve",
  args: [marketContractAddress, tokenId],
});

// Step 2: NFTMarket.listItem(nftAddress, tokenId, parseEther(price))
const { writeContractAsync: listItem } = useScaffoldWriteContract("NFTMarket");
await listItem({
  functionName: "listItem",
  args: [nftContractAddress, tokenId, parseEther(listPrice)],
});
```

### 驗收條件
- 只顯示當前帳號持有的 NFT
- 點擊「上架」→ MetaMask 彈兩次（approve + listItem）
- 上架成功後按鈕改為「已上架」(disabled)

---

## Section 0.6 — 前端 /market 頁面

### 檔案
`dapp/packages/nextjs/app/market/page.tsx`

### UI 元素

| 元素 | 說明 |
|------|------|
| 標題 | "NFT 市場" |
| 掛售列表 | 卡片 Grid，每格：圖片 + Token ID + 售價 + 按鈕 |
| 按鈕邏輯 | 自己掛的 → 「取消掛售」；別人的 → 「購買」|
| 空白狀態 | "目前沒有在售 NFT" |
| 購買狀態 | 等待 / 確認 / 成功（NFT 轉移完成）/ 失敗 |

### 核心邏輯

```typescript
// 讀取掛售（從 ItemListed 事件 + getListing 確認 isActive）
const { data: listing } = useScaffoldReadContract({
  contractName: "NFTMarket",
  functionName: "getListing",
  args: [nftContractAddress, tokenId],
});
// listing.isActive === true → 顯示

// 購買
const { writeContractAsync: buyItem } = useScaffoldWriteContract("NFTMarket");
await buyItem({
  functionName: "buyItem",
  args: [nftContractAddress, tokenId],
  value: listing.price,
});

// 取消（只有賣家）
const { writeContractAsync: cancelListing } = useScaffoldWriteContract("NFTMarket");
await cancelListing({
  functionName: "cancelListing",
  args: [nftContractAddress, tokenId],
});
```

### 驗收條件
- 掛售的 NFT 正確顯示售價
- 自己掛的顯示「取消」，別人的顯示「購買」
- 購買成功後 NFT 從列表消失（isActive = false）
- 取消成功後 NFT 從列表消失
