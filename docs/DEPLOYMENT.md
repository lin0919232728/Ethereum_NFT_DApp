# Deployment — {project_name}

> **最後更新**: {YYYY-MM-DD} (v0.1.0)

## 一鍵部署

```bash
uv run python deploy_py.py
```

## 手動部署步驟

```
1. git commit + push（本機）
2. VPS: cd /opt/app{XX} && git pull origin main
3. VPS: docker compose down && docker compose up -d --build
4. 驗證: curl https://app{XX}.nextstepbu.com/health
5. 更新 CHANGELOG.md + VERSION
6. sync_ncb.py
```

## 部署後驗收

```
□ /health → {"status":"ok"}
□ 版本號正確
□ docker compose logs 無 ERROR
□ DB migration 執行成功（如有）
□ CHANGELOG.md 已更新
```

## 回滾 SOP

```bash
# VPS 上回滾
cd /opt/app{XX}
git log --oneline -5     # 找上一個版本 hash
git checkout {hash}
docker compose down && docker compose up -d --build
curl https://app{XX}.nextstepbu.com/health
```
