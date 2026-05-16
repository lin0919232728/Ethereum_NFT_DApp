# TODO — Ethereum_NFT_DApp (APP26)

> **類型**: 活文件 🌱（只追加，用 Edit 增量修改）
> **最後更新**: 2026-05-16 21:00 | MSI-P16 | M1 本地環境建立完成，DApp 在 localhost:3000 可訪問

---

## 待處理

### 里程碑 1：環境建立（4-6 小時）

- [x] DEV-001: 安裝 Node.js v22 + yarn 1.22 (2026-05-16)
- [ ] DEV-002: 安裝 MetaMask，備份助記詞，新增 Sepolia 網路
- [ ] DEV-003: 申請 Alchemy 帳號，建立 Sepolia App，取得 API Key
- [x] DEV-004: clone Scaffold-ETH 2 → dapp/ + yarn install（Claude 執行，3m48s）(2026-05-16)
- [x] DEV-005: 三終端跑起來（yarn chain / yarn deploy / yarn start）(2026-05-16)
- [x] DEV-006: 瀏覽器 http://localhost:3000 看到 Scaffold-ETH 2 介面 + Burner Wallet 連接 (2026-05-16)

### 里程碑 2：NFT 合約（8-10 小時）✅ 程式碼已由 Gemini 產出

- [ ] DEV-007: `yarn add @openzeppelin/contracts`（在 packages/hardhat 下）
- [x] DEV-008: 撰寫 `MyNFT.sol`（ERC721URIStorage + Ownable）— Gemini 完成 (2026-05-16)
- [x] DEV-009: 撰寫部署腳本 `01_deploy_nft.ts` — Gemini 完成 (2026-05-16)
- [x] DEV-010: `yarn deploy` 到本地 → MyNFT @ 0x5FbDB231... / NFTMarket @ 0xe7f1725E... (2026-05-16)

### 里程碑 3：市場合約 + 前端（12-15 小時）✅ 程式碼已由 Gemini 產出

- [x] DEV-011: 撰寫 `NFTMarket.sol`（ReentrancyGuard + C-E-I 模式）— Gemini 完成 (2026-05-16)
- [x] DEV-012: 撰寫部署腳本 `02_deploy_market.ts` — Gemini 完成 (2026-05-16)
- [x] DEV-013: 前端 `/mint` 頁面（輸入 URI + 付 ETH）— Gemini 完成 (2026-05-16)
- [x] DEV-014: 前端 `/my-nfts` 頁面（個人收藏 + 上架）— Gemini 完成 (2026-05-16)
- [x] DEV-015: 前端 `/market` 頁面（掛售列表 + 購買/取消）— Gemini 完成 (2026-05-16)
- [ ] DEV-016: 本地完整流程測試（鑄造→上架→購買→取消）（需用戶 clone Scaffold-ETH 2）

### 里程碑 4：Sepolia 部署（4-6 小時）

- [ ] DEV-017: 從 Faucet 領 Sepolia 測試 ETH
- [ ] DEV-018: 設定 `packages/hardhat/.env`（私鑰/Alchemy Key/Etherscan Key）
- [ ] DEV-019: `yarn deploy --network sepolia`
- [ ] DEV-020: `yarn hardhat verify` 合約驗證
- [ ] DEV-021: 更新 `docs/CONTRACT_ADDRESSES.md`
- [ ] DEV-022: `scaffold.config.ts` 切換到 sepolia

### 里程碑 5：完整測試 + 上線（12-15 小時）

- [ ] DEV-023: Pinata 上傳 NFT 圖片 → 取得 Image CID
- [ ] DEV-024: 上傳 metadata JSON → 取得 Metadata CID
- [ ] DEV-025: Sepolia 完整流程測試（鑄造/上架/購買/取消/withdraw）
- [ ] DEV-026: Vercel 部署前端
- [ ] DEV-027: 申請 WalletConnect Project ID，設定 `.env.local`

---

## 已完成

- [x] DEV-000: 建立專案結構（基於 _template4，APP26）(2026-05-16)
- [x] DEV-S023: Spectra S023 全部 7 個任務完成（合約+部署腳本+前端3頁+測試），Gemini B2 橋接完成 (2026-05-16)
- [x] DEV-028: Hardhat 單元測試 NFT.test.ts（13 個測試案例）— Gemini 完成 (2026-05-16)
