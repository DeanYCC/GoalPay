// API配置
const getApiBaseUrl = () => {
  // 在生產環境中，API端點就是當前域名
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  // 開發環境使用localhost
  return 'http://localhost:5001';
};

export const API_BASE_URL = getApiBaseUrl();

// API端點配置
export const API_ENDPOINTS = {
  // 認證相關
  AUTH: {
    GOOGLE: `${API_BASE_URL}/api/auth/google`,
    VERIFY: `${API_BASE_URL}/api/auth/verify`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  },
  
  // 用戶相關
  USERS: {
    PROFILE: `${API_BASE_URL}/api/users/profile`,
  },
  
  // 儀表板相關
  DASHBOARD: {
    SUMMARY: `${API_BASE_URL}/api/dashboard/summary`,
    TEST_DATA: `${API_BASE_URL}/api/dashboard/test-data`,
  },
  
  // 薪資相關
  PAYROLL: {
    LIST: `${API_BASE_URL}/api/payroll`,
    DETAIL: (id: string) => `${API_BASE_URL}/api/payroll/${id}`,
    CREATE: `${API_BASE_URL}/api/payroll`,
    UPDATE: (id: string) => `${API_BASE_URL}/api/payroll/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/api/payroll/${id}`,
    CSV_TEMPLATE: `${API_BASE_URL}/api/payroll/template/csv`,
    CSV_UPLOAD: `${API_BASE_URL}/api/payroll/upload/csv`,
  },
  
  // 支援相關
  SUPPORT: {
    FAQ: `${API_BASE_URL}/api/support/faq`,
    SYSTEM_STATUS: `${API_BASE_URL}/api/support/system-status`,
    DIAGNOSTIC: `${API_BASE_URL}/api/support/diagnostic`,
  },
  
  // 健康檢查
  HEALTH: `${API_BASE_URL}/health`,
};

// 創建axios實例的配置
export const axiosConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};
