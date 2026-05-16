# S023 Proposal — Ethereum NFT DApp (APP26)

> **Change ID**: S023
> **狀態**: ✅ Proposal 完成
> **建立日期**: 2026-05-16
> **APP**: app26 / Ethereum_NFT_DApp

---

## 1. 為什麼做（Why）

### 問題
從零開始學習以太坊智慧合約開發，需要一個完整的實作專案作為學習載體，同時產出可實際運作的 DApp。

### 目標
建立一個以太坊 NFT 鑄造 + 去中心化市場 DApp，完整走完從智慧合約開發到前端整合的全流程，部署於 Sepolia 測試網。

### 成功標準
- ✅ 可在 Sepolia 測試網鑄造 ERC721 NFT
- ✅ 可在鏈上市場掛售、購買、取消掛售 NFT
- ✅ 前端四頁面完整（首頁/鑄造/我的NFT/市場）
- ✅ 合約已在 Etherscan Sepolia 驗證
- ✅ 錢包連接（MetaMask）正常運作

---

## 2. 範疇（Scope）

### 包含（In Scope）
| 功能 | 說明 |
|------|------|
| MyNFT.sol | ERC721 鑄造合約，含最大供應量、鑄造費用、提領功能 |
| NFTMarket.sol | 鏈上市場，掛售/購買/取消，含 2.5% 手續費 |
| 部署腳本 | Hardhat deploy scripts（本地 + Sepolia）|
| 前端 /mint | 鑄造頁面（輸入 URI + 支付 ETH）|
| 前端 /my-nfts | 個人 NFT 收藏 + 上架按鈕 |
| 前端 /market | 掛售列表 + 購買/取消操作 |
| 合約測試 | Hardhat 單元測試（mint/list/buy/cancel）|

### 不包含（Non-goals）
- IPFS 自動上傳整合（手動 Pinata，不在本 change 內）
- 主網部署（初期 Sepolia 即可）
- 版稅機制（ERC2981）
- 批次鑄造
- 前端 SEO / Vercel 部署（後續 S024）

---

## 3. 技術選擇與理由

| 決策 | 選擇 | 理由 |
|------|------|------|
| 腳手架 | Scaffold-ETH 2 | 開箱即用，Hot Reload，AI-friendly（含 .claude 設定）|
| 合約工具 | Hardhat | 初學者最友善，豐富插件，JS/TS 測試 |
| 合約語言 | Solidity 0.8.x | 業界標準，文件最完整 |
| 安全庫 | OpenZeppelin | ERC721URIStorage，Ownable，ReentrancyGuard |
| 前端 | Next.js 14 + wagmi v2 + viem | Scaffold-ETH 2 預設，最輕量 Web3 hooks |
| 錢包 | RainbowKit | UI 最完整，多錢包支援 |
| 測試網 | Sepolia | 以太坊官方推薦（Goerli 已廢棄）|

---

## 4. 依賴關係

| 依賴項 | 說明 | 是否已備妥 |
|--------|------|-----------|
| Scaffold-ETH 2 | 需 git clone 到 dapp/ | ❌ 待用戶執行 |
| Alchemy API Key | Sepolia RPC | ❌ 待申請 |
| MetaMask | 瀏覽器錢包 | ❌ 待安裝 |
| Node.js 20 + yarn | 執行環境 | ❌ 待安裝 |
| OpenZeppelin | `yarn add @openzeppelin/contracts` | ❌ 待安裝 |

---

## 5. 風險

| 風險 | 嚴重度 | 緩解措施 |
|------|--------|---------|
| 私鑰洩漏到 Git | 🔴 嚴重 | `.gitignore` 已設定 `.env`，commit 前必確認 |
| approve 順序錯誤 | 🟡 中 | 前端強制先呼叫 approve 再 listItem |
| Gas 不足 | 🟢 低 | Sepolia Faucet 領取，測試前確認餘額 |
| Sepolia 節點不穩 | 🟢 低 | Alchemy 備援方案：切換到 Infura |

---

## 6. 預計 Sections

```
S023
├── 0.1 — MyNFT.sol 合約實作
├── 0.2 — NFTMarket.sol 合約實作
├── 0.3 — Hardhat 部署腳本（local + Sepolia）
├── 0.4 — 前端 /mint 頁面
├── 0.5 — 前端 /my-nfts 頁面
├── 0.6 — 前端 /market 頁面
└── 0.7 — Hardhat 合約單元測試
```
