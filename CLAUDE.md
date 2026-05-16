# Ethereum_NFT_DApp — CLAUDE.md

> **APP 編號**: app26
> **部署目標**: Sepolia 測試網（初期）→ Arbitrum/Base L2（正式）
> **前端**: Vercel
> **合約網路**: Ethereum Sepolia / L2

---

## 專案概述

以太坊 NFT 鑄造 + 去中心化市場 DApp。用戶可鑄造 ERC721 NFT，並在鏈上市場進行掛售、購買、取消掛售。

## 技術棧

| 層級 | 技術 | 說明 |
|------|------|------|
| **腳手架** | Scaffold-ETH 2 | 開箱即用 DApp 開發框架 |
| **智慧合約** | Solidity 0.8.x + OpenZeppelin | ERC721, ReentrancyGuard |
| **合約工具** | Hardhat（Scaffold-ETH 2 預設）| 編譯、測試、部署 |
| **前端** | Next.js 14 + Tailwind CSS | SSR，Vercel 最佳支援 |
| **Web3 連接** | wagmi v2 + viem | React hooks 原生，最輕量 |
| **錢包** | RainbowKit | UI 完整，支援多錢包 |
| **RPC 節點** | Alchemy | 免費方案，API 穩定性最佳 |
| **NFT 儲存** | IPFS / Pinata | 去中心化標準 |
| **測試網** | Sepolia | 以太坊官方推薦（Goerli 已廢棄）|
| **規格管理** | Spectra Gate v2 | proposal → design → spec → tasks |

## 目錄結構

```
Ethereum_NFT_DApp/
├── dapp/                          ← Scaffold-ETH 2 主程式（git clone 後放這）
│   ├── packages/
│   │   ├── hardhat/               ← 智慧合約
│   │   │   ├── contracts/
│   │   │   │   ├── MyNFT.sol      ← ERC721 鑄造合約
│   │   │   │   └── NFTMarket.sol  ← 市場合約
│   │   │   └── deploy/
│   │   └── nextjs/                ← Next.js 前端
│   │       └── app/
│   │           ├── mint/          ← 鑄造頁面
│   │           ├── my-nfts/       ← 我的 NFT
│   │           └── market/        ← 市場
│   └── scaffold.config.ts         ← 網路設定（切換 sepolia/mainnet）
│
├── docs/                          ← 專案文件
├── openspec/                      ← Spectra 規格（proposal/design/spec/tasks）
├── scripts/                       ← 工具腳本
├── tests/                         ← 合約測試（Hardhat）
├── CLAUDE.md                      ← 本文件
├── TODO.md                        ← 任務追溯
├── CHANGELOG.md                   ← 版本歷程
└── VERSION                        ← 版本號
```

## 合約架構

### MyNFT.sol（ERC721）
- `mint(tokenURI)` — 鑄造，需支付 mintPrice（預設 0.01 ETH）
- `MAX_SUPPLY = 100` — 最大供應量
- `totalSupply()` — 已鑄造數量
- `setMintPrice(price)` — 擁有者修改定價（onlyOwner）
- `withdraw()` — 擁有者提領累積 ETH（onlyOwner）

### NFTMarket.sol
- `listItem(nftContract, tokenId, price)` — 上架（需先 approve）
- `buyItem(nftContract, tokenId)` — 購買（附 ETH，含 2.5% 手續費）
- `cancelListing(nftContract, tokenId)` — 取消掛售
- 安全：`ReentrancyGuard` + Checks-Effects-Interactions 模式

## 開發規範

> 全域規範見 `C:\Users\MT2505\CLAUDE.md`
> 本文件只記載本專案特有規範

### 本專案特有規則

1. **私鑰絕對不可 commit** — `.env` 已在 `.gitignore`，不可用 `--no-verify` 繞過
2. **合約上架前必須先 approve** — 忘記 approve 直接 listItem 會 revert
3. **測試網用獨立錢包** — 測試用錢包與主網資金完全分開
4. **Sepolia ETH 從 Faucet 領取** — https://sepoliafaucet.com（需 Alchemy 帳號）
5. **合約部署後更新 docs/CONTRACT_ADDRESSES.md** — 記錄每次部署的合約地址

### 合約修改規則

| 時機 | 動作 |
|------|------|
| 修改合約前 | 確認合約功能已在 openspec/changes/ 記錄 |
| 部署到 Sepolia 後 | 更新 `docs/CONTRACT_ADDRESSES.md` |
| 合約驗證後 | 確認 Etherscan Sepolia 顯示綠色勾勾 |
| 重大功能前 | 走 Spectra Gate v2（openspec/changes/）|

## 快速指令

```bash
# 進入 DApp 目錄
cd dapp

# 安裝依賴（首次）
yarn install

# 本機開發（三個終端同時跑）
yarn chain      # 終端 1：啟動本地區塊鏈（Hardhat Network）
yarn deploy     # 終端 2：部署合約到本地鏈
yarn start      # 終端 3：啟動前端 http://localhost:3000

# 部署到 Sepolia 測試網
yarn deploy --network sepolia

# 合約驗證（Etherscan Sepolia）
yarn hardhat verify --network sepolia <CONTRACT_ADDRESS> "<OWNER_ADDRESS>"

# 合約測試
yarn hardhat test
```

## 環境變數

**dapp/packages/hardhat/.env**（不可 commit）
```env
DEPLOYER_PRIVATE_KEY=MetaMask私鑰（無0x前綴）
ALCHEMY_API_KEY=Alchemy_API_Key
ETHERSCAN_API_KEY=Etherscan_API_Key
```

**dapp/packages/nextjs/.env.local**（不可 commit）
```env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=WalletConnect_Project_ID
```

## 開發流程

使用 Spectra Gate v2 開始新功能（`openspec/changes/` 目錄）。

新功能前必查：
```
□ openspec/changes/ 有無對應 change（proposal 先行）
□ docs/CONTRACT_ADDRESSES.md 合約地址是否最新
□ dapp/scaffold.config.ts 網路設定正確
□ .env 私鑰未 commit（git status 確認）
```

## 文件索引

見 `docs/INDEX.md`

---

## ★ 關鍵資源連結

| 資源 | 說明 |
|------|------|
| https://docs.scaffoldeth.io | Scaffold-ETH 2 官方文件 |
| https://sepoliafaucet.com | Sepolia 測試 ETH 領取 |
| https://sepolia.etherscan.io | Sepolia 合約驗證 |
| https://pinata.cloud | IPFS NFT metadata 上傳 |
| https://speedrunethereum.com | 互動式 DApp 學習 |
| https://docs.openzeppelin.com/contracts | OpenZeppelin 合約文件 |
