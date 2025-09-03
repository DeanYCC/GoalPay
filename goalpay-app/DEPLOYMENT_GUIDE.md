# GoalPay v1.2.0 部署指南

## 🚀 快速部署

### Vercel 部署（推薦）

#### 1. 準備項目
```bash
cd goalpay-app
git add .
git commit -m "Prepare for v1.2.0 deployment"
git push origin main
```

#### 2. Vercel 配置
1. 前往 [vercel.com](https://vercel.com)
2. 點擊 "New Project"
3. 選擇 GitHub 倉庫 `DeanYCC/GoalPay`
4. 選擇 `goalpay-app` 目錄
5. 配置構建設置：
   - **Framework Preset**: Vite
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `cd frontend && npm install`

#### 3. 環境變量
在 Vercel Dashboard 中設置：
```env
NODE_ENV=production
```

### 自托管部署

#### 後端部署
```bash
cd goalpay-app/backend
npm install
npm start
```

#### 前端部署
```bash
cd goalpay-app/frontend
npm install
npm run build
# 部署 dist/ 目錄到 Web 服務器
```

## 🔧 配置說明

### vercel.json
```json
{
  "version": 2,
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "cd frontend && npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### API 路由
- `/api/health` - 健康檢查
- `/api/dashboard/summary` - 儀表板數據
- `/api/dashboard/test-data` - 測試數據
- `/api/payroll` - 薪資管理
- `/api/support/faq` - 支援 FAQ
- `/api/support/system-status` - 系統狀態

## 🚨 故障排除

### 常見問題

#### 1. 404 錯誤
**問題**: 部署後出現 404 錯誤
**解決方案**:
- 確保選擇了正確的目錄 (`goalpay-app`)
- 檢查 `vercel.json` 配置
- 確認構建命令正確

#### 2. 構建失敗
**問題**: 構建過程中出現錯誤
**解決方案**:
- 檢查 Node.js 版本（建議 18+）
- 確保所有依賴已安裝
- 查看構建日誌中的具體錯誤

#### 3. API 路由不工作
**問題**: API 端點返回 404
**解決方案**:
- 確保 API 文件在 `api/` 目錄中
- 檢查文件名和路徑
- 確認導出格式正確

### 檢查清單

部署前檢查：
- [ ] `goalpay-app/frontend/dist/` 目錄存在
- [ ] `goalpay-app/vercel.json` 配置正確
- [ ] `goalpay-app/api/` 目錄包含 API 文件
- [ ] GitHub 倉庫已推送最新代碼

## 📊 部署狀態

### v1.2.0 部署狀態
- ✅ **前端**: 已部署到 Vercel
- ✅ **API**: 已配置 Vercel Functions
- ✅ **數據庫**: 使用靜態數據（開發階段）
- ✅ **認證**: Google OAuth 配置完成

### 生產環境 URL
- **主應用**: https://goalpay-app.vercel.app
- **API 端點**: https://goalpay-app.vercel.app/api/*

## 🔄 更新部署

### 自動部署
- 推送到 `main` 分支會自動觸發部署
- Vercel 會自動構建和部署最新版本

### 手動部署
```bash
# 使用 Vercel CLI
vercel --prod
```

## 📈 監控

### 性能監控
- Vercel Analytics
- 錯誤追蹤
- 性能指標

### 健康檢查
- 定期檢查 API 端點
- 監控錯誤率
- 檢查響應時間

---

**GoalPay v1.2.0** - 部署指南
