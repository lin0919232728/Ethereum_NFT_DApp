# APP{XX} Integration Manifest

> 版本：v{X.Y.Z} | DB Schema：v{NNN} | 更新：{YYYY-MM-DD HH:MM} | {裝置}
> 定位：整合架構師（#15）+ 任何跨 APP 設計任務的第一手參考
> 更新觸發：① API 端點增刪 ② DDL 異動 ③ 跨 APP 依賴新增/解除 ④ 版本升版
> 完整 Ecosystem 地圖 → `doc/ECOSYSTEM_MAP.md`（需同步更新）

---

## 基礎位置

| 項目 | 值 |
|------|---|
| VPS | VPS#N ({IP}) |
| DB | `{db_name}`（PostgreSQL 17）|
| Docker port | {PORT} |
| 對外 URL | https://app{XX}.nextstepbu.com |
| 本地路徑 | `C:\flaskspace\Claude\project\{folder_name}\` |
| Pipeline Contract | `docs/PIPELINE_CONTRACT.md` v{X.Y} |

---

## 對外暴露的 API（External-facing）

> 命名規範：`/api/external/app{XX}/{resource}` — 詳見 `doc/modules/17_跨APP通用DB-API標準_全域.md`

| Method | 路徑 | 描述 | 已知消費方 | 狀態 |
|--------|------|------|-----------|------|
| — | — | _(尚無對外 API)_ | — | — |

---

## 消費的外部 API（Outbound calls）

| 目標 APP | 路徑 | 用途 | 鑑權 | 狀態 |
|---------|------|------|------|------|
| APP14 | `POST /api/pipeline/step-event` | Pipeline 監控 | X-API-Key | ✅ 預設已建 |
| APP08 | `POST /api/notify` | LINE 警報通知 | — | ⚠️ 按需建立 |

---

## 跨 APP 共用的核心 DB 表

| 表名 | 關鍵欄位 | 寫入方 | 讀取方 |
|------|---------|--------|--------|
| _(尚無跨 APP 共用表)_ | — | — | — |

---

## 目前 OPEN 的跨 APP 依賴 / 任務

| # | 描述 | 等待方 | 提供方 | 相關文件 |
|---|------|--------|--------|---------|
| — | _(尚無)_ | — | — | — |

---

## 事件（Events emitted / consumed）

| 方向 | 事件 | 格式 | 目標/來源 |
|------|------|------|---------|
| 發出 | step-event → APP14 | `{source_app:"app{XX}", step_id, status, ...}` | APP14 DataHub |

---

## 整合禁區（勿單方修改）

| 項目 | 原因 | 影響方 | 文件 |
|------|------|--------|------|
| _(尚無)_ | — | — | — |

---

## UCIE 引擎對應（統一內容智能引擎）

> 如本 APP 參與 UCIE（APP19/APP20/APP22 模式），填寫對應層次

| UCIE Layer | 本 APP 實作 |
|-----------|-----------|
| Input Adapter | _(不適用 / 描述輸入格式)_ |
| Layer 1 Section Map | _(不適用 / LLM-A 對應)_ |
| Layer 2 Block ID | _(不適用 / LLM-B 對應)_ |
| Layer 3 Intelligence | _(不適用 / E1-E10 填充狀況)_ |
| Layer 4 Classification | _(不適用 / 字典建立狀況)_ |

> UCIE 架構文件：`APP19/docs/agent-reports/107-20260430-universal-content-intelligence-engine-OPEN.md`
