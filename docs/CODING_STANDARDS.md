# Coding Standards — AI 寫碼執行指南

> **類型**: 死文件 🔒
> **目的**: 消除 AI 寫碼的「100 種寫法」問題，強制固定路徑
> **適用**: 所有 Flask/Python 後端專案

---

## 0. 速查表（AI 每次寫碼前必對照）

| 場景 | ✅ 正確 | ❌ 禁止 |
|------|--------|--------|
| API 成功回應 | `{"status":"ok","data":{...}}` | `{"success":true,"result":{...}}` |
| API 錯誤回應 | `{"status":"error","message":"說明"}` | `{"error":"說明","code":400}` |
| DB 操作 | `pg_client.py` 的 `execute_query()` | 直接 `psycopg2.connect()` |
| VPS SSH | `paramiko` | `subprocess.ssh`, `sshpass`, SSH tunnel |
| 環境變數 | `os.environ.get('KEY', 'default')` | 硬編碼任何密碼/key |
| 日誌 | `app.logger.info(...)` | `print(...)` 在 production |
| 狀態值 | 見 STATE_DEFINITIONS.md | 自創狀態名 |
| Python 指令 | `uv run python` 或 `py` | `python` |
| 機敏資料 | 存 `.env` | 寫入程式碼 |

---

## 1. 命名規範

### Python
```python
user_id = 123              # 變數、函數 → snake_case
def get_task_status(): ... # 函數 → snake_case
class TaskProcessor: ...   # 類別 → PascalCase
MAX_RETRY = 3              # 常數 → SCREAMING_SNAKE
is_active = True           # 布林 → is_/has_/can_ 前綴
```

### 資料庫
```sql
-- 表名 → snake_case 複數
CREATE TABLE serp_results (...);

-- 欄位 → snake_case
created_at, updated_at, user_id, task_status

-- 索引 → idx_{表名}_{欄位}
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_status_created ON tasks(status, created_at);
```

### API 端點
```
GET  /api/serp-results       ✅ 小寫、連字號
POST /api/trigger-crawl      ✅ 動作 → 動詞-名詞

❌ /api/getSerpResults        camelCase 禁止
❌ /api/get_serp_results      underscore 禁止
```

---

## 2. API 回應格式（固定，不得自創）

```python
# 成功（有資料）
return jsonify({"status": "ok", "data": {...}}), 200

# 成功（有分頁）
return jsonify({
    "status": "ok",
    "data": [...],
    "pagination": {"total": 100, "page": 1, "per_page": 20, "total_pages": 5}
}), 200

# 操作成功（無資料）
return jsonify({"status": "ok", "message": "已建立"}), 201

# 錯誤
return jsonify({"status": "error", "message": "具體說明錯誤原因"}), 400

# /health 端點（所有 APP 必備）
return jsonify({
    "status": "ok",
    "app": APP_NAME,
    "version": APP_VERSION,
    "timestamp": datetime.now(TZ).isoformat()
}), 200
```

---

## 3. 錯誤處理模式（固定）

```python
@app.route('/api/something', methods=['POST'])
def do_something():
    try:
        data = request.json
        if not data.get('required_field'):
            return jsonify({"status": "error", "message": "required_field 必填"}), 400

        result = execute_query("SELECT ...", [data['required_field']])
        return jsonify({"status": "ok", "data": result}), 200

    except Exception as e:
        app.logger.error(f"do_something error: {e}", exc_info=True)
        return jsonify({"status": "error", "message": "伺服器內部錯誤"}), 500
```

---

## 4. 資料庫操作規範

```python
# ✅ 透過 pg_client（唯一合法方式）
from pg_client import execute_query
rows = execute_query("SELECT * FROM tasks WHERE status = %s", ["pending"])

# ✅ 永遠參數化查詢（防 SQL injection）
execute_query("SELECT * FROM users WHERE email = %s", [email])

# ❌ 禁止直接連線
import psycopg2
conn = psycopg2.connect(...)   # 不可這樣做

# ❌ 禁止字串拼接
f"SELECT * WHERE email = '{email}'"  # SQL injection 風險！
```

---

## 5. 環境變數規範

```bash
# .env 固定區塊順序
# === APP ===
APP_NAME=app{XX}
PORT=3{XX}
SECRET_KEY=隨機長字串

# === Database ===
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# === Google OAuth ===
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=https://app{XX}.nextstepbu.com/auth/callback

# === External APIs ===
QUICKSCRAPER_API_KEY=
BROWSERACT_API_KEY=
```

---

## 6. 新功能加入前的標準檢查流程

每次討論「加這個功能怎麼做」時，先過這個 checklist：

```
□ 1. 狀態值  → 查 STATE_DEFINITIONS.md，確認使用標準狀態名
□ 2. API格式 → 回應格式符合第 2 節標準
□ 3. DB變更  → 需要新表/欄位？→ 出 DB 變更確認單，等確認
□ 4. 命名    → 表名/欄位/端點符合命名規範
□ 5. Pipeline → 需要推 step-event 給 APP14？
□ 6. 測試    → 對應哪層測試（L1/L2/L3）？
□ 7. 機敏    → 無 API key/密碼硬編碼
```

---

## 7. 禁止清單

| 禁止行為 | 原因 |
|---------|------|
| 硬編碼 API Key/密碼 | 安全漏洞 |
| 自創 API 回應格式 | 破壞跨 APP 一致性 |
| 自創 Pipeline 狀態名 | APP14 無法識別 |
| 直接 `psycopg2.connect()` | 繞過連線池 |
| `python` 指令 | Windows 找不到 |
| `git add .` | 可能含機敏檔案 |
| `print()` 取代 logger | Production 無法查詢 |
| SSH tunnel 連 DB | 慢 100x，改 SFTP |
