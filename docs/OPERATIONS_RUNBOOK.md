# Operations Runbook — 維運手冊

> **類型**: 死文件 🔒
> **適用**: 所有 VPS 部署的 APP

---

## 1. 服務健康檢查

```bash
curl https://app{XX}.nextstepbu.com/health
# 預期: {"status":"ok","app":"app{XX}","version":"vX.X.X"}
```

## 2. Docker 管理

```bash
# ⚠️ VPS#1 → docker-compose（舊版）
# ⚠️ VPS#2 → docker compose（新版，空格）

cd /opt/app{XX}
docker compose ps
docker compose logs --tail=50
docker compose logs -f app{XX}    # 即時追蹤

# ⚠️ 改 .env 後必須 down+up（不是 restart！）
docker compose down && docker compose up -d --build
```

## 3. paramiko 執行 VPS 指令（標準模板）

```python
import paramiko

VPS1 = {"host": "107.173.140.132", "password": "6vc749HO1cbNd8SZyF"}
VPS2 = {"host": "107.173.51.42",  "password": "tTmdI221v1FOrzOL30"}

def run_vps_cmd(vps_info, command):
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(vps_info["host"], username="root", password=vps_info["password"])
    stdin, stdout, stderr = ssh.exec_command(command)
    out = stdout.read().decode(errors='replace')
    ssh.close()
    return out
```

## 4. 大量 DB 操作 → SFTP 上傳腳本

```python
# 禁止 SSH tunnel！改 SFTP 上傳腳本直跑（快 100x）
sftp = ssh.open_sftp()
sftp.put("local_script.py", "/tmp/remote.py")
sftp.close()
ssh.exec_command("python3 /tmp/remote.py", timeout=300)
# 腳本內部用 host="localhost", port=5432
```

## 5. 故障排查流程

```
APP 無法回應:
1. docker compose ps → 容器是否在跑
2. docker compose logs --tail=100 → 看 ERROR
3. nginx -t → Nginx 設定
4. 確認 .env 存在
5. docker compose down && up -d --build

DB 連線失敗:
1. 確認 DATABASE_URL 在 .env
2. 改完 .env 必須 down+up（不是 restart！）
3. 確認密碼三處一致（.env / pg_credentials.json / VPS記憶）

Google OAuth 失敗:
1. GOOGLE_REDIRECT_URI 與 Google Console 完全一致
2. app.py 有加 ProxyFix（Nginx 反代必須）
```

## 6. Nginx 標準設定

```nginx
server {
    listen 443 ssl;
    server_name app{XX}.nextstepbu.com;
    ssl_certificate /etc/letsencrypt/live/app{XX}.nextstepbu.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app{XX}.nextstepbu.com/privkey.pem;
    location / {
        proxy_pass http://127.0.0.1:3{XX};
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 7. 週巡檢清單

```
□ 所有 APP /health 正常
□ SSL 憑證有效期 > 30 天
□ 磁碟空間（VPS#1: 130GB，VPS#2: 150GB）
□ CHANGELOG 與 VERSION 一致
□ doc_audit.py 無警告
```
