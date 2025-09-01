# GoalPay 診斷系統設計

## 概述

由於無法直接讀取終端使用者的帳號資料，我們設計了一個**隱私保護的診斷系統**，讓用戶可以安全地報告問題並獲得技術支援。

## 核心設計原則

### 1. 隱私保護優先
- **數據脫敏**：自動移除敏感個人信息
- **可選數據收集**：用戶控制要分享的信息
- **本地處理**：敏感數據在用戶端處理
- **加密傳輸**：確保數據安全傳輸

### 2. 用戶自主控制
- **選擇性分享**：用戶決定分享哪些信息
- **透明處理**：清楚說明數據用途
- **隨時撤回**：用戶可以撤回已發送的報告

### 3. 高效問題診斷
- **自動化收集**：系統自動收集相關信息
- **智能分類**：自動識別問題類別和優先級
- **標準化報告**：統一的報告格式便於處理

## 系統架構

### 前端組件

#### 1. 診斷工具 (`DiagnosticTool.tsx`)
```typescript
// 主要功能
- 收集系統信息（瀏覽器、網絡、API狀態）
- 監聽錯誤和異常
- 生成標準化報告
- 提供隱私設置選項
```

#### 2. 支援頁面 (`Support.tsx`)
```typescript
// 三個主要標籤頁
- 診斷工具：問題診斷和報告生成
- 常見問題：FAQ和自助解決方案
- 聯繫我們：聯繫方式和回應時間
```

### 後端API

#### 1. 支援API (`/api/support`)
```javascript
POST /diagnostic          // 接收診斷報告
GET  /status/:reportId    // 查詢報告狀態
GET  /faq                 // 獲取常見問題
GET  /system-status       // 系統狀態檢查
```

#### 2. 管理員API (`/api/admin`)
```javascript
GET  /diagnostic-reports           // 獲取所有報告
GET  /diagnostic-reports/:id       // 獲取特定報告
PATCH /diagnostic-reports/:id/status // 更新報告狀態
GET  /support-stats               // 支援統計
GET  /support-log                 // 支援日誌
```

## 數據流程

### 1. 問題報告流程
```
用戶遇到問題
    ↓
描述問題（文字描述）
    ↓
選擇隱私設置（是否包含敏感數據）
    ↓
生成診斷報告（自動收集系統信息）
    ↓
用戶審查報告內容
    ↓
下載報告或發送給支援團隊
    ↓
獲得報告ID和預估回應時間
```

### 2. 支援處理流程
```
接收診斷報告
    ↓
自動分類和優先級評估
    ↓
保存到支援系統
    ↓
管理員查看和處理
    ↓
更新報告狀態
    ↓
通知用戶處理結果
```

## 收集的診斷信息

### 基本系統信息
- **時間戳**：報告生成時間
- **語言設置**：用戶的語言偏好
- **時區**：用戶的時區設置
- **屏幕分辨率**：顯示設備信息
- **網絡狀態**：在線/離線狀態

### API端點測試
- **健康檢查**：`/health`
- **儀表板API**：`/api/dashboard/summary`
- **薪資API**：`/api/payroll`

### 性能指標
- **加載時間**：頁面加載性能
- **內存使用**：瀏覽器內存使用情況

### 錯誤信息
- **JavaScript錯誤**：未捕獲的錯誤
- **Promise拒絕**：異步操作錯誤
- **網絡錯誤**：API調用失敗

## 隱私保護措施

### 1. 數據脫敏
```javascript
// 敏感數據處理
const sanitizedData = {
  ...diagnosticInfo,
  userAgent: includeSensitiveData ? diagnosticInfo.userAgent : 'REDACTED',
  errors: diagnosticInfo.errors.map(error => ({
    ...error,
    stack: includeSensitiveData ? error.stack : 'REDACTED'
  }))
};
```

### 2. 可選數據收集
- **瀏覽器信息**：用戶可選擇是否包含
- **錯誤堆疊**：用戶可選擇是否包含詳細錯誤信息
- **性能數據**：用戶可選擇是否包含內存使用信息

### 3. 本地處理
- 所有敏感數據在用戶端處理
- 只有用戶同意的數據才會發送
- 用戶可以隨時撤回已發送的報告

## 問題分類系統

### 自動分類邏輯
```javascript
function categorizeIssue(userDescription, diagnosticInfo) {
  const description = userDescription.toLowerCase();
  const { apiEndpoints } = diagnosticInfo;
  
  if (description.includes('儀表板') || apiEndpoints.dashboard !== 'accessible') {
    return 'dashboard';
  }
  
  if (description.includes('上傳') || description.includes('csv')) {
    return 'upload';
  }
  
  // ... 其他分類邏輯
}
```

### 問題類別
- **dashboard**：儀表板相關問題
- **upload**：文件上傳問題
- **authentication**：認證問題
- **data**：數據保存問題
- **network**：網絡連接問題
- **general**：一般問題

## 優先級評估

### 評估標準
```javascript
function determinePriority(diagnosticInfo) {
  const { apiEndpoints, errors } = diagnosticInfo;
  
  // 有嚴重錯誤 = 高優先級
  if (errors.length > 0) return 'high';
  
  // 多個API不可達 = 高優先級
  const unreachableEndpoints = Object.values(apiEndpoints)
    .filter(status => status === 'unreachable').length;
  
  if (unreachableEndpoints >= 2) return 'high';
  if (unreachableEndpoints === 1) return 'medium';
  
  return 'low';
}
```

### 回應時間承諾
- **高優先級**：2-4小時內回應
- **中優先級**：24小時內回應
- **低優先級**：48小時內回應

## 管理員工具

### 報告管理
- 查看所有診斷報告
- 按狀態、優先級、類別篩選
- 更新報告狀態和添加管理員備註

### 統計分析
- 問題類別分布
- 優先級分布
- 回應時間統計
- 最近活動趨勢

### 支援日誌
- 記錄所有支援活動
- 追蹤問題解決時間
- 分析支援效率

## 使用指南

### 對於用戶

1. **遇到問題時**：
   - 前往支援頁面
   - 詳細描述問題
   - 使用診斷工具收集信息

2. **隱私設置**：
   - 選擇是否包含敏感數據
   - 審查生成的報告
   - 確認沒有個人信息洩露

3. **提交報告**：
   - 下載報告保存本地
   - 或直接發送給支援團隊
   - 記錄報告ID以便追蹤

### 對於管理員

1. **查看報告**：
   - 登入管理員界面
   - 查看待處理的報告
   - 按優先級處理問題

2. **更新狀態**：
   - 標記報告狀態
   - 添加處理備註
   - 通知用戶處理結果

3. **分析趨勢**：
   - 查看統計數據
   - 識別常見問題
   - 改進產品功能

## 安全考慮

### 數據保護
- 所有傳輸使用HTTPS
- 敏感數據在傳輸前加密
- 報告存儲在安全位置

### 訪問控制
- 管理員API需要認證
- 用戶只能查看自己的報告
- 定期清理過期數據

### 合規性
- 符合GDPR要求
- 提供數據刪除功能
- 透明的數據使用政策

## 未來擴展

### 1. 自動化支援
- 智能問題識別
- 自動解決方案建議
- 機器學習優化

### 2. 實時監控
- 實時系統狀態監控
- 主動問題檢測
- 預警系統

### 3. 用戶自助
- 知識庫擴展
- 視頻教程
- 互動式故障排除

這個診斷系統確保了在保護用戶隱私的前提下，能夠有效地收集必要的技術信息來解決問題，為用戶提供高質量的技術支援服務。
