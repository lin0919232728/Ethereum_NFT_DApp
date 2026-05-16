# API Reference — {project_name}

> **類型**: 活文件 🌱
> **Base URL**: `https://app{XX}.nextstepbu.com`
> **最後更新**: {YYYY-MM-DD} (v0.1.0)

---

## 公開端點

| Method | Path | 說明 | Auth |
|--------|------|------|------|
| GET | `/health` | 健康檢查 | 無 |

## Auth 端點

| Method | Path | 說明 |
|--------|------|------|
| GET | `/login` | 登入頁 |
| GET | `/auth/google` | OAuth 導向 |
| GET | `/auth/callback` | OAuth callback |
| GET | `/logout` | 登出 |

## 需登入端點

| Method | Path | 說明 | Auth |
|--------|------|------|------|
| GET | `/` | 主頁 | Google OAuth |

---

## 回應格式（固定，詳見 CODING_STANDARDS.md）

```json
// 成功
{"status": "ok", "data": {...}}

// 成功（分頁）
{"status": "ok", "data": [...], "pagination": {"total": 100, "page": 1, "per_page": 20}}

// 失敗
{"status": "error", "message": "具體說明"}
```

---

## 跨 APP 使用此 API 的服務

| APP | 用途 | 端點 |
|-----|------|------|
| _（無）_ | | |

<!-- 新增端點追加到對應 section，格式：
| Method | `/api/新端點` | 說明 | Auth |
-->
