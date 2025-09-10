# GoalPay v1.2.5 - 財務助手應用程序

## 📋 版本信息

**版本**: 1.2.5  
**發布日期**: 2025年9月4日  
**狀態**: 穩定版本  

## 🎯 項目概述

GoalPay 是一個專為日本工作者設計的綜合財務助手應用程序，提供薪資分析、收入追蹤和財務規劃功能。支持多語言（日文、英文、繁體中文）和響應式設計。

## 🚀 核心功能

### 認證與用戶管理
- ✅ **Google OAuth 2.0 登錄** - 安全的 Google 帳戶登錄
- ✅ **測試登入模式** - 開發和測試環境的快速登入
- ✅ **用戶偏好設定** - 語言、主題、貨幣設定
- ✅ **公司資訊管理** - 多公司支援和職位管理

### 薪資管理
- ✅ **薪資單上傳** - 支持 CSV 文件上傳和手動輸入
- ✅ **薪資項目字典** - 多語言薪資術語資料庫
- ✅ **薪資單詳情** - 完整的薪資項目編輯和管理
- ✅ **數據驗證** - 自動數據格式檢查和錯誤提示

### 分析與報告
- ✅ **儀表板** - 收入概覽、趨勢圖表和快速操作
- ✅ **薪資趨勢分析** - 月度和年度比較圖表
- ✅ **扣除項目追蹤** - 完整的扣除項目分析
- ✅ **報告匯出** - PDF 和 CSV 格式匯出

### 系統功能
- ✅ **多語言支持** - 日文、英文、繁體中文
- ✅ **響應式設計** - 桌面和移動設備優化
- ✅ **主題切換** - 淺色/深色主題
- ✅ **診斷系統** - 用戶問題報告和系統狀態檢查

## 🛠 技術架構

### 前端技術棧
- **React 19** + TypeScript - 現代化前端框架
- **Vite** - 快速構建工具
- **Tailwind CSS** - 實用優先的 CSS 框架
- **React Router v6** - 客戶端路由
- **React Query** - 服務器狀態管理
- **Recharts** - 數據可視化圖表
- **i18next** - 國際化支持
- **Lucide React** - 圖標庫

### 後端技術棧
- **Node.js** + Express.js - 服務器框架
- **PostgreSQL** - 關係型數據庫
- **Passport.js** - OAuth 認證
- **JWT** - 會話管理
- **Multer** - 文件上傳處理
- **csv-parser** - CSV 文件解析
- **jsPDF** - PDF 生成

## 🚀 快速開始

### 環境要求
- Node.js 18+
- PostgreSQL 12+
- npm 或 yarn

### 1. 克隆項目
```bash
git clone https://github.com/DeanYCC/GoalPay.git
cd GoalPay/goalpay-app
```

### 2. 後端設置
```bash
cd backend
npm install
cp env.example .env
# 編輯 .env 文件配置數據庫和 OAuth
npm start
```

### 3. 前端設置
```bash
cd frontend
npm install
npm run dev
```

### 4. 訪問應用
- 前端: http://localhost:3001
- 後端 API: http://localhost:5001
- 健康檢查: http://localhost:5001/health

**注意**: 前端端口已從 3000 改為 3001 以避免與其他應用程式衝突

## 🔧 環境配置

### 後端環境變量 (.env)
```env
# 數據庫配置
DB_HOST=localhost
DB_PORT=5432
DB_NAME=goalpay
DB_USER=postgres
DB_PASSWORD=your_password

# JWT 配置
JWT_SECRET=your-super-secret-jwt-key

# Google OAuth 配置
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback

# 服務器配置
PORT=5001
NODE_ENV=development
```

## 📊 API 端點

### 認證相關
- `POST /api/auth/google` - Google OAuth 登錄
- `GET /api/auth/me` - 獲取當前用戶
- `POST /api/auth/logout` - 登出

### 用戶管理
- `GET /api/users/profile` - 獲取用戶檔案
- `PUT /api/users/profile` - 更新用戶檔案
- `GET /api/users/companies` - 獲取用戶公司

### 薪資管理
- `GET /api/payroll/slips` - 獲取薪資單
- `POST /api/payroll/slips` - 創建薪資單
- `PUT /api/payroll/slips/:id` - 更新薪資單
- `DELETE /api/payroll/slips/:id` - 刪除薪資單
- `GET /api/payroll/template/csv` - 下載 CSV 模板
- `POST /api/payroll/upload/csv` - 上傳 CSV 文件

### 儀表板和報告
- `GET /api/dashboard/summary` - 儀表板摘要
- `GET /api/dashboard/test-data` - 測試數據
- `GET /api/reports/summary` - 報告摘要
- `POST /api/reports/export/pdf` - 匯出 PDF
- `POST /api/reports/export/csv` - 匯出 CSV

### 支援系統
- `POST /api/support/diagnostic` - 提交診斷報告
- `GET /api/support/status/:reportId` - 檢查報告狀態
- `GET /api/support/faq` - 常見問題
- `GET /api/support/system-status` - 系統狀態

## 🌐 國際化支持

### 支持語言
- **繁體中文 (zh)** - 主要語言
- **英文 (en)** - 國際化支持
- **日文 (jp)** - 日本市場

### 語言文件位置
```
frontend/src/i18n/locales/
├── zh.json    # 繁體中文
├── en.json    # 英文
└── jp.json    # 日文
```

## 🚀 部署

### Vercel 部署（推薦）
詳細部署指南請參考 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

### 自托管部署
```bash
# 後端
cd backend
npm install
npm start

# 前端
cd frontend
npm install
npm run build
# 部署 dist/ 目錄到 Web 服務器
```

## 📚 文檔

- [部署指南](./DEPLOYMENT_GUIDE.md)
- [API 整合規劃](./API_INTEGRATION_PLAN.md)
- [Google OAuth 設置](./GOOGLE_OAUTH_SETUP.md)
- [數據訪問層設計](./DATA_ACCESS_LAYER.md)
- [診斷系統文檔](./DIAGNOSTIC_SYSTEM.md)
- [CSV 上傳指南](./CSV_UPLOAD_GUIDE.md)
- [版本更新日誌](./CHANGELOG.md)

## 🔧 故障排除

### 常見問題
- **服務器連接問題**: 確保後端服務器正在運行
- **數據庫連接問題**: 檢查 PostgreSQL 服務狀態
- **OAuth 配置問題**: 確認 Google OAuth 憑證配置
- **構建錯誤**: 檢查依賴版本兼容性

詳細故障排除請參考主文檔的故障排除章節。

## 🤝 貢獻

1. Fork 項目倉庫
2. 創建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 創建 Pull Request

## 📄 許可證

本項目採用 ISC 許可證

## 🆘 支援

- 📖 查看 [文檔目錄](./docs/)
- 🐛 報告 [Bug](https://github.com/DeanYCC/GoalPay/issues)
- 💡 提出 [功能建議](https://github.com/DeanYCC/GoalPay/issues)

---

**GoalPay v1.2.5** - 讓薪資分析變得簡單而有意義

*為日本工作者和全球用戶提供專業的財務管理工具*
