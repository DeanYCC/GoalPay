#!/bin/bash

# GoalPay 專案完整測試執行腳本
# 此腳本會執行所有子專案的單元測試並生成報告

echo "🚀 開始執行 GoalPay 專案完整測試..."
echo "================================================"

# 設置顏色輸出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 測試結果統計
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# 函數：執行測試並記錄結果
run_test_suite() {
    local project_name=$1
    local project_path=$2
    local test_command=$3
    
    echo -e "\n${BLUE}📁 測試專案: ${project_name}${NC}"
    echo "路徑: ${project_path}"
    echo "命令: ${test_command}"
    echo "----------------------------------------"
    
    cd "${project_path}" || {
        echo -e "${RED}❌ 無法進入目錄: ${project_path}${NC}"
        return 1
    }
    
    # 檢查是否存在 package.json
    if [ ! -f "package.json" ]; then
        echo -e "${RED}❌ 找不到 package.json 文件${NC}"
        return 1
    fi
    
    # 安裝依賴（如果需要）
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}📦 安裝依賴...${NC}"
        npm install
    fi
    
    # 執行測試
    echo -e "${YELLOW}🧪 執行測試...${NC}"
    if eval "${test_command}"; then
        echo -e "${GREEN}✅ ${project_name} 測試通過${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}❌ ${project_name} 測試失敗${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    cd - > /dev/null
}

# 創建測試報告目錄
REPORT_DIR="./test-reports"
mkdir -p "${REPORT_DIR}"

# 記錄開始時間
START_TIME=$(date +%s)

echo -e "${BLUE}📊 測試開始時間: $(date)${NC}"

# 1. 測試 goalpay-app/backend (Jest)
run_test_suite "GoalPay Backend API" "./goalpay-app/backend" "npm test -- --coverage --coverageReporters=text-lcov --coverageReporters=html --outputFile=${REPORT_DIR}/backend-coverage.lcov"

# 2. 測試 goalpay-app/frontend (Vitest)
run_test_suite "GoalPay Frontend React" "./goalpay-app/frontend" "npm test -- --coverage --reporter=verbose --reporter=html --outputFile=${REPORT_DIR}/frontend-coverage.html"

# 3. 測試 goalpay-nextjs (Jest)
run_test_suite "GoalPay Next.js" "./goalpay-nextjs" "npm test -- --coverage --coverageReporters=text-lcov --coverageReporters=html --outputFile=${REPORT_DIR}/nextjs-coverage.lcov"

# 記錄結束時間
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo -e "\n${BLUE}================================================${NC}"
echo -e "${BLUE}📊 測試執行完成${NC}"
echo -e "${BLUE}================================================${NC}"

# 顯示測試結果摘要
echo -e "\n${BLUE}📈 測試結果摘要:${NC}"
echo -e "總測試套件: ${TOTAL_TESTS}"
echo -e "${GREEN}通過: ${PASSED_TESTS}${NC}"
echo -e "${RED}失敗: ${FAILED_TESTS}${NC}"
echo -e "執行時間: ${DURATION} 秒"

# 生成測試報告
echo -e "\n${BLUE}📄 生成測試報告...${NC}"
cat > "${REPORT_DIR}/test-summary.md" << EOF
# GoalPay 專案測試報告

## 測試執行摘要

- **執行時間**: $(date)
- **總測試套件**: ${TOTAL_TESTS}
- **通過**: ${PASSED_TESTS}
- **失敗**: ${FAILED_TESTS}
- **執行時長**: ${DURATION} 秒

## 測試覆蓋率報告

### 1. Backend API (Express.js + Jest)
- 測試框架: Jest
- 覆蓋率報告: [backend-coverage.lcov](./backend-coverage.lcov)
- HTML 報告: [backend-coverage/index.html](./backend-coverage/index.html)

### 2. Frontend React (Vite + Vitest)
- 測試框架: Vitest
- 覆蓋率報告: [frontend-coverage.html](./frontend-coverage.html)
- HTML 報告: [frontend-coverage/index.html](./frontend-coverage/index.html)

### 3. Next.js 全棧 (Next.js + Jest)
- 測試框架: Jest
- 覆蓋率報告: [nextjs-coverage.lcov](./nextjs-coverage.lcov)
- HTML 報告: [nextjs-coverage/index.html](./nextjs-coverage/index.html)

## 測試內容

### Backend API 測試
- ✅ 認證路由測試 (auth.test.js)
- ✅ 薪資管理路由測試 (payroll.test.js)
- ✅ 儀表板路由測試 (dashboard.test.js)
- ✅ 報告路由測試 (reports.test.js)

### Frontend React 測試
- ✅ Dashboard 組件測試
- ✅ Layout 組件測試
- ✅ 薪資計算服務測試

### Next.js API 測試
- ✅ 認證 API 測試 (login, me)
- ✅ 公司管理 API 測試

## 建議

1. 定期執行測試以確保代碼品質
2. 在提交代碼前運行測試
3. 關注測試覆蓋率，目標 > 80%
4. 添加更多邊界條件測試

EOF

echo -e "${GREEN}✅ 測試報告已生成: ${REPORT_DIR}/test-summary.md${NC}"

# 顯示測試報告位置
echo -e "\n${BLUE}📁 測試報告位置:${NC}"
echo -e "總報告: ${REPORT_DIR}/test-summary.md"
echo -e "Backend 覆蓋率: ${REPORT_DIR}/backend-coverage/"
echo -e "Frontend 覆蓋率: ${REPORT_DIR}/frontend-coverage/"
echo -e "Next.js 覆蓋率: ${REPORT_DIR}/nextjs-coverage/"

# 根據測試結果設置退出碼
if [ ${FAILED_TESTS} -eq 0 ]; then
    echo -e "\n${GREEN}🎉 所有測試都通過了！${NC}"
    exit 0
else
    echo -e "\n${RED}⚠️  有 ${FAILED_TESTS} 個測試套件失敗${NC}"
    exit 1
fi
