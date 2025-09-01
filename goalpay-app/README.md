# GoalPay - 財務助手應用程序

一個用於薪資分析的財務助手應用程序，幫助用戶追蹤和分析他們的收入。

## 功能特色

- 🔐 Google OAuth 登錄
- 📊 薪資分析儀表板
- 📈 收入趨勢圖表
- 🌍 多語言支持（繁體中文、英文、日文）
- 🎨 淺色/深色主題切換
- 💰 稅收歷史圖表
- 📱 響應式設計

## 技術棧

### 前端
- React 18
- Tailwind CSS
- React Router
- React Query
- Recharts (圖表)
- i18next (國際化)

### 後端
- Node.js
- Express.js
- PostgreSQL
- Passport.js (OAuth)
- JWT 認證

### 數據庫
- PostgreSQL
- 用戶表
- 薪資單表
- 薪資項目表

## 快速開始

### 安裝依賴

```bash
# 安裝前端依賴
cd frontend
npm install

# 安裝後端依賴
cd ../backend
npm install
```

### 設置數據庫

```bash
cd db
# 運行數據庫遷移
npm run migrate
```

### 啟動開發服務器

```bash
# 啟動後端服務器
cd backend
npm run dev

# 啟動前端服務器
cd ../frontend
npm start
```

## 環境變量

創建 `.env` 文件並設置以下變量：

```env
# 數據庫
DATABASE_URL=postgresql://username:password@localhost:5432/goalpay

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# JWT
JWT_SECRET=your_jwt_secret

# 服務器
PORT=5000
NODE_ENV=development
```

## 項目結構

```
goalpay-app/
├── frontend/          # React 前端應用
├── backend/           # Node.js 後端 API
├── db/               # 數據庫遷移和種子數據
└── README.md         # 項目文檔
```
