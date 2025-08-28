# 🎯 GoalPay - 智能薪資管理系統

GoalPay 是一個專為日本工作者設計的薪資分析應用程式，支援多語言（繁體中文、英文、日文）和智能薪資單處理。

## ✨ 核心功能

### 🚀 MVP 功能
- **Google OAuth 登入**：安全的身份驗證
- **用戶設定管理**：公司資訊、語言、貨幣、主題
- **薪資單上傳/手動輸入**：支援英文和日文薪資單
- **薪資詞典**：多語言薪資項目定義和自訂詞彙
- **儀表板和報表**：年度統計、月度趨勢、稅金分析

### 🔮 未來功能
- 薪資系統 API 整合
- 儲蓄目標追蹤
- 產業級薪資成長比較
- AI 驅動的財務建議

## 🛠 技術架構

### 前端 (Frontend)
- **React 18** + **TypeScript**
- **Tailwind CSS** - 現代化 UI 設計
- **React Router** - 單頁應用路由
- **React i18next** - 國際化支援
- **Recharts** - 數據視覺化
- **Lucide React** - 圖標庫

### 後端 (Backend)
- **Node.js** + **Express.js**
- **PostgreSQL** - 主要資料庫
- **Sequelize** - ORM
- **Passport.js** - Google OAuth 認證
- **JWT** - 身份驗證
- **Multer** - 檔案上傳處理

### 資料庫 (Database)
- **PostgreSQL** 資料庫結構
- 用戶管理、薪資單、薪資詞典
- 多語言支援和自訂詞彙

## 🚀 快速開始

### 前置需求
- Node.js 18+
- PostgreSQL 14+
- npm 或 yarn

### 1. 克隆專案
```bash
git clone <repository-url>
cd GoalPay
```

### 2. 前端設定
```bash
cd frontend
npm install
npm run dev
```

### 3. 後端設定
```bash
cd backend
npm install
cp .env.example .env
# 編輯 .env 檔案設定資料庫連線和 Google OAuth
npm run dev
```

### 4. 資料庫設定
```bash
# 建立 PostgreSQL 資料庫
createdb goalpay

# 執行資料庫結構
psql -d goalpay -f database/schema.sql
```

### 5. 環境變數設定
```bash
# backend/.env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/goalpay
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
```

## 📁 專案結構

```
GoalPay/
├── frontend/                 # React 前端應用
│   ├── src/
│   │   ├── components/      # 可重用組件
│   │   ├── pages/          # 頁面組件
│   │   ├── contexts/       # React Context
│   │   ├── hooks/          # 自訂 Hooks
│   │   ├── i18n/           # 國際化設定
│   │   └── types/          # TypeScript 類型定義
│   ├── public/             # 靜態資源
│   └── package.json
├── backend/                 # Node.js 後端 API
│   ├── src/
│   │   ├── routes/         # API 路由
│   │   ├── controllers/    # 控制器邏輯
│   │   ├── models/         # 資料庫模型
│   │   ├── middleware/     # 中間件
│   │   ├── config/         # 設定檔案
│   │   └── utils/          # 工具函數
│   └── package.json
├── database/                # 資料庫相關
│   └── schema.sql          # PostgreSQL 結構
└── docs/                    # 專案文件
```

## 🌍 多語言支援

### 支援語言
- **繁體中文 (zh)** - 預設語言
- **英文 (en)** - 國際化支援
- **日文 (jp)** - 日本本地化

### 薪資詞典範例
```json
{
  "INCOME_TAX": {
    "en": "Income Tax",
    "jp": "所得税",
    "zh": "所得稅",
    "description_en": "Government tax on income",
    "description_jp": "政府が課す税金",
    "description_zh": "政府徵收的稅金"
  }
}
```

## 🔐 認證與安全

- **Google OAuth 2.0** 登入
- **JWT** 身份驗證
- **Rate Limiting** 防止濫用
- **Helmet** 安全標頭
- **CORS** 跨域資源共享控制

## 📊 API 端點

### 認證
- `POST /api/auth/google` - Google OAuth 登入

### 用戶管理
- `GET /api/users/profile` - 取得用戶資料
- `PATCH /api/users/profile` - 更新用戶資料

### 薪資管理
- `POST /api/payroll/upload` - 上傳薪資單
- `GET /api/payroll/history` - 取得薪資歷史
- `POST /api/payroll/manual` - 手動輸入薪資

### 詞典管理
- `GET /api/dictionary/terms` - 取得薪資詞彙
- `POST /api/dictionary/terms` - 新增自訂詞彙

### 報表
- `GET /api/reports/annual` - 年度報表
- `GET /api/reports/monthly` - 月度報表
- `POST /api/reports/custom` - 自訂範圍報表

## 🎨 UI/UX 設計

- **響應式設計** - 支援各種裝置
- **深色/淺色主題** - 自動主題切換
- **現代化卡片設計** - 清晰的資訊層次
- **直觀的圖表** - 易於理解的數據視覺化
- **無障礙設計** - 支援螢幕閱讀器

## 🧪 開發與測試

### 開發模式
```bash
# 前端
cd frontend
npm run dev

# 後端
cd backend
npm run dev
```

### 建置
```bash
# 前端
cd frontend
npm run build

# 後端
cd backend
npm start
```

## 🤝 貢獻指南

1. Fork 專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📝 授權

本專案採用 ISC 授權條款 - 詳見 [LICENSE](LICENSE) 檔案

## 📞 支援

如有問題或建議，請：
- 開啟 [Issue](../../issues)
- 聯絡開發團隊
- 查看 [Wiki](../../wiki)

## 🙏 致謝

- React 社群
- Tailwind CSS 團隊
- PostgreSQL 社群
- 所有貢獻者

---

**GoalPay** - 讓薪資管理更智能、更簡單 🎯
