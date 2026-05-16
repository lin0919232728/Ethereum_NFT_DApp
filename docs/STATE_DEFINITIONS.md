# State Definitions — 狀態機定義

> **類型**: 死文件 🔒
> **目的**: 全 APP 狀態值統一，APP14 才能正確監控
> **規則**: 不得自創狀態名，全小寫，區分大小寫

---

## Pipeline 任務狀態（7 種，全 APP 強制一致）

| 狀態值 | 定義 | 觸發條件 |
|--------|------|---------|
| `pending` | 等待執行 | 任務剛建立 |
| `running` | 執行中 | 節點開始處理 |
| `completed` | 完成有結果 | 跑完且有資料 |
| `completed_empty` | 完成無結果（非錯誤） | 跑完但 0 結果 |
| `failed` | 失敗 | 拋出例外、API 錯誤 |
| `skipped` | 用戶未選此步 | **唯一合法原因：用戶 selected_stages 不含此步** |
| `not_applicable` | 上游判斷不需要 | 程式邏輯確認不需要（非用戶決定） |

### ⚠️ 嚴格區分（用錯 APP14 扣 -3 分）

```
skipped          → 用戶沒勾選這個步驟
not_applicable   → 程式邏輯判斷這步不需要
completed_empty  → 步驟有跑，但結果是 0 筆
```

### Python 使用方式（定義在 constants.py）

```python
class TaskStatus:
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    COMPLETED_EMPTY = "completed_empty"
    FAILED = "failed"
    SKIPPED = "skipped"
    NOT_APPLICABLE = "not_applicable"

# 使用
from constants import TaskStatus
update_task_status(task_id, TaskStatus.COMPLETED)

# ❌ 禁止直接寫字串（容易拼錯）
update_task_status(task_id, "complete")    # 錯！少 d
update_task_status(task_id, "success")     # 錯！不是這個詞
```

---

## API 回應 status 欄位（固定 2 種）

```
"ok"    → 成功
"error" → 失敗

❌ "success", "fail", "failure" 全部禁止
```

## HTTP 狀態碼規範

```
200 → 成功取得/操作
201 → 建立資源（POST）
400 → 請求格式錯誤
401 → 未登入
403 → 無權限
404 → 資源不存在
429 → 超過速率限制
500 → 伺服器內部錯誤
```

## 快速確認表

```
「任務剛建立」         → pending
「節點正在跑」         → running
「跑完有結果」         → completed
「跑完但0筆資料」      → completed_empty
「出錯了」             → failed
「用戶沒選這個步驟」   → skipped
「邏輯上不需要這步」   → not_applicable
「API成功」           → status: "ok"
「API失敗」           → status: "error"
```
