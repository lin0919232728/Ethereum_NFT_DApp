# Memory — {project_name}

> **最後更新**: {YYYY-MM-DD HH:MM}
> **版本**: v0.1.0
> **模板**: `_template4`（含 Spectra Gate + UI 快照）

---

## 開案 Spectra 工作流程記憶（v2 SOP）

> 全域 SOP：`C:\Users\MT2505\.claude\projects\C--Users-MT2505\memory\feedback_new_project_sop.md`
> 模板索引：`C:\flaskspace\Claude\project\_template\TEMPLATE_INDEX.md`

### Phase 0：開案（已完成）
- [x] 複製 `_template4` → 本專案
- [x] `spectra init` 已跑（產出 `openspec/`）
- [ ] 填寫 CLAUDE.md / VERSION / TODO.md / README.md 的 {PLACEHOLDER}

### Phase 1：技術主管產 proposal + design + spec（**不含 tasks**）
- [ ] 派 📋 planner agent 產出規劃任務書 → `docs/agent-tasks/000-YYYYMMDD-規劃-planner-OPEN.md`
- [ ] 內容：goal / scope / out-of-scope / 設計決策 / 風險矩陣 / DoD
- [ ] **禁止**在此階段拆 T001~T0NN（任務拆解放 Phase 3）

### Phase 2：灌入 Spectra + 用戶核對
- [ ] `spectra new change {change-name}`
- [ ] `spectra new artifact proposal --change {change-name} --stdin`
- [ ] `spectra new artifact design --change {change-name} --stdin`
- [ ] `spectra new artifact spec --change {change-name} {capability} --stdin`
- [ ] `spectra validate`（warning 全清）
- [ ] `spectra analyze`（0 findings）
- [ ] 通知用戶開 `C:\Users\MT2505\AppData\Local\Spectra\app.exe` 核對
- [ ] **等用戶說「OK / 確認 / 派」才能進 Phase 3**

### Phase 3：技術主管產 tasks（搭配 Spectra spec 章節）
- [ ] 派 📋 planner 拆 T001~T0NN，每個 task 帶六要素契約
- [ ] **acceptance 必須引用 Spectra spec 的具體章節**
- [ ] 寫入 `docs/agent-tasks/001-YYYYMMDD-{任務}-{代理人}-OPEN.md` 起算
- [ ] `spectra new artifact tasks --change {change-name} --stdin`
- [ ] 二次 `spectra validate + analyze` 通過
- [ ] 用戶 OK → 才派實作

### Phase 4：派遣實作 + 整合審查
- [ ] 依 task 依賴圖派代理人（fullstack / designer / engineer / web-researcher）
- [ ] 全部完成後派 🔍 critic 整合審查
- [ ] 零 P0 / 零 P1 → archive change：`spectra archive {change-name}`

---

## 現況

- 狀態: 初始化（Phase 0 完成）
- 類型: {Web App | 桌面 GUI | CLI | Library}
- VPS: {VPS#2 app{XX}.nextstepbu.com | 本機 | N/A}
- DB: {PostgreSQL | 無}

## 關鍵決策

1. 使用 `_template4` 結構（_template3 + UI 快照疊加）
2. **Spectra Gate 強制**：spec 沒確認，不准產 tasks
3. UI 快照系統強制（即使非 Web 專案，保留資料夾結構）

## Spectra 命令備忘

```bash
SPECTRA="C:/Users/MT2505/AppData/Local/Spectra/spectra.exe"

$SPECTRA list changes              # 列出所有 change
$SPECTRA show change {name}         # 看某 change 內容
$SPECTRA validate                   # 驗證所有 change/spec
$SPECTRA analyze                    # 一致性 + 缺漏分析
$SPECTRA archive {change}           # 完成後歸檔
$SPECTRA park {change}              # 暫停（不歸檔）
$SPECTRA status                     # 看 DAG 狀態
```

## UI 快照命令備忘

```bash
# Web 專案首版 baseline（非 Web 跳過）
python scripts/verify_ui_snapshot.py            # 驗證所有頁面
python scripts/verify_ui_snapshot.py --strict   # CI 模式（warning 也 fail）
```

## 待確認

（新功能開始前填入）

## 已知問題

（無）

## 例外：純研究類任務不走 Spectra Gate
- 🗺 onboarder（看陌生程式碼）
- 📚 web-researcher（查 API 文件）
- 🔍 critic 對既有程式碼審查

直接派即可，不需走 proposal/design/spec 流程。
