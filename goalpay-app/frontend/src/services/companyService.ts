import axios from 'axios';
import { Company, CreateCompanyRequest, UpdateCompanyRequest } from '../types/company';

const API_BASE_URL = 'http://localhost:5001/api';

// 獲取認證token
const getAuthToken = () => {
  return localStorage.getItem('token') || 'test-token-123';
};

// 創建axios實例
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 請求攔截器：添加認證token
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const companyService = {
  // 獲取所有公司
  async getCompanies(): Promise<Company[]> {
    const response = await api.get('/companies');
    return response.data;
  },

  // 獲取單個公司
  async getCompany(id: number): Promise<Company> {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  },

  // 創建新公司
  async createCompany(company: CreateCompanyRequest): Promise<Company> {
    const response = await api.post('/companies', company);
    return response.data;
  },

  // 更新公司
  async updateCompany(company: UpdateCompanyRequest): Promise<Company> {
    const response = await api.put(`/companies/${company.id}`, company);
    return response.data;
  },

  // 刪除公司
  async deleteCompany(id: number): Promise<void> {
    await api.delete(`/companies/${id}`);
  },

  // 設置當前公司
  async setCurrentCompany(id: number): Promise<void> {
    await api.patch(`/companies/${id}/set-current`);
  },

  // 獲取當前公司
  async getCurrentCompany(): Promise<Company | null> {
    try {
      const response = await api.get('/companies/current');
      return response.data;
    } catch (error) {
      return null;
    }
  }
};
