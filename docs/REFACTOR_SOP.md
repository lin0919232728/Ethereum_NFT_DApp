# Refactor SOP — 專案架構重構標準流程

> **類型**: 死文件 🔒（流程變更時更新）
> **適用**: 所有需要架構重構的專案
> **來源**: app04 09_claude → 10_AHAwork 實戰歸納（2026-03-28）

---

## 適用情境

當專案出現以下任一狀況，啟動本 SOP：

- Service 超過 1000 行（職責過多）
- 同一個 bug 要改 3 個以上地方
- AI 修一個功能常常壞另一個
- 重複代碼超過 15%
- 缺乏統一的錯誤處理/回應格式

---

## 重構前分析（必做，不可跳過）

### Step 1：抽象層盤點

請 AI 分析以下三個維度：

```
請幫我檢視此專案的：
1. 抽象層（有幾層？每層職責？）
2. 設計架構（MVC/分層架構/模組化？）
3. 設計模式（用了哪些 Pattern？哪些地方可以用但沒用？）

輸出格式：
- 現況圖（文字版架構圖）
- 問題清單（高/中/低優先）
- 重複代碼清單
- 相依關係圖（最複雜的 5 個模組）
```

### Step 2：用 Mermaid 表達重構規劃

建立 5 張圖：
1. 現況問題圖（哪些模組有問題）
2. 目標架構圖（重構後長什麼樣）
3. 優先模組拆分圖（第一個要做的模組）
4. 執行 Phase 規劃圖
5. dev-flow 套用圖

### Step 3：選擇遷移策略

| 策略 | 說明 | 適用情境 |
|------|------|---------|
| **A：全部複製再重構** | 複製到新目錄，在上面重構 | 功能多、不能斷線 |
| **B：只做單一模組** | 只建新模組，舊代碼維持 | 局部改善，快速驗證 |
| **C：複製後逐步重構** | A 的變體，按 Phase 逐步 | **推薦（大型專案）** |

> 策略 C 核心：舊目錄（如 `09_claude`）永久保留作備份，新目錄（如 `10_AHAwork`）是工作區

---

## 目錄命名規範

```
{專案根目錄}/
├── {版本號}_claude/     ← 舊版本（09_claude）
├── {版本號+1}_AHAwork/  ← 新版本工作區（10_AHAwork）
└── {版本號+1}_AHAwork/docs/v{X.X.X}/  ← 版本文件快照
```

---

## Phase 0：備份與遷移（必做）

```bash
# Step 1：commit 舊版本所有未存儲的變更
cd {old_dir}
git add -A
git commit -m "chore: backup pre-refactor state vX.X.X (MSI-P16)"

# Step 2：push 備份 branch
git push origin {date}-{old_dir_name}
# 例：git push origin 26.3.28-09_claude

# Step 3：複製到新目錄（排除 .git / node_modules / dist）
find {old_dir} -not -path "*/.git/*" -not -path "*/node_modules/*" \
  -not -path "*/dist/*" -type f | while read f; do
  dest="{new_dir}/${f#{old_dir}/}"
  mkdir -p "$(dirname "$dest")"
  cp "$f" "$dest"
done

# Step 4：新目錄 git init
cd {new_dir}
git init
git checkout -b {date}-{new_dir_name}
# 例：git checkout -b 26.3.28-10_AHAwork
git add -A
git commit -m "init: {new_dir} — copy from {old_dir} vX.X.X pre-refactor"
```

---

## 版本文件快照（docs/vX.X.X/）

每次重構**起點**建立快照，結構如下：

```
docs/
└── v{當前版本號}/
    ├── 00_INDEX.md              ← 導覽 + 決策記錄
    ├── 01_需求討論.md            ← 現況 + 問題 + 重構目標
    ├── 02_需求設計.md            ← 架構設計 + 模組拆分圖
    ├── 03_前端需求.md            ← 頁面清單 + 組件架構
    ├── 04_後端需求.md            ← API + DB + Pipeline + 服務層
    ├── 05_AI需求.md              ← AI 功能 + Prompt 設計
    └── 06_開發代辦清單/
        ├── 開發任務.md           ← Phase 0~N 逐條 TODO（主 TODO）
        ├── DOC維護.md
        ├── 測試任務.md           ← L1/L2/L3 測試腳本
        ├── 確認任務.md           ← Gate 清單（Phase 開始/結束）
        ├── 任務相依關係.md       ← 哪些可並行
        ├── 輸出文件.md           ← 各 Phase 預期產出
        └── 文件後維護驗證.md     ← commit 後確認項
```

---

## 重構 Phase 規劃原則

### 拆分優先順序
1. **第一個做最獨立、最完整的模組**（如 AlibabaModule）
2. **共用基礎建設並行**（BaseRepository、asyncHandler 可同時做）
3. **核心過胖 Service 拆分第二**（如 ScrapingService）
4. **Pipeline/流程層最後**（依賴其他層穩定）

### Phase 命名規範
```
Phase 0：遷移準備（備份 + 複製 + git init）
Phase 1：{最高優先模組} 重構
Phase 2：{次優先模組} 拆分
Phase 3：{流程層} 重構 + 完整驗收
```

---

## Gate 機制（每個 Phase 的出入口）

### Phase 開始前（邏輯審核 + 技術審核）
```
邏輯審核：
- 各子模組職責有沒有重疊？
- 邊界清楚嗎（A 做什麼、B 做什麼）？

技術審核：
- npm install 成功？
- npx tsc --noEmit 無錯誤？
- .env 設定正確？
```

### Phase 完成後（驗收確認）
```
- Smoke test 通過（/health）
- 核心功能手動測試通過
- npx tsc --noEmit 無錯誤
- npm run build 通過
- 對應文件已更新
- CHANGELOG 已追加
```

---

## 信心水準規則（Devin 建議）

| 動作 | 最低信心要求 |
|------|------------|
| 拆分核心 Service | >= 90% |
| 調整 Repository 層 | >= 85% |
| 修改 Pipeline 步驟 | >= 90% |
| 基礎建設（BaseRepo/Handler） | >= 95% |

> **信心 < 門檻 → 先排查整體邏輯鏈，不動代碼**

---

## 可模組化的常見抽象

每個專案重構時，優先考慮以下抽象：

| 抽象 | 說明 | 何時用 |
|------|------|--------|
| **BaseRepository** | 共用 CRUD，子 Repo 只寫特定查詢 | 有 3+ 個 Repository 時 |
| **asyncHandler** | Express 路由統一 try-catch 包裝 | 有 5+ 個路由時 |
| **統一回應格式** | `{ status, data }` 中央 formatter | 任何時候 |
| **Strategy Pattern** | 多種相似策略（如爬取策略） | 有 3+ 種類似做法時 |
| **State Machine** | 統一狀態定義，不散落各處 | 有 Pipeline/流程時 |
| **Error Handler** | 中央錯誤處理 middleware | Express 專案必備 |

---

## 文件版本控管

```
重構起點  → docs/v{現有版本}/（快照）
Phase 1 完成 → docs/v{次要版本+1}/（新版本）
Phase 2 完成 → 更新對應文件
Phase 3 完成 → docs/v{主要版本}.0.0/（里程碑）
```

---

## 反模式（禁止清單）

- ❌ 邊重構邊加新功能
- ❌ 信心不足直接動代碼
- ❌ 重構完沒跑 tsc + build
- ❌ Phase 完成沒更新文件
- ❌ 沒建 Gate 清單直接進下一 Phase
- ❌ Mock 資料繼續散落各處
