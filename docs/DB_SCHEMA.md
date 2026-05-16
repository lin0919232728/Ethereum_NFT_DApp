# Database Schema — {project_name}

> **類型**: 活文件 🌱
> **Engine**: PostgreSQL 17 (VPS#2)
> **最後更新**: {YYYY-MM-DD} (v0.1.0)
> **來源**: 由 FEATURE_SPEC.md 推導而來

---

## 行為推導追溯表（BDD → DB）

| 表名 | 來源 Feature | 來源 Scenario | 主要查詢 | 核心索引 |
|------|-------------|--------------|---------|---------|
| `profiles` | F1: 登入 | F1-R1 | WHERE email | idx_profiles_email |

---

## 表格總覽

| 表名 | 欄位數 | 說明 | 版本 |
|------|--------|------|------|
| `profiles` | 5 | 用戶資料 | v0.1.0 |

---

## 詳細結構

### profiles

| 欄位 | 型別 | 說明 |
|------|------|------|
| id | SERIAL PRIMARY KEY | 自增 ID |
| email | VARCHAR(255) UNIQUE NOT NULL | 用戶 email |
| name | VARCHAR(255) | 顯示名稱 |
| created_at | TIMESTAMPTZ DEFAULT NOW() | 建立時間 |
| updated_at | TIMESTAMPTZ DEFAULT NOW() | 更新時間 |

```sql
CREATE TABLE profiles (
    id         SERIAL PRIMARY KEY,
    email      VARCHAR(255) UNIQUE NOT NULL,
    name       VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_profiles_email ON profiles(email);
```

---

## 索引策略

### 現有索引

| 表名 | 索引名 | 欄位 | 類型 | 版本 |
|------|--------|------|------|------|
| `profiles` | `idx_profiles_email` | email | UNIQUE B-tree | v0.1.0 |

### 索引設計原則

- 高頻查詢欄位（WHERE / JOIN / ORDER BY）優先建索引
- 複合索引遵循最左前綴原則
- 資料量 < 1000 筆 → 索引效益低，可暫緩
- 資料量 > 10000 筆 → 必須有索引

---

<!-- 新增表追加到詳細結構尾部，格式：
### {table_name} （vX.X.X 新增）
-->

---

## DB 變更日誌（本專案）

> 詳細全域紀錄：`C:\flaskspace\Claude\project\doc\DB\apps\APPNN_DB_LOG.md`
> 全域彙整：`C:\flaskspace\Claude\project\doc\DB\DB_CHANGE_LOG.md`

| 版本 | 日期 | 類型 | 表名 | 說明 | DCL# |
|------|------|------|------|------|------|
| v0.1.0 | {YYYY-MM-DD} | CREATE | profiles | 初始建表 | — |

> ⚠️ **每次 DDL 變更規則（強制）**
> 1. 變更前：查 `DB_NAMING_REGISTRY.md` 確認無命名衝突
> 2. 變更後：追加本表 + 更新 `doc/DB/apps/APPNN_DB_LOG.md` + `DB_CHANGE_LOG.md`（DCL-XXX）
> 3. `DB_MASTER_REGISTRY.md` 同步更新（行數/狀態）
> 4. 本文件對應表段落追加：`（vX.X.X 欄位名 新增/修改/移除，YYYY-MM-DD）`
