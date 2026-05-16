# S023 Tasks — Ethereum NFT DApp (APP26)

> **Change ID**: S023
> **APP**: app26
> **總任務數**: 7
> **建立日期**: 2026-05-16
> **進度**: 0/7

---

## T001 — MyNFT.sol 合約實作

| 欄位 | 值 |
|------|-----|
| section | 0.1 |
| 依賴 | 無 |
| 複雜度 | 🟡 中 |
| 預估時間 | 2 小時 |
| 負責單位 | Gemini CLI |
| output_filename | `001-20260516-APP26-S023-MyNFT-contract-GEM.md` |
| 狀態 | ⏳ 待執行 |

**目標**: 在 `dapp/packages/hardhat/contracts/MyNFT.sol` 實作完整 ERC721 合約

**產出**:
- `C:\flaskspace\Claude\project\Ethereum_NFT_DApp\dapp\packages\hardhat\contracts\MyNFT.sol`

**規格參考**: `spec/contracts.md §Section 0.1`

**驗收**:
- [x] 繼承 ERC721URIStorage + Ownable
- [x] mint() 含付費邏輯 + MAX_SUPPLY 檢查
- [x] withdraw() onlyOwner
- [x] 兩個 override（tokenURI + supportsInterface）
- [x] emit NFTMinted 事件

---

## T002 — NFTMarket.sol 合約實作

| 欄位 | 值 |
|------|-----|
| section | 0.2 |
| 依賴 | T001（需 ERC721 IERC721 介面）|
| 複雜度 | 🟡 中 |
| 預估時間 | 2 小時 |
| 負責單位 | Gemini CLI |
| output_filename | `002-20260516-APP26-S023-NFTMarket-contract-GEM.md` |
| 狀態 | ⏳ 待執行 |

**目標**: 實作 `dapp/packages/hardhat/contracts/NFTMarket.sol`

**產出**:
- `C:\flaskspace\Claude\project\Ethereum_NFT_DApp\dapp\packages\hardhat\contracts\NFTMarket.sol`

**規格參考**: `spec/contracts.md §Section 0.2`

**驗收**:
- [x] 繼承 ReentrancyGuard
- [x] listItem：三項 require + Listing 儲存 + emit
- [ ] buyItem：nonReentrant + C-E-I 順序 + 手續費計算 + 退款
- [ ] cancelListing：owner check + isActive=false
- [ ] FEE_PERCENT=25, FEE_BASE=1000（2.5%）

---

## T003 — Hardhat 部署腳本

| 欄位 | 值 |
|------|-----|
| section | 0.3 |
| 依賴 | T001、T002 |
| 複雜度 | 🟢 低 |
| 預估時間 | 1 小時 |
| 負責單位 | Gemini CLI |
| output_filename | `003-20260516-APP26-S023-deploy-scripts-GEM.md` |
| 狀態 | ⏳ 待執行 |

**目標**: 撰寫 Hardhat 部署腳本（本地 + Sepolia 共用）

**產出**:
- `C:\flaskspace\Claude\project\Ethereum_NFT_DApp\dapp\packages\hardhat\deploy\01_deploy_nft.ts`
- `C:\flaskspace\Claude\project\Ethereum_NFT_DApp\dapp\packages\hardhat\deploy\02_deploy_market.ts`

**規格**:

```typescript
// 01_deploy_nft.ts
await deploy("MyNFT", {
  from: deployer,
  args: [deployer],    // initialOwner = deployer
  log: true,
  autoMine: true,
});

// 02_deploy_market.ts（依賴 MyNFT 已部署）
await deploy("NFTMarket", {
  from: deployer,
  args: [deployer],    // feeRecipient = deployer
  log: true,
  autoMine: true,
});
```

**驗收**:
- [ ] `yarn deploy` 本地成功（兩個合約地址均顯示）
- [ ] tags 設定正確（"MyNFT" / "NFTMarket"）
- [ ] 02 依賴 01（HRE.deployments.get("MyNFT") 成功）

---

## T004 — 前端 /mint 頁面

| 欄位 | 值 |
|------|-----|
| section | 0.4 |
| 依賴 | T003（合約需已部署，ABI 才存在）|
| 複雜度 | 🟡 中 |
| 預估時間 | 3 小時 |
| 負責單位 | Gemini CLI |
| output_filename | `004-20260516-APP26-S023-mint-page-GEM.md` |
| 狀態 | ⏳ 待執行 |

**目標**: 實作 `dapp/packages/nextjs/app/mint/page.tsx`

**產出**:
- `C:\flaskspace\Claude\project\Ethereum_NFT_DApp\dapp\packages\nextjs\app\mint\page.tsx`

**規格參考**: `spec/frontend.md §Section 0.4`

