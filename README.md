<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# HR Helper App

這個專案是一個基於 React (Vite) + Tailwind CSS 開發的純前端應用程式，用於名單抽籤與自動分組。所有運算皆在瀏覽器本機完成，不呼叫任何外部 API、也不需要 API 金鑰。

## 🚀 本地端運行 (Run Locally)

**環境要求：** Node.js 20+

1. **安裝依賴套件 (Install dependencies):**
   ```bash
   npm install
   ```

2. **啟動開發伺服器:**
   ```bash
   npm run dev
   ```
   伺服器啟動後，通常可以透過 `http://localhost:3000` 或 `http://localhost:5173` 預覽應用程式。

## 📦 部署與版控 (Deployment & Version Control)

### GitHub Actions 自動部署
本專案已設定 `.github/workflows/deploy.yml`，當你將程式碼推送到 `main` 分支時，將會自動部署到 **GitHub Pages**。
> **注意：** 請務必至 GitHub Repository 的 `Settings -> Pages` 將 Source 設為 `GitHub Actions`。本專案不需要任何 API 金鑰或 Secret。
>
> ⚠️ 安全提醒：若未來要加入需要金鑰的功能，請透過後端（例如 Supabase Edge Function）代理呼叫，**切勿**用 Vite 的 `define` 把金鑰注入前端 bundle，否則會在公開網站上外洩。

### 版控設定 (.gitignore)
為了保護隱私檔案並節省空間，專案根目錄的 `.gitignore` 已設定排除：
- `node_modules/`、`dist/`：無須上傳的依賴與編譯後檔案。
- `.env*`：排除所有環境變數檔案，避免金鑰外洩（僅保留 `.env.example` 供參考）。
- `.DS_Store`、`.vscode/` 等編輯器/系統暫存檔。
