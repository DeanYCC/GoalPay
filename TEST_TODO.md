# GoalPay 測試修復待辦清單

## 🚨 緊急修復項目 (High Priority)

### 1. Frontend 測試模組路徑問題
**問題**: 測試文件無法找到組件模組
**錯誤**: `Cannot find module '../pages/Dashboard'`
**影響**: Dashboard 組件測試完全失敗
**修復方案**:
- [ ] 檢查 `src/pages/Dashboard.tsx` 是否存在
- [ ] 修正測試文件中的相對路徑
- [ ] 更新 `vitest.config.ts` 中的路徑別名配置

### 2. Frontend Context Mock 問題
**問題**: 無法正確 mock React Context
**錯誤**: `Cannot find module '../../contexts/AuthContext'`
**影響**: Layout 組件認證測試失敗
**修復方案**:
- [ ] 檢查 Context 文件路徑
- [ ] 修正 mock 設置方式
- [ ] 使用 `vi.mock()` 替代 `require()` 方式

### 3. Next.js Jest 配置問題
**問題**: Jest 配置中的模組映射錯誤
**錯誤**: `Unknown option "moduleNameMapping"`
**影響**: Next.js 所有測試無法執行
**修復方案**:
- [x] 已修復: `moduleNameMapping` → `moduleNameMapper`
- [ ] 測試 Prisma mock 設置
- [ ] 驗證路徑別名 `@/` 解析

## ⚠️ 中等優先級修復項目 (Medium Priority)

### 4. Frontend API 依賴問題
**問題**: `companyService.ts` 中的 API 攔截器錯誤
**錯誤**: `Cannot read properties of undefined (reading 'request')`
**影響**: 服務層測試失敗
**修復方案**:
- [ ] Mock axios 實例的 `interceptors` 屬性
- [ ] 在測試設置中添加完整的 axios mock
- [ ] 分離 API 調用邏輯以便測試

### 5. React Router 警告
**問題**: React Router Future Flag 警告
**警告**: `React Router will begin wrapping state updates in React.startTransition`
**影響**: 測試輸出有警告，但不影響功能
**修復方案**:
- [ ] 在測試配置中添加 future flags
- [ ] 更新 React Router 版本
- [ ] 在測試中正確配置路由

### 6. 依賴版本衝突
**問題**: React 19 與 Testing Library 版本不兼容
**錯誤**: `peer react@"^18.0.0" from @testing-library/react`
**影響**: Next.js 專案安裝失敗
**修復方案**:
- [x] 已使用 `--legacy-peer-deps` 暫時解決
- [ ] 升級 Testing Library 到支援 React 19 的版本
- [ ] 或降級 React 到 18.x 版本

## 🔧 低優先級優化項目 (Low Priority)

### 7. 測試覆蓋率提升
**現況**: 整體覆蓋率約 60-70%
**目標**: 達到 80%+
**具體項目**:
- [ ] 添加更多邊界條件測試
- [ ] 增加錯誤處理測試
- [ ] 添加性能測試用例

### 8. 測試環境優化
**現況**: 測試執行時間較長
**優化項目**:
- [ ] 並行執行測試
- [ ] 優化 mock 設置
- [ ] 減少不必要的依賴加載

### 9. CI/CD 集成
**現況**: 手動執行測試
**目標**: 自動化測試流程
**具體項目**:
- [ ] 設置 GitHub Actions
- [ ] 配置自動測試觸發
- [ ] 添加測試結果通知

## 📋 修復順序建議

### 第一階段 (1-2天)
1. ✅ 修復 Next.js Jest 配置 (已完成)
2. 🔄 修復 Frontend 模組路徑問題
3. 🔄 修復 Frontend Context Mock 問題

### 第二階段 (3-5天)
4. 🔄 修復 Frontend API 依賴問題
5. 🔄 解決 React Router 警告
6. 🔄 處理依賴版本衝突

### 第三階段 (1-2週)
7. 🔄 提升測試覆蓋率
8. 🔄 優化測試環境
9. 🔄 設置 CI/CD

## 🎯 修復後預期結果

### 短期目標 (1週內)
- [ ] 所有測試套件能夠正常執行
- [ ] 測試通過率達到 90%+
- [ ] 消除所有配置錯誤

### 中期目標 (1個月內)
- [ ] 測試覆蓋率達到 80%+
- [ ] 建立完整的測試文檔
- [ ] 設置自動化測試流程

### 長期目標 (3個月內)
- [ ] 測試覆蓋率達到 90%+
- [ ] 集成 E2E 測試
- [ ] 建立測試最佳實踐指南

## 📊 當前狀態追蹤

| 項目 | 狀態 | 完成度 | 預估時間 |
|------|------|--------|----------|
| Next.js 配置 | ✅ 完成 | 100% | - |
| Frontend 路徑 | 🔄 進行中 | 0% | 2小時 |
| Context Mock | 🔄 進行中 | 0% | 4小時 |
| API 依賴 | 🔄 進行中 | 0% | 6小時 |
| 版本衝突 | ⚠️ 部分 | 50% | 2小時 |
| 覆蓋率提升 | ⏳ 待開始 | 0% | 1週 |

## 🔍 測試驗證清單

修復完成後，請執行以下驗證：

- [ ] `cd goalpay-app/backend && npm test` - 應該全部通過
- [ ] `cd goalpay-app/frontend && npm test -- --run` - 應該全部通過
- [ ] `cd goalpay-nextjs && npm test` - 應該全部通過
- [ ] `./run-tests.sh` - 應該顯示所有測試通過

---

**創建時間**: 2025年9月7日 00:15 (JST)  
**更新時間**: 2025年9月7日 00:15 (JST)  
**負責人**: GoalPay 開發團隊
