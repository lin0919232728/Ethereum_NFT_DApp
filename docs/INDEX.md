# Ethereum_NFT_DApp — 文件索引 (APP26)

> **版本**: v0.1.0
> **最後更新**: 2026-05-16
> **APP 編號**: app26

---

## 文件目錄結構

```
docs/
├── [根層]          長青技術文件（跨版本有效）
├── modules/        模組技術說明（每個功能模組一份）
├── reference/      外部工具 / 第三方服務規格（靜態）
├── agent-reports/  代理人執行記錄（OPEN → DONE lifecycle）
└── vX.Y.Z/         版本設計工作區（開發期活躍，完成後歸檔）
    ├── 00_INDEX.md  ← 本版本索引，先建
    ├── 01_xxx.md    ← 依設計推進順序遞增編號
    ├── ...
    └── patches/     PATCH 版本差異文件
```

---

## 死文件（Dead Docs）— 固定規範 🔒

> 修改需全組討論。AI 每次寫碼前必須對照。

| 文件 | 說明 |
|------|------|
| [CODING_STANDARDS.md](CODING_STANDARDS.md) | AI 寫碼執行指南（命名/格式/禁止清單）|
| [STATE_DEFINITIONS.md](STATE_DEFINITIONS.md) | 合約狀態機定義 |
| [DEPLOYMENT.md](DEPLOYMENT.md) | 部署流程（合約 + 前端 Vercel）|
| [CONTRACT_ADDRESSES.md](CONTRACT_ADDRESSES.md) | 各網路合約地址記錄 |

---

## 活文件（Living Docs）— 隨開發成長 🌱

### 規格類（動手前必寫）

| 文件 | 說明 | 更新時機 |
|------|------|---------|
| [FEATURE_SPEC.md](FEATURE_SPEC.md) | BDD 規格（Feature/Rule/GWT）| **新合約功能前必填** |
| [API_REFERENCE.md](API_REFERENCE.md) | 合約函數 + 前端 API | 合約/API 變更後 |

### 追蹤類（只追加不覆蓋）

| 文件 | 說明 | 更新時機 |
|------|------|---------|
| [DISCOVERY_LOG.md](DISCOVERY_LOG.md) | 需求追蹤 DL-XXX | 每次新需求/決策 |
| [INCIDENT_LOG.md](INCIDENT_LOG.md) | 問題記錄 INC-XXX | 每次 bug fix |
| [../TODO.md](../TODO.md) | 任務追溯 DEV-XXX | 任務新增/完成 |
| [../CHANGELOG.md](../CHANGELOG.md) | 版本歷程 | 每次部署 |

---

## 重構 SOP（需要架構重整時）

| 文件 | 說明 |
|------|------|
| [REFACTOR_SOP.md](REFACTOR_SOP.md) | **架構重構標準流程**（備份→遷移→Phase規劃→Gate）|

> 觸發條件：Service >1000行 / 同一 bug 改 3+ 處 / AI 修一個功能壞另一個

---

## 版本設計工作區（vX.Y.Z/）

| 版本 | 狀態 | 主要內容 |
|------|------|---------|
| [v0.1.0/](v0.1.0/00_INDEX.md) | 🔵 進行中 | 初始版本 |

---

## 模組技術文件（modules/）

| 模組 | 文件 | 說明 |
|------|------|------|
| MyNFT | _(待建)_ | ERC721 鑄造合約架構說明 |
| NFTMarket | _(待建)_ | 市場合約架構說明 |
| 前端頁面 | _(待建)_ | Mint / MyNFTs / Market 頁面說明 |

---

## 外部工具規格（reference/）

| 工具 | 文件 | 說明 |
|------|------|------|
| _(尚無)_ | — | — |

---

## 文件更新順序（每次開發後）

```
新版本開發 → 建立 docs/vX.Y.Z/00_INDEX.md，開始記錄
建表前     → FEATURE_SPEC.md（規格先行）
建表後     → DB_SCHEMA.md
加 API     → API_REFERENCE.md + INTEGRATION_MANIFEST.md（對外 API 欄）
加流程     → PIPELINE_CONTRACT.md
跨APP依賴  → INTEGRATION_MANIFEST.md + doc/ECOSYSTEM_MAP.md（同步更新）
設計文件   → vX.Y.Z/NN_xxx.md（依序追加編號）
發現新事   → DISCOVERY_LOG.md
修 bug     → INCIDENT_LOG.md
完成任務   → TODO.md（標記完成）
部署後     → CHANGELOG.md + VERSION
版本完成   → vX.Y.Z/00_INDEX.md 狀態改 ✅，開新 vX+1.Y.Z/
```
