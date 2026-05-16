---
name: critic-gate
description: Phase 5 整合審查閘 — 派 critic + risk-forecaster 同步審查，零 P0/P1 才能 commit/deploy
---

# /critic-gate {change-name}

所有 tasks 勾完後執行。**強制機制**，不需用戶提醒。

## 執行步驟

```bash
SPECTRA="C:/Users/MT2505/AppData/Local/Spectra/spectra.exe"
CHANGE="$1"

echo "=== Phase 5 整合審查：$CHANGE ==="

# Step 1: 同步派 critic + risk-forecaster
#   critic：審程式碼、規格符合度、安全、邊界
#   risk-forecaster：找隱式合約、跨模組影響、未來變動點
#   兩者輸出存到 docs/agent-reports/

# Step 2: 對照 spec.md 看實作是否漂移
#   每個 capability 跑：
#   $SPECTRA show "$CHANGE" --capability <cap>
#   然後 grep 程式碼確認 SHALL 條目都實作

# Step 3: 跑 standards-check skill
#   /standards-check → 對照 docs/CODING_STANDARDS.md / STATE_DEFINITIONS.md

# Step 4: 跑 spectra audit
$SPECTRA audit

# Step 5: 整理 findings
#   P0：程式崩潰 / 資料遺失 / 安全漏洞 → 立刻退回 Phase 3
#   P1：規格不符 / 重要邊界沒處理 → 立刻退回 Phase 3
#   P2：可改進但不擋 → 列 backlog
#   P3：建議事項 → 記 DISCOVERY_LOG

# Step 6: 零 P0/P1 才能進入 Phase 5 完工
```

## 通過後的動作

```bash
# git commit（帶裝置名，不 push 除非要求）
git add -A
git commit -m "feat: <description> ($CHANGE) (MSI-P16)"

# 歸檔 Spectra change
$SPECTRA archive "$CHANGE"

# 改名所有 OPEN → DONE
# docs/agent-reports/NNN-...-OPEN.md → DONE.md
# 更新 docs/agent-reports/REVIEW_INDEX.md

# 同步 NCB（git push 後）
cd C:/flaskspace/Claude/project/AI_conversation_record && uv run python sync_ncb.py
```

## 阻擋規則

- 任一 P0/P1 沒清 → **不准 commit / 不准 deploy / 不准 archive**
- critic / risk-forecaster 任一 agent 沒跑 → 不算通過
- 跨 APP schema 變動 → 必須額外通知下游 APP（建 schema-compat-check report）
