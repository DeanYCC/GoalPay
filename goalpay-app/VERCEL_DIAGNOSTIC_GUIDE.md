# Vercel部署診斷指南

## 🔍 診斷步驟

### 1. 檢查Vercel部署狀態

#### 前往Vercel Dashboard
1. 登入 [Vercel Dashboard](https://vercel.com/dashboard)
2. 找到您的GoalPay項目
3. 檢查部署狀態是否為 "Ready"

#### 檢查部署日誌
1. 點擊最新的部署
2. 查看 "Functions" 標籤
3. 檢查是否有錯誤信息

### 2. 測試API端點

#### 在瀏覽器中測試
打開以下URL測試API是否正常工作：

```
https://your-domain.vercel.app/api/dashboard/summary
https://your-domain.vercel.app/api/dashboard/test-data
https://your-domain.vercel.app/api/health
```

#### 預期結果
應該看到JSON數據，例如：
```json
{
  "totalSalary": 1250000,
  "averageSalary": 416667,
  "totalEmployees": 3,
  "monthlyGrowth": 5.2,
  "recentPayrolls": [...]
}
```

### 3. 檢查瀏覽器控制台

#### 打開開發者工具
1. 在您的Vercel部署頁面按 F12
2. 切換到 "Console" 標籤
3. 查看是否有錯誤信息

#### 常見錯誤
- `Failed to fetch`: 網絡連接問題
- `CORS error`: 跨域問題
- `404 Not Found`: API路由不存在

### 4. 檢查網絡請求

#### 在開發者工具中
1. 切換到 "Network" 標籤
2. 刷新頁面
3. 查看對 `/api/dashboard/summary` 的請求
4. 檢查響應狀態碼和內容

### 5. 常見問題解決方案

#### 問題1: 404 Not Found
**原因**: API路由不存在
**解決**: 確保 `goalpay-app/api/dashboard/summary.js` 文件存在

#### 問題2: CORS錯誤
**原因**: 跨域請求被阻止
**解決**: API已添加CORS頭，應該已解決

#### 問題3: 函數超時
**原因**: Vercel函數執行時間過長
**解決**: 已優化API響應時間

#### 問題4: 環境變量問題
**原因**: 缺少必要的環境變量
**解決**: 檢查Vercel項目設置中的環境變量

### 6. 手動測試步驟

#### 步驟1: 測試健康檢查
```bash
curl https://your-domain.vercel.app/api/health
```

#### 步驟2: 測試儀表板API
```bash
curl https://your-domain.vercel.app/api/dashboard/summary
```

#### 步驟3: 測試測試數據API
```bash
curl https://your-domain.vercel.app/api/dashboard/test-data
```

### 7. 如果問題持續

#### 檢查Vercel配置
1. 確認 `vercel.json` 配置正確
2. 檢查構建命令是否成功
3. 查看函數日誌

#### 重新部署
1. 在Vercel Dashboard中點擊 "Redeploy"
2. 等待部署完成
3. 重新測試

#### 聯繫支持
如果問題持續，請提供：
- Vercel部署URL
- 錯誤截圖
- 瀏覽器控制台日誌

---

按照這個指南，您應該能夠找到並解決儀表板數據載入問題！
