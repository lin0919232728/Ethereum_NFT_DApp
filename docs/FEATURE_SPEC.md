# Feature Spec — {project_name}

> **類型**: 活文件 🌱（隨功能增加）
> **規則**: 建表前必填，每個 Feature 必須有 GWT Scenario
> **最後更新**: {YYYY-MM-DD} (v0.1.0)

---

## F1: 使用者登入

> **狀態**: ✅ 已實作 (v0.1.0)

### Rules

- R1: 白名單 email 才能登入
- R2: OAuth callback 後導向首頁
- R3: 未登入者導向 /login

### Scenarios

```gherkin
Scenario: 白名單用戶登入成功
  Given 用戶的 email 在白名單中
  When  用戶點擊 Google 登入
  Then  系統建立 session
  And   導向首頁 /

Scenario: 非白名單用戶被拒絕
  Given 用戶的 email 不在白名單
  When  用戶完成 Google OAuth
  Then  系統拒絕登入
  And   顯示「無權限」訊息
```

---

<!-- 新功能追加到此處，編號遞增 F2, F3... -->
<!-- 格式：
## F2: {功能名稱} （vX.X.X 新增）

> **狀態**: 🔄 開發中

### Rules
- R1: ...

### Scenarios
```gherkin
Scenario: ...
```
-->
