# GoalPay 故障排除指南

## 常見問題

### 1. 無法載入儀表板數據，請檢查網絡連接

**問題描述：**
前端顯示 "無法載入儀表板數據，請檢查網絡連接" 錯誤訊息。

**原因：**
後端服務器未運行，導致前端無法連接到 API 端點。

**解決方案：**

#### 方法一：使用啟動腳本（推薦）
```bash
# 在 goalpay-app 目錄下執行
./start-dev.sh
```

#### 方法二：手動啟動服務器
```bash
# 啟動後端服務器
cd goalpay-app/backend
npm start

# 在新的終端視窗中啟動前端服務器
cd goalpay-app/frontend
npm run dev
```

#### 方法三：檢查服務器狀態
```bash
# 檢查後端服務器是否運行
curl http://localhost:5001/health

# 檢查前端服務器是否運行
curl http://localhost:3000
```

**預期結果：**
- 後端 API: http://localhost:5001
- 前端應用: http://localhost:3000
- 健康檢查: http://localhost:5001/health

### 2. 端口被佔用

**問題描述：**
啟動服務器時出現 "Port 5001 is already in use" 或 "Port 3000 is already in use" 錯誤。

**解決方案：**
```bash
# 查找佔用端口的進程
lsof -i :5001  # 後端端口
lsof -i :3000  # 前端端口

# 終止佔用端口的進程
kill -9 <PID>
```

### 3. 依賴包問題

**問題描述：**
啟動時出現模組找不到的錯誤。

**解決方案：**
```bash
# 重新安裝依賴包
cd goalpay-app/backend
npm install

cd goalpay-app/frontend
npm install
```

### 4. 環境變數問題

**問題描述：**
服務器啟動失敗或功能異常。

**解決方案：**
```bash
# 複製環境變數範例文件
cd goalpay-app/backend
cp env.example .env

# 編輯環境變數
nano .env
```

## API 端點測試

### 後端 API 端點
```bash
# 健康檢查
curl http://localhost:5001/health

# 儀表板摘要
curl http://localhost:5001/api/dashboard/summary

# 測試數據
curl http://localhost:5001/api/dashboard/test-data

# 年度摘要
curl http://localhost:5001/api/dashboard/yearly-summary
```

### 預期響應
```json
{
  "monthlyIncome": 450000,
  "monthlyDeductions": 85000,
  "netIncome": 365000,
  "growthRate": 5.2,
  "currency": "JPY"
}
```

## 開發環境檢查清單

- [ ] 後端服務器運行在端口 5001
- [ ] 前端服務器運行在端口 3000
- [ ] 健康檢查端點可訪問
- [ ] 儀表板 API 端點可訪問
- [ ] CORS 配置正確
- [ ] 環境變數設置正確
- [ ] 依賴包已安裝

## 日誌查看

### 後端日誌
```bash
# 查看後端服務器日誌
cd goalpay-app/backend
npm start
```

### 前端日誌
```bash
# 查看前端服務器日誌
cd goalpay-app/frontend
npm run dev
```

## 聯繫支援

如果問題仍然存在，請檢查：
1. Node.js 版本是否兼容
2. 操作系統是否支援
3. 防火牆設置
4. 網絡連接狀態
