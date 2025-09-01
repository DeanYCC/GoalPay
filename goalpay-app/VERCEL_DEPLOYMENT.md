# GoalPay Vercel 部署指南

## 部署步驟

### 1. 準備項目

確保您的項目結構如下：
```
goalpay-app/
├── frontend/          # React前端
├── api/              # Vercel API路由
├── vercel.json       # Vercel配置
└── README.md
```

### 2. 連接到Vercel

1. **安裝Vercel CLI**（可選）：
   ```bash
   npm i -g vercel
   ```

2. **在Vercel Dashboard中連接GitHub**：
   - 前往 [vercel.com](https://vercel.com)
   - 點擊 "New Project"
   - 選擇您的GitHub倉庫
   - 選擇 `goalpay-app` 目錄

### 3. 配置部署設置

在Vercel Dashboard中設置：

#### 構建配置
- **Framework Preset**: Vite
- **Build Command**: `cd frontend && npm install && npm run build`
- **Output Directory**: `frontend/dist`
- **Install Command**: `cd frontend && npm install`

#### 環境變量（可選）
```
NODE_ENV=production
```

### 4. 部署

點擊 "Deploy" 按鈕開始部署。

## 項目結構說明

### 前端 (frontend/)
- React + TypeScript + Vite
- Tailwind CSS 樣式
- 多語言支持 (i18n)

### API路由 (api/)
- `/api/health.js` - 健康檢查
- `/api/dashboard/summary.js` - 儀表板數據
- `/api/payroll/index.js` - 薪資管理
- `/api/support/faq.js` - 支援FAQ
- `/api/support/system-status.js` - 系統狀態

### 配置文件
- `vercel.json` - Vercel部署配置
- `frontend/vite.config.ts` - Vite構建配置

## 常見問題解決

### 1. 404錯誤
**問題**: 部署後出現404錯誤
**解決方案**:
- 檢查 `vercel.json` 中的 `rewrites` 配置
- 確保 `outputDirectory` 指向正確的構建目錄
- 檢查構建命令是否正確

### 2. API路由不工作
**問題**: API端點返回404
**解決方案**:
- 確保API文件在 `api/` 目錄中
- 檢查文件名和路徑是否正確
- 確保導出格式正確（使用 `export default`）

### 3. 構建失敗
**問題**: 構建過程中出現錯誤
**解決方案**:
- 檢查 `package.json` 中的依賴是否完整
- 確保所有TypeScript錯誤已修復
- 檢查Node.js版本兼容性

### 4. 環境變量問題
**問題**: 生產環境中無法訪問環境變量
**解決方案**:
- 在Vercel Dashboard中設置環境變量
- 使用 `process.env.VARIABLE_NAME` 訪問
- 確保變量名稱正確

## 本地測試

### 1. 安裝依賴
```bash
cd goalpay-app/frontend
npm install
```

### 2. 啟動開發服務器
```bash
npm run dev
```

### 3. 構建生產版本
```bash
npm run build
```

### 4. 預覽構建結果
```bash
npm run preview
```

## 部署後檢查

### 1. 基本功能測試
- [ ] 首頁加載正常
- [ ] 路由導航正常
- [ ] API端點響應正常
- [ ] 樣式顯示正確

### 2. API端點測試
```bash
# 健康檢查
curl https://your-domain.vercel.app/api/health

# 儀表板數據
curl https://your-domain.vercel.app/api/dashboard/summary

# 支援FAQ
curl https://your-domain.vercel.app/api/support/faq
```

### 3. 性能檢查
- 使用Lighthouse檢查性能
- 檢查Core Web Vitals
- 確保加載時間合理

## 自定義域名

### 1. 添加自定義域名
1. 在Vercel Dashboard中選擇項目
2. 前往 "Settings" > "Domains"
3. 添加您的域名
4. 配置DNS記錄

### 2. SSL證書
- Vercel自動提供SSL證書
- 確保HTTPS正常工作

## 監控和分析

### 1. Vercel Analytics
- 啟用Vercel Analytics
- 監控頁面訪問和性能

### 2. 錯誤監控
- 設置錯誤通知
- 監控API錯誤率

## 更新部署

### 1. 自動部署
- 推送到GitHub主分支自動觸發部署
- 每次提交都會創建新的部署

### 2. 手動部署
```bash
vercel --prod
```

### 3. 回滾
- 在Vercel Dashboard中可以回滾到之前的版本
- 每個部署都有唯一的URL

## 最佳實踐

### 1. 代碼質量
- 使用TypeScript確保類型安全
- 添加適當的錯誤處理
- 優化包大小

### 2. 性能優化
- 使用代碼分割
- 優化圖片和資源
- 啟用緩存策略

### 3. 安全性
- 驗證所有用戶輸入
- 使用HTTPS
- 定期更新依賴

## 故障排除

### 查看日誌
1. 在Vercel Dashboard中選擇部署
2. 點擊 "Functions" 查看函數日誌
3. 檢查構建日誌中的錯誤信息

### 常見錯誤
- **Module not found**: 檢查導入路徑
- **Build failed**: 檢查TypeScript錯誤
- **API timeout**: 檢查函數執行時間

## 聯繫支持

如果遇到問題：
1. 查看Vercel文檔
2. 檢查GitHub Issues
3. 聯繫Vercel支持團隊

---

這個部署指南應該能幫助您成功將GoalPay部署到Vercel上。如果遇到任何問題，請參考故障排除部分或聯繫支持。
