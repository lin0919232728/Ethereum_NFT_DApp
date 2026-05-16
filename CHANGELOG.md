# Changelog — Ethereum_NFT_DApp (APP26)

> **類型**: 活文件 🌱（新版本插入頂部，用 Edit 增量修改）

---

## 2026-05-16 21:00 v0.1.4 — M1 本地環境建立完成

- yarn 1.22 安裝完成（全域）
- Scaffold-ETH 2 clone 到 dapp/，yarn install 完成（1901 套件）
- 合約程式碼複製進 Scaffold-ETH 2 結構，BOM 字元修復（MyNFT.sol + NFTMarket.sol）
- yarn deploy 成功：MyNFT @ 0x5FbDB2315678afecb367f032d93F642f64180aa3
- yarn deploy 成功：NFTMarket @ 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
- yarn start 成功，localhost:3000 可訪問，Burner Wallet 自動連接
- ngrok 說明完成（快速 demo 用途）

**下一步**: DEV-002 MetaMask + DEV-003 Alchemy → M4 Sepolia 部署

---

## 2026-05-16 19:00 v0.1.3 — Critic P1/P2 修復（Gemini CR-1~CR-5）

- MyNFT.sol：totalSupply() 改用 _totalSupply 計數器，邊界條件語意清楚
- MyNFT.sol：withdraw() 新增 Withdrawn(to, amount) 事件
- NFTMarket.sol：feeRecipient 零地址防護（constructor require）
- NFTMarket.sol：buyItem fee transfer 失敗時不 DoS（费用併入 sellerProceeds）
- NFTMarket.sol：listItem 加入重複上架防護（Item already listed）
- /mint 頁面：mintPrice undefined 防護；成功後顯示 Token ID + 跳轉連結
- /my-nfts 頁面：步驟狀態 UI（授權中/上架中/成功/失敗）；per-card listPrice
- /market 頁面：buyItem/cancelListing async error handling + 交易狀態顯示
- NFT.test.ts：revertedWithCustomError(OwnableUnauthorizedAccount)；精確 balance 斷言
- 02_deploy_market.ts：log MyNFT deployed address

**合約**: 尚未部署（等用戶 clone Scaffold-ETH 2 到 dapp/）
**下一步**: 用戶執行 M1 環境建立 → yarn chain/deploy/start → 本地驗證

---

## 2026-05-16 18:00 v0.1.2 — Critic P0 修復

- my-nfts/page.tsx：移除硬編碼 tokenIds，改用 useScaffoldEventHistory 讀取真實 Transfer 事件差集
- market/page.tsx：移除硬編碼 listedTokenIds，改用 ItemListed 事件 + getListing isActive 過濾
- market/page.tsx：NFTCard 定義明確 NFTCardProps 介面（移除 any 型別）
- my-nfts + market：deployedContracts 改用 useDeployedContractInfo（移除 as any + chainId 防護）
- NFT.test.ts：MAX_SUPPLY 測試從空 stub 改為真實迴圈 mint 100 次 + revert 斷言
- Critic 結論：P0 全清，P1×8 + P2×6 建議後續跟進

**合約**: 尚未部署（等用戶 clone Scaffold-ETH 2 到 dapp/）
**下一步**: 用戶執行 yarn chain/deploy/start → 本地驗證

---

## 2026-05-16 17:00 v0.1.1 — S023 程式碼全部完成（Gemini）

- MyNFT.sol：ERC721URIStorage + Ownable（OZ v5），支付鑄造、MAX_SUPPLY=100、提領功能
- NFTMarket.sol：ReentrancyGuard + C-E-I 模式，listItem/buyItem(2.5%手續費)/cancelListing
- 部署腳本：01_deploy_nft.ts + 02_deploy_market.ts（Hardhat）
- 前端三頁面：/mint / /my-nfts / /market（Next.js + wagmi v2 + Scaffold-ETH 2 hooks）
- 單元測試：NFT.test.ts（13 個測試案例，MyNFT 6 + NFTMarket 7）
- Spectra S023 進度：7/7 DONE，卡號 208-214 全部歸檔

**合約**: 尚未部署（等用戶 clone Scaffold-ETH 2 到 dapp/）
**下一步**: Critic 審查 → 用戶執行 yarn chain/deploy/start → 本地驗證

---

## 2026-05-16 16:00 v0.1.0 — 初始化

- 建立專案結構（基於 _template4）
- 確認技術棧：Scaffold-ETH 2 + Hardhat + Next.js + wagmi/viem + RainbowKit
- 確認合約架構：MyNFT.sol（ERC721）+ NFTMarket.sol
- 設定 docs/ 文件索引
- APP 編號：app26

**合約**: 尚未部署
**Commit**: 初始化
