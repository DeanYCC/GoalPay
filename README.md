# GoalPay v1.2.0 - 財務助手應用程序

## 📋 版本信息

**版本**: 1.2.0  
**發布日期**: 2025年9月3日  
**狀態**: 穩定版本  
**主要變更**: 完整重構、API整合、多語言支持優化

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

### 部署與基礎設施
- **Vercel** - 前端和 API 部署平台
- **GitHub** - 代碼版本控制
- **環境配置** - 開發/生產環境分離

## 📁 項目結構

```
GoalPay/
├── goalpay-app/                    # 主要應用目錄
│   ├── frontend/                   # React 前端應用
│   │   ├── src/
│   │   │   ├── components/         # React 組件
│   │   │   ├── pages/             # 頁面組件
│   │   │   ├── contexts/          # React Context
│   │   │   ├── i18n/              # 國際化配置
│   │   │   ├── config/            # 配置文件
│   │   │   └── types/             # TypeScript 類型定義
│   │   ├── public/                # 靜態資源
│   │   └── package.json
│   ├── backend/                    # Node.js 後端 API
│   │   ├── src/
│   │   │   ├── routes/            # API 路由
│   │   │   ├── models/            # 數據模型
│   │   │   ├── middleware/        # 中間件
│   │   │   └── config/            # 配置文件
│   │   └── package.json
│   ├── api/                       # Vercel API 路由
│   ├── db/                        # 數據庫相關文件
│   └── docs/                      # 項目文檔
├── goalpay-nextjs/                # Next.js 版本（實驗性）
└── README.md                      # 主文檔
```

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
- 前端: http://localhost:3000
- 後端 API: http://localhost:5001
- 健康檢查: http://localhost:5001/health

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

### 前端配置
- API 端點自動檢測（開發/生產環境）
- 多語言支持（繁體中文、英文、日文）
- 響應式設計適配

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

## 🎨 UI/UX 特色

### 設計原則
- **響應式設計** - 適配所有設備尺寸
- **無障礙設計** - 支持鍵盤導航和屏幕閱讀器
- **直觀操作** - 簡潔的用戶界面和清晰的導航
- **性能優化** - 快速載入和流暢交互

### 主題系統
- **淺色主題** - 明亮清晰的界面
- **深色主題** - 護眼的暗色模式
- **自動切換** - 根據系統偏好自動切換

## 🔒 安全特性

### 認證與授權
- **Google OAuth 2.0** - 安全的第三方登錄
- **JWT Token** - 無狀態會話管理
- **密碼加密** - 安全的密碼存儲

### 數據保護
- **輸入驗證** - 防止惡意輸入
- **SQL 注入防護** - 參數化查詢
- **CORS 配置** - 跨域請求控制
- **速率限制** - 防止濫用

## 🚀 部署指南

### Vercel 部署（推薦）

#### 1. 準備部署
```bash
cd goalpay-app
git add .
git commit -m "Prepare for deployment"
git push origin main
```

#### 2. Vercel 配置
- 連接 GitHub 倉庫
- 選擇 `goalpay-app` 目錄
- 配置構建設置：
  - **Framework**: Vite
  - **Build Command**: `cd frontend && npm install && npm run build`
  - **Output Directory**: `frontend/dist`

#### 3. 環境變量
在 Vercel Dashboard 中設置：
- `NODE_ENV=production`
- 其他必要的環境變量

### 自托管部署

#### 後端部署
```bash
cd backend
npm install
npm run build
npm start
```

#### 前端部署
```bash
cd frontend
npm install
npm run build
# 部署 dist/ 目錄到 Web 服務器
```

## 🧪 測試

### 運行測試
```bash
# 後端測試
cd backend
npm test

# 前端測試
cd frontend
npm test
```

### 手動測試清單
- [ ] 用戶註冊和登錄
- [ ] 薪資單上傳和編輯
- [ ] 儀表板數據顯示
- [ ] 報告生成和匯出
- [ ] 多語言切換
- [ ] 響應式設計

## 🔧 故障排除

### 常見問題

#### 1. 服務器連接問題
**症狀**: `ERR_CONNECTION_REFUSED`
**解決方案**:
- 確保後端服務器正在運行
- 檢查端口是否被佔用
- 確認防火牆設置

#### 2. 數據庫連接問題
**症狀**: 無法連接到 PostgreSQL
**解決方案**:
- 檢查數據庫服務狀態
- 確認連接字符串正確
- 檢查用戶權限

#### 3. OAuth 配置問題
**症狀**: Google 登錄失敗
**解決方案**:
- 檢查 OAuth 憑證配置
- 確認回調 URL 正確
- 檢查域名白名單

#### 4. 構建錯誤
**症狀**: 前端構建失敗
**解決方案**:
- 檢查依賴版本兼容性
- 確認 TypeScript 配置
- 檢查環境變量設置

## 📈 版本歷史

### v1.2.0 (2025-09-03)
- ✅ 完整重構前端架構
- ✅ 實現多語言支持系統
- ✅ 添加測試登入功能
- ✅ 優化 API 整合
- ✅ 改進錯誤處理
- ✅ 添加診斷系統
- ✅ 完善文檔

### v1.1.0 (早期版本)
- ✅ 基礎功能實現
- ✅ Google OAuth 整合
- ✅ 薪資管理功能

### v1.0.0 (初始版本)
- ✅ 項目初始化
- ✅ 基礎架構搭建

## 🤝 貢獻指南

### 開發流程
1. Fork 項目倉庫
2. 創建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 創建 Pull Request

### 代碼規範
- 使用 TypeScript 進行類型檢查
- 遵循 ESLint 規則
- 編寫單元測試
- 更新相關文檔

## 📄 許可證

本項目採用 ISC 許可證 - 詳見 [LICENSE](LICENSE) 文件

## 🆘 支援

### 獲取幫助
- 📖 查看 [文檔目錄](docs/)
- 🐛 報告 [Bug](https://github.com/DeanYCC/GoalPay/issues)
- 💡 提出 [功能建議](https://github.com/DeanYCC/GoalPay/issues)
- 📧 聯繫開發團隊

### 社區資源
- [GitHub Discussions](https://github.com/DeanYCC/GoalPay/discussions)
- [Wiki 文檔](https://github.com/DeanYCC/GoalPay/wiki)
- [更新日誌](CHANGELOG.md)

## 🔮 未來規劃

### 短期目標 (v1.3.0)
- [ ] 移動端應用開發
- [ ] 高級分析功能
- [ ] 數據備份和同步
- [ ] 性能優化

### 長期目標 (v2.0.0)
- [ ] AI 驅動的財務建議
- [ ] 行業薪資比較
- [ ] 投資組合管理
- [ ] 稅務規劃工具

---

**GoalPay v1.2.0** - 讓薪資分析變得簡單而有意義

*為日本工作者和全球用戶提供專業的財務管理工具*
