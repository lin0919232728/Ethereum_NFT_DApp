---
name: spectra-apply
description: 用戶確認 Spectra change 後，依 tasks 順序派代理人實作並逐項勾選 checkbox
---

# /spectra-apply {change-name}

用戶在 app.exe 看完 spec/tasks 說「OK / 派 / 確認」後，主視窗執行這個 slash 開工。

## 執行步驟

```bash
SPECTRA="C:/Users/MT2505/AppData/Local/Spectra/spectra.exe"
CHANGE="$1"

echo "=== Phase 4 實作開始：$CHANGE ==="

# Step 1: 看 tasks DAG 找出無依賴可平行的任務
$SPECTRA status --change "$CHANGE"

# Step 2: 為每個 task 建派工單（精簡格式）
#   docs/agent-tasks/NNN-YYYYMMDD-{任務}-{代理人}-OPEN.md
#   必含欄位：
#     - Spectra Change: $CHANGE
#     - 對應 Spectra Tasks: <ID>
#     - Agent: <中文名> (#<編號>)

# Step 3: 派 sub-agent
#   sub-agent 只研究/規劃，主視窗負責 Edit/Write 落檔（坑 7）
#   完成後寫 docs/agent-reports/NNN-...-DONE.md

# Step 4: 每完成一個 task 立刻勾選
$SPECTRA task done <task-id>

# Step 5: 全部完成後（Phase 5 收尾）
#   - 派 🔍 critic 整合審查
#   - 派 🔮 risk-forecaster（若有跨模組/新 API/格式字串）
#   - 零 P0/P1 → spectra audit → spectra archive
$SPECTRA audit
$SPECTRA archive "$CHANGE"
```

## Sub-agent 派工模板

```markdown
**Spectra Change**: <change-name>
**對應 Spectra Tasks**: 1.1, 1.2
**Agent**: 資深工程師 (#2)

## 目標
{一句話}

## 輸入
- 程式碼路徑（絕對）
- spec 參考：openspec/changes/{change}/specs/{cap}/spec.md §{X.Y}

## 輸出
docs/agent-reports/NNN-YYYYMMDD-{任務}-{代理人}-OPEN.md（不寫程式，只回報告）

## 驗收
對照 spec §{X.Y}「{requirement}」→ {可觀察條件}

## 邊界
不動 {模組}；不推；不部署
```

## 失敗回退

- task 跑出來不符 spec → 不要硬改，回 Phase 3 修 spec → 重跑 validate+analyze → 用戶 OK → 重派
- 卡關超過 3 輪 → 觸發升級機制（A~E 方案，見 memory `feedback_stuck_escalation.md`）
