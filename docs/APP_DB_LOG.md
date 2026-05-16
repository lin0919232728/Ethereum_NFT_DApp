# {APPNN} DB 變更紀錄 — {db_name}

> VPS#2 | PostgreSQL 17 | 維護人：db-expert
> 連結全域紀錄：`C:\flaskspace\Claude\project\doc\DB\DB_CHANGE_LOG.md`

---

## 資料庫資訊

| 項目 | 值 |
|------|-----|
| DB 名稱 | {db_name} |
| App User | {appNN_user} |
| VPS | VPS#2 (107.173.51.42) |
| 表數量 | — |

---

## 變更紀錄

| DCL# | 日期 | 類型 | 說明 | 狀態 |
|------|------|------|------|------|
| DCL-001 | {YYYY-MM-DD} | CREATE | 初始建表 | ✅ |

> 類型：CREATE / ADD_COL / DROP_COL / ALTER_TYPE / RENAME / DROP / INDEX / CONSTRAINT / BACKFILL / CHOWN / DEAD_TABLE

---

## 備份記錄

| 日期 | 檔案 | 大小 | 原因 |
|------|------|------|------|
| — | — | — | — |

---

## 殘留待處理

| 項目 | 說明 | 優先級 |
|------|------|--------|
| — | — | — |

---

## DDL 變更守則（每次執行前確認）

1. **建表前**：查 `DB_NAMING_REGISTRY.md` 確認無命名衝突
2. **變更後**：追加本日誌 + 全域 `DB_CHANGE_LOG.md`（DCL-XXX）
3. **欄位增刪**：同步更新 `docs/DB_SCHEMA.md` 對應表段落
4. **高風險操作**（DROP/ALTER TYPE/大量 BACKFILL）：先備份，記入備份記錄

*維護：每次 DDL 後由執行工程師追加，db-expert 每週複核*
