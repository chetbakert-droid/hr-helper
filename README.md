<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# HR Helper App

這個專案是一個基於 React (Vite) + Tailwind CSS 開發的應用程式，並整合了 Google Gemini API。

## 🚀 本地端運行 (Run Locally)

**環境要求：** Node.js 20+

1. **安裝依賴套件 (Install dependencies):**
   ```bash
   npm install
   ```


2. **設定環境變數:**
   複製 `.env.example` 並重新命名為 `.env.local`，接著填寫你的 Gemini API 金鑰：
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

3. **啟動開發伺服器:**
   ```bash
   npm run dev
   ```
   伺服器啟動後，通常可以透過 `http://localhost:3000` 或 `http://localhost:5173` 預覽應用程式。

## 📦 部署與版控 (Deployment & Version Control)

### GitHub Actions 自動部署
本專案已設定 `.github/workflows/deploy.yml`，當你將程式碼推送到 `main` 分支時，將會自動部署到 **GitHub Pages**。
> **注意：** 請務必至 GitHub Repository 的 `Settings -> Pages` 將 Source 設為 `GitHub Actions`，並且若部署時需要使用到 API Key，請在 `Settings -> Secrets and variables -> Actions` 中新增 `GEMINI_API_KEY`。

### 版控設定 (.gitignore)
為了保護隱私檔案（如 API 金鑰）並節省空間，專案根目錄的 `.gitignore` 已設定排除：
- `node_modules/`、`dist/`：無須上傳的依賴與編譯後檔案。
- `.env*`：排除所有環境變數檔案，避免金鑰外洩（僅保留 `.env.example` 供參考）。
- `.DS_Store`、`.vscode/` 等編輯器/系統暫存檔。
