---
name: spectra-validate
description: 灌完 Spectra artifacts 後跑 validate + analyze，0 findings 才能進下一階段
---

# /spectra-validate {change-name}

灌完 proposal/design/spec/tasks 後，主視窗自動跑這個 slash 來驗證。

## 執行步驟

```bash
SPECTRA="C:/Users/MT2505/AppData/Local/Spectra/spectra.exe"
CHANGE="$1"   # 從 args 拿 change name

echo "=== Phase 2/3 驗證：$CHANGE ==="

# Step 1: validate（格式 + normative）
$SPECTRA validate "$CHANGE" || { echo "❌ validate 失敗，立刻修並重灌"; exit 1; }

# Step 2: analyze（一致性 + 缺漏）
$SPECTRA analyze "$CHANGE" || { echo "❌ analyze 有 finding，立刻修並重灌"; exit 1; }

# Step 3: 標記 in-progress（僅 Phase 3 用）
# $SPECTRA in-progress add "$CHANGE"

echo "✅ 驗證全清，請通知用戶開 app.exe 核對"
```

## 失敗時的應對（按 finding 類型）

| Finding | 對應坑 | 修法 |
|---------|------|------|
| `Capability X has no corresponding spec file` | 坑 1 | proposal 移除含 `/` 的路徑字串 |
| `Design topic X not referenced in tasks` | 坑 2 | tasks 加「Decision: X — ...」前綴 |
| `Vague language 'X' found` | 坑 4 | should/may/might → SHALL/MUST |
| Scenario 不顯示 | 坑 3 | `### Scenario:` 改 `#### Scenario:` |
| Normative language not English | 坑 5 | 中文段加 `> 中文：` blockquote 包起來 |

## 通過後的下一步

通知用戶：
```
✅ Spectra change `<name>` 已通過 validate + analyze（0 findings）
📋 規格：N 份 | 任務：M 個 checkbox
👉 請開 C:\Users\MT2505\AppData\Local\Spectra\app.exe 核對
   確認後說「派代理人」/「OK go」我才開工
```
