# Pipeline Contract — {project_name}

> **類型**: 活文件 🌱
> **目的**: 定義每個處理節點的狀態推送規格
> **最後更新**: {YYYY-MM-DD} (v0.1.0)

---

## 節點總覽

| 節點 ID | 名稱 | 前置條件 | 超時門檻 | 狀態 |
|--------|------|---------|---------|------|
| A-1 | 初始化 | 無 | 30s | ✅ |

---

## step-event 推送規格

每個節點完成後必須 POST 到 APP14：

```python
POST {APP14_URL}/api/pipeline/step-event
{
    "source_app": "app{XX}",
    "task_id": "uuid",
    "step_id": "A-1",
    "step_name": "節點名稱",
    "status": "completed",          # 7 種狀態之一
    "duration_ms": 1000,
    "output_summary": "結果摘要",
    "timeout_threshold_ms": 30000,
    "depends_on": [],
    "unlocks": ["A-2"]
}
```

**推送方式**: fire-and-forget（APP14 掛了不阻塞主流程）

---

## 開發前 3 題（有 Pipeline 改動時必答）

1. 這個功能有幾個處理步驟？
2. 每個節點完成後有打 step-event 回 APP14 嗎？
3. 每個節點的超時門檻是多少？

---

## 對話結束前 Pipeline 盤點

```
□ 新/改節點有 step-event 推送？
□ 超時門檻已定義？
□ 狀態用對？（skipped vs not_applicable vs completed_empty）
□ selected_stages 持久化到 DB？
□ 此文件已更新？
```
