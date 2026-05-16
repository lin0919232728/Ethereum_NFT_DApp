# _template4 Merge Instructions
> UI Template Versioning System | v1.0.0

## 此模板套件新增的檔案

```
docs/ui-templates/
  _TEMPLATE_GUIDE.md
  _SNAPSHOT_INDEX.md
  _VERSION_MATRIX.md
  _meta.yaml.template
scripts/
  verify_ui_snapshot.py
  backfill_ui_snapshot.py
UI_TEMPLATE_VERSION
```

## 與現有 _template 的衝突點

| 檔案 | 衝突類型 | 處理方式 |
|------|---------|---------|
| `TEMPLATE_VERSION` | 命名不同（本套件用 `UI_TEMPLATE_VERSION`） | 無衝突，共存 |
| `docs/INDEX.md` | 需追加 UI 模板區塊 | 手動 append `docs/INDEX.md.patch` 內容 |
| `scripts/` | 現有模板可能無此目錄 | 直接建立，不覆蓋 |

## 手動合併步驟

```bash
# 1. 複製 ui-templates 目錄骨架
cp -r _template4/docs/ui-templates/ {your_project}/docs/ui-templates/

# 2. 複製 scripts
cp -r _template4/scripts/ {your_project}/scripts/

# 3. 更新 docs/INDEX.md（見 docs/INDEX.md.patch）

# 4. 替換 {PLACEHOLDER} 欄位（見 README.md § Placeholders）

# 5. 建立首版快照（Baseline）
cd {your_project}
python scripts/backfill_ui_snapshot.py --baseline

# 6. 確認啟用 Checklist（見 docs/ui-templates/_TEMPLATE_GUIDE.md §10）
```

## 相容性

- Flask + Jinja2：完整支援
- React + Vite：使用 `framework: react-vite`，`ui_targets` 改為 `src/pages/**/*.tsx`
- 無 DB：`db_schema_required: null`，`db_dependencies: []`
