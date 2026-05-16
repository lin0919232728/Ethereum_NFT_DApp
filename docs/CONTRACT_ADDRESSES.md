# 合約地址記錄 — Ethereum_NFT_DApp (APP26)

> **類型**: 活文件 🌱（每次部署後更新）
> **最後更新**: 2026-05-16 | 尚未部署

---

## Sepolia 測試網

| 合約 | 地址 | 部署日期 | Etherscan | 驗證 |
|------|------|---------|-----------|------|
| MyNFT | _(待部署)_ | — | — | — |
| NFTMarket | _(待部署)_ | — | — | — |

---

## 本地開發網路（Hardhat Network）

| 合約 | 地址 | 備注 |
|------|------|------|
| MyNFT | 0x5FbDB2315678afecb367f032d93F642f64180aa3 | 每次重啟會重置 |
| NFTMarket | 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 | 每次重啟會重置 |

> 本地地址為 Hardhat 預設第一/第二個部署地址，僅供參考

---

## 主網 / L2（正式，未來用）

| 合約 | 網路 | 地址 | 部署日期 |
|------|------|------|---------|
| _(未來規劃)_ | Arbitrum / Base | — | — |

---

## 部署指令速查

```bash
# 部署到 Sepolia
cd dapp
yarn deploy --network sepolia

# 驗證合約（填入實際地址）
yarn hardhat verify --network sepolia <MYNFT_ADDRESS> "<OWNER_ADDRESS>"
yarn hardhat verify --network sepolia <MARKET_ADDRESS> "<FEE_RECIPIENT_ADDRESS>"
```