**驗收**:
- [ ] 顯示鑄造費用（格式化 ETH）
- [ ] 顯示剩餘名額
- [ ] 未連接錢包時按鈕 disabled
- [ ] 交易狀態顯示（pending / success / error）
- [ ] TypeScript 無 any 型別錯誤

---

## T005 — 前端 /my-nfts 頁面

| 欄位 | 值 |
|------|-----|
| section | 0.5 |
| 依賴 | T003 |
| 複雜度 | 🟡 中 |
| 預估時間 | 3 小時 |
| 負責單位 | Gemini CLI |
| output_filename | `005-20260516-APP26-S023-mynfts-page-GEM.md` |
| 狀態 | ⏳ 待執行 |

**目標**: 實作 `dapp/packages/nextjs/app/my-nfts/page.tsx`

**產出**:
- `C:\flaskspace\Claude\project\Ethereum_NFT_DApp\dapp\packages\nextjs\app\my-nfts\page.tsx`

**規格參考**: `spec/frontend.md §Section 0.5`

**驗收**:
- [ ] 只顯示當前帳號 NFT
- [ ] 上架兩步驟（approve → listItem）
- [ ] 已上架的 NFT 顯示「已上架」狀態
- [ ] 未連接錢包顯示提示

---

## T006 — 前端 /market 頁面

| 欄位 | 值 |
|------|-----|
| section | 0.6 |
| 依賴 | T003 |
| 複雜度 | 🟡 中 |
| 預估時間 | 3 小時 |
| 負責單位 | Gemini CLI |
| output_filename | `006-20260516-APP26-S023-market-page-GEM.md` |
| 狀態 | ⏳ 待執行 |

**目標**: 實作 `dapp/packages/nextjs/app/market/page.tsx`

**產出**:
- `C:\flaskspace\Claude\project\Ethereum_NFT_DApp\dapp\packages\nextjs\app\market\page.tsx`

**規格參考**: `spec/frontend.md §Section 0.6`

**驗收**:
- [ ] 只顯示 isActive=true 的掛售
- [ ] 自己的顯示「取消」，別人的顯示「購買」
- [ ] 購買成功後列表更新
- [ ] 售價格式化顯示（ETH 單位）

---

## T007 — Hardhat 合約單元測試

| 欄位 | 值 |
|------|-----|
| section | 0.7 |
| 依賴 | T001、T002 |
| 複雜度 | 🟡 中 |
| 預估時間 | 3 小時 |
| 負責單位 | Gemini CLI |
| output_filename | `007-20260516-APP26-S023-hardhat-tests-GEM.md` |
| 狀態 | ⏳ 待執行 |

**目標**: 實作 `dapp/packages/hardhat/test/NFT.test.ts`

**產出**:
- `C:\flaskspace\Claude\project\Ethereum_NFT_DApp\dapp\packages\hardhat\test\NFT.test.ts`

**規格**:
```
MyNFT 測試（6 個）:
  ✓ mint 成功，totalSupply = 1
  ✓ mint 金額不足 → revert
  ✓ mint 超過 MAX_SUPPLY → revert
  ✓ withdraw 成功（owner）
  ✓ withdraw 失敗（非 owner）
  ✓ tokenURI 回傳正確

NFTMarket 測試（7 個）:
  ✓ listItem 成功（已 approve）
  ✓ listItem 失敗（未 approve）
  ✓ buyItem 成功（NFT 轉移 + ETH 分配）
  ✓ buyItem 失敗（金額不足）
  ✓ buyItem 失敗（自己買自己）
  ✓ cancelListing 成功
  ✓ cancelListing 失敗（非賣家）
```

**驗收**:
- [ ] `yarn hardhat test` 全部 13 個 pass
- [ ] 使用 Hardhat + ethers.js v6 語法
- [ ] 使用 `expect` from chai

---

## 進度追蹤

| Task | Section | 狀態 | 負責 | 完成時間 |
|------|---------|------|------|---------|
| T001 MyNFT.sol | 0.1 | ✅ DONE | GEM-MT2505 | 2026-05-16 |
| T002 NFTMarket.sol | 0.2 | ✅ DONE | GEM-MT2505 | 2026-05-16 |
| T003 部署腳本 | 0.3 | ✅ DONE | GEM-MT2505 | 2026-05-16 |
| T004 /mint | 0.4 | ✅ DONE | GEM-MT2505 | 2026-05-16 |
| T005 /my-nfts | 0.5 | ✅ DONE | GEM-MT2505 | 2026-05-16 |
| T006 /market | 0.6 | ✅ DONE | GEM-MT2505 | 2026-05-16 |
| T007 合約測試 | 0.7 | ✅ DONE | GEM-MT2505 | 2026-05-16 |
