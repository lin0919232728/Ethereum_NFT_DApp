# Server Config — {project_name}

> **最後更新**: {YYYY-MM-DD} (v0.1.0)

## 基本資訊

| 項目 | 值 |
|------|---|
| APP 編號 | app{XX} |
| Domain | app{XX}.nextstepbu.com |
| VPS | VPS#2 (107.173.51.42) |
| Port | 3{XX} |
| Python | 3.11 (via uv) |

## Docker

```yaml
# docker-compose.yml 關鍵設定
services:
  app{XX}:
    build: .
    ports: ["3{XX}:3{XX}"]
    env_file: .env
    volumes:
      - /opt/shared:/opt/shared:rw   # LINE 搭便車通知
    restart: unless-stopped
```

## 環境變數（.env.example）

```bash
APP_NAME=app{XX}
PORT=3{XX}
SECRET_KEY=
DATABASE_URL=postgresql://
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=https://app{XX}.nextstepbu.com/auth/callback
```

## 部署路徑

```
VPS: /opt/app{XX}/
本機: C:/flaskspace/Claude/project/{project_name}/
```
