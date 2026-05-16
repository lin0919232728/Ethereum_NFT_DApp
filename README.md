# Ethereum_NFT_DApp — APP26

> 版本: v0.1.0
> APP 編號: app26
> 技術: Scaffold-ETH 2 + Solidity + Next.js + wagmi/viem

## 專案說明

以太坊 NFT 鑄造 + 去中心化市場 DApp。

- **MyNFT.sol** — ERC721 鑄造合約（最大 100 個，0.01 ETH/個）
- **NFTMarket.sol** — 鏈上市場（掛售/購買/取消，2.5% 手續費）
- **前端** — Next.js + RainbowKit + wagmi，四頁面（首頁/鑄造/我的NFT/市場）

## 目錄結構

```
Ethereum_NFT_DApp/
├── dapp/                  ← Scaffold-ETH 2（主程式，git clone 後放這）
│   └── packages/
│       ├── hardhat/       ← 智慧合約（Solidity）
│       └── nextjs/        ← 前端（Next.js）
├── docs/                  ← 專案文件
├── openspec/              ← Spectra 規格管理
├── scripts/               ← 工具腳本
├── tests/                 ← 測試
├── CLAUDE.md              ← 專案規範（含合約架構）
├── TODO.md                ← 任務追溯
├── CHANGELOG.md           ← 版本歷程
└── VERSION                ← v0.1.0
```

## 快速開始

```bash
# 1. Clone Scaffold-ETH 2 到 dapp/
git clone https://github.com/scaffold-eth/scaffold-eth-2.git dapp
cd dapp && yarn install

# 2. 三個終端同時跑
yarn chain      # 本地區塊鏈
yarn deploy     # 部署合約
yarn start      # 前端 http://localhost:3000
```

## 里程碑

| # | 里程碑 | 狀態 |
|---|--------|------|
| M1 | 環境建立 + Scaffold-ETH 2 跑起來 | ⏳ |
| M2 | MyNFT.sol 合約部署到本地 | ⏳ |
| M3 | NFTMarket.sol + 前端四頁面 | ⏳ |
| M4 | 部署到 Sepolia 測試網 | ⏳ |
| M5 | 完整功能測試 + Vercel 部署 | ⏳ |

## 學習資源

- Scaffold-ETH 2 文件: https://docs.scaffoldeth.io
- SpeedRunEthereum（互動式學習）: https://speedrunethereum.com
- OpenZeppelin 合約文件: https://docs.openzeppelin.com/contracts
- Sepolia Faucet（測試 ETH）: https://sepoliafaucet.com
