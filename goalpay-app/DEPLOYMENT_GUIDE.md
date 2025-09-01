# GoalPay Vercel 部署指南

## 🚀 快速部署步驟

### 1. 準備項目
您的項目已經準備好部署，包含：
- ✅ 前端構建文件 (`frontend/dist/`)
- ✅ Vercel配置 (`vercel.json`)
- ✅ API路由 (`api/`)

### 2. 部署到Vercel

#### 方法一：使用Vercel Dashboard（推薦）
1. 前往 [vercel.com](https://vercel.com)
2. 點擊 "New Project"
3. 選擇您的GitHub倉庫 `DeanYCC/GoalPay`
4. 選擇 `goalpay-app` 目錄
5. 配置構建設置：
   - **Framework Preset**: Vite
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `cd frontend && npm install`
6. 點擊 "Deploy"

#### 方法二：使用Vercel CLI
```bash
# 安裝Vercel CLI
npm i -g vercel

# 在goalpay-app目錄中部署
cd goalpay-app
vercel

# 生產部署
vercel --prod
```

### 3. 部署配置

#### vercel.json 配置
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

#### API路由
- `/api/health` - 健康檢查
- `/api/dashboard/summary` - 儀表板數據
- `/api/payroll` - 薪資管理
- `/api/support/faq` - 支援FAQ
- `/api/support/system-status` - 系統狀態

## 🔧 故障排除

### 常見問題

#### 1. 404錯誤
**問題**: 部署後出現404錯誤
**解決方案**:
- 確保選擇了正確的目錄 (`goalpay-app`)
- 檢查 `vercel.json` 配置
- 確認構建命令正確

#### 2. 構建失敗
**問題**: 構建過程中出現錯誤
**解決方案**:
- 檢查Node.js版本（建議16+）
- 確保所有依賴已安裝
- 查看構建日誌中的具體錯誤

#### 3. API路由不工作
**問題**: API端點返回404
**解決方案**:
- 確保API文件在 `api/` 目錄中
- 檢查文件名和路徑
- 確認導出格式正確

### 檢查清單

部署前檢查：
- [ ] `goalpay-app/frontend/dist/` 目錄存在
- [ ] `goalpay-app/vercel.json` 配置正確
- [ ] `goalpay-app/api/` 目錄包含API文件
- [ ] GitHub倉庫已推送最新代碼

部署後檢查：
- [ ] 首頁加載正常
- [ ] 路由導航正常
- [ ] API端點響應正常
- [ ] 樣式顯示正確

## 📊 測試API端點

部署完成後，測試以下端點：

```bash
# 健康檢查
curl https://your-domain.vercel.app/api/health

# 儀表板數據
curl https://your-domain.vercel.app/api/dashboard/summary

# 支援FAQ
curl https://your-domain.vercel.app/api/support/faq
```

## 🔄 更新部署

### 自動部署
- 推送到GitHub主分支自動觸發部署
- 每次提交都會創建新的部署

### 手動部署
```bash
vercel --prod
```

## 📞 獲取幫助

如果遇到問題：
1. 查看Vercel部署日誌
2. 檢查GitHub Actions（如果使用）
3. 聯繫Vercel支持

## 🎉 部署成功

部署成功後，您將獲得：
- 生產環境URL（如：`https://goalpay-xxx.vercel.app`）
- 自動SSL證書
- CDN加速
- 自動擴展

---

**注意**: 這個部署配置專注於前端展示，API端點提供模擬數據。如果需要完整的後端功能，建議使用其他平台（如Railway、Heroku等）部署後端服務。
