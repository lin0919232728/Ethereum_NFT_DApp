# _template4 — UI Template Versioning System
> v1.0.0 | 2026-05-06

## 這個模板套件解決什麼問題

直接修改 `templates/{page}.html` 核心模板，導致意外整體替換、功能回退（典型事故：tab 消失、layout 崩潰）。

## 提供什麼

```
docs/ui-templates/
  _TEMPLATE_GUIDE.md        ← 完整 SOP（套用流程 + 命名規範）
  _SNAPSHOT_INDEX.md        ← 所有快照登記表
  _VERSION_MATRIX.md        ← 版本 × DB Migration 相容性矩陣
  _meta.yaml.template       ← YAML 伴隨檔模板
scripts/
  verify_ui_snapshot.py     ← sha256 驗證 CI 腳本
  backfill_ui_snapshot.py   ← 既有專案回補工具
UI_TEMPLATE_VERSION         ← 此模板套件版本（v1.0.0）
MERGE_INSTRUCTIONS.md       ← 與現有 _template 的合併說明
```

## 快速開始

```bash
# 1. 複製模板套件
cp -r _template4/docs/ui-templates/ your_project/docs/ui-templates/
cp -r _template4/scripts/ your_project/scripts/

# 2. 替換 {PLACEHOLDER} 欄位（見 _meta.yaml.template）

# 3. 建立首版快照
cd your_project
python scripts/backfill_ui_snapshot.py --baseline

# 4. 設定三層強制觸發（缺一不可）
#    a. pre-commit hook
#    b. deploy_py.py 呼叫 verify_ui_snapshot.py
#    c. self_checker.py 啟動時驗證
```

## 啟用 Checklist（5 個必查點）

見 `docs/ui-templates/_TEMPLATE_GUIDE.md` §10

## 已知限制

- React/Vite 支援：部分實作（verify 邏輯待完整）
- base.html 蝴蝶效應：改 base.html 需同步確認所有 child page
- 強制機制需手動設定（pre-commit hook + deploy 整合）

## 全域規範

`C:\flaskspace\Claude\docs\UI_SNAPSHOT_STANDARD.md`（跨 APP 標準主檔）
