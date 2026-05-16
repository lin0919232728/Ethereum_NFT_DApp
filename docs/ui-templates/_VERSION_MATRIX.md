# UI Template Version Compatibility Matrix — {PROJECT_NAME}
> 建立: {YYYY-MM-DD} | {DEVICE}

## 說明
- **db_schema_required**：套用此模板前 DB 必須已執行到此版 migration
- **狀態**：LIVE = 目前套用 / REVERTED = 已回滾 / ARCHIVED = 已歸檔

---

## 版本矩陣

| 模板版本 | DB Migration | 關鍵新增欄位 | 狀態 | 套用日期 | 備註 |
|---------|-------------|------------|------|---------|------|
| {PREFIX}-UI-001 | — | — | LIVE | {YYYY-MM-DD} | 初始快照 |

---

## DB Migration 版本說明

| Migration | 關鍵異動 | 影響模板 |
|-----------|---------|---------|
| V001 | 初始建表 | 全部 |

---

## 套用前檢查

```bash
python scripts/verify_ui_snapshot.py
```
