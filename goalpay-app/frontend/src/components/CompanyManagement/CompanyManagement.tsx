import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '../../contexts/LanguageContext';
import { companyService } from '../../services/companyService';
import { Company, CreateCompanyRequest } from '../../types/company';
import { Plus, Edit, Trash2, Building, Calendar, User, Briefcase } from 'lucide-react';

interface CompanyManagementProps {
  onCompanySelect?: (company: Company) => void;
  showCurrentOnly?: boolean;
}

const CompanyManagement: React.FC<CompanyManagementProps> = ({ 
  onCompanySelect, 
  showCurrentOnly = false 
}) => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState<CreateCompanyRequest>({
    name: '',
    employeeId: '',
    position: '',
    isCurrent: false,
    startDate: '',
    endDate: '',
    paydayType: 'month_end',
    customPayday: 25,
    periodStartDay: 1,
    periodEndDay: 31,
    currency: 'JPY'
  });

  // 獲取公司列表
  const { data: companies = [], isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: companyService.getCompanies
  });

  // 創建公司
  const createMutation = useMutation({
    mutationFn: companyService.createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      resetForm();
      setShowForm(false);
    }
  });

  // 更新公司
  const updateMutation = useMutation({
    mutationFn: companyService.updateCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      resetForm();
      setShowForm(false);
      setEditingCompany(null);
    }
  });

  // 刪除公司
  const deleteMutation = useMutation({
    mutationFn: companyService.deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    }
  });

  // 設置當前公司
  const setCurrentMutation = useMutation({
    mutationFn: companyService.setCurrentCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      employeeId: '',
      position: '',
      isCurrent: false,
      startDate: '',
      endDate: '',
      paydayType: 'month_end',
      customPayday: 25,
      periodStartDay: 1,
      periodEndDay: 31,
      currency: 'JPY'
    });
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      employeeId: company.employeeId,
      position: company.position,
      isCurrent: company.isCurrent,
      startDate: company.startDate,
      endDate: company.endDate || '',
      paydayType: company.paydayType,
      customPayday: company.customPayday,
      periodStartDay: company.periodStartDay,
      periodEndDay: company.periodEndDay,
      currency: company.currency
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCompany) {
      updateMutation.mutate({
        id: editingCompany.id,
        ...formData
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm(t('settings.confirmDeleteCompany'))) {
      deleteMutation.mutate(id);
    }
  };

  const handleSetCurrent = (id: number) => {
    setCurrentMutation.mutate(id);
  };

  const filteredCompanies = showCurrentOnly 
    ? companies.filter(company => company.isCurrent)
    : companies;

  if (isLoading) {
    return <div className="text-center py-8">{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      {/* 新增按鈕 */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            resetForm();
            setEditingCompany(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          {t('settings.addCompany')}
        </button>
      </div>

      {/* 公司列表 */}
      <div className="grid gap-4">
        {filteredCompanies.map((company) => (
          <div
            key={company.id}
            className={`p-4 border rounded-lg ${
              company.isCurrent ? 'border-primary bg-primary/5' : 'border-border'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Building className="w-4 h-4 text-primary" />
                  <h4 className="font-medium">{company.name}</h4>
                                     {company.isCurrent && (
                     <span className="px-2 py-1 text-xs bg-primary text-white rounded-full">
                       {t('settings.currentPosition')}
                     </span>
                   )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{t('settings.employeeId')}：{company.employeeId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span>{t('settings.position')}：{company.position}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{t('settings.employmentPeriod')}：{company.startDate} ~ {company.endDate || t('settings.now')}</span>
                  </div>
                  <div>
                    <span>{t('settings.currency')}：{company.currency}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                                 {!company.isCurrent && (
                   <button
                     onClick={() => handleSetCurrent(company.id)}
                     className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                   >
                     {t('settings.setAsCurrent')}
                   </button>
                 )}
                <button
                  onClick={() => handleEdit(company)}
                  className="p-2 text-muted-foreground hover:text-foreground"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(company.id)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 新增/編輯表單 */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingCompany ? t('settings.editCompany') : t('settings.addCompany')}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t('settings.companyName')} *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">{t('settings.employeeId')} *</label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">{t('settings.position')} *</label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">{t('settings.currency')}</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({...formData, currency: e.target.value as any})}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  >
                    <option value="JPY">JPY ({t('currency.jpy')})</option>
                    <option value="USD">USD ({t('currency.usd')})</option>
                    <option value="EUR">EUR ({t('currency.eur')})</option>
                    <option value="CNY">CNY ({t('currency.cny')})</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">{t('settings.startDate')} *</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">{t('settings.endDate')}</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  />
                </div>
              </div>

              {/* 發薪日設定 */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-foreground">發薪日設定</h4>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-4">
                    💡 發薪日是指您收到薪資的日期，工作區間是指這筆薪資對應的工作期間
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">發薪日類型</label>
                      <select
                        value={formData.paydayType}
                        onChange={(e) => setFormData({...formData, paydayType: e.target.value as any})}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                      >
                        <option value="month_end">月底發薪（每月最後一天發薪）</option>
                        <option value="custom_day">固定日期發薪（每月固定日期發薪）</option>
                        <option value="custom_period">自訂計算期間（自訂工作期間計算）</option>
                      </select>
                    </div>

                    {formData.paydayType === 'custom_day' && (
                      <div>
                        <label className="block text-sm font-medium mb-2">發薪日期（每月幾號）</label>
                        <select
                          value={formData.customPayday}
                          onChange={(e) => setFormData({...formData, customPayday: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                        >
                          {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                            <option key={day} value={day}>{day}日</option>
                          ))}
                        </select>
                        <p className="text-xs text-muted-foreground mt-1">
                          例如：選擇25日，表示每月25日發薪，對應上月26日到本月25日的工作期間
                        </p>
                      </div>
                    )}

                                         {formData.paydayType === 'custom_period' && (
                       <div className="space-y-4">
                         <div className="grid grid-cols-2 gap-4">
                           <div>
                             <label className="block text-sm font-medium mb-2">工作期間開始日</label>
                             <select
                               value={formData.periodStartDay}
                               onChange={(e) => setFormData({...formData, periodStartDay: parseInt(e.target.value)})}
                               className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                             >
                               {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                                 <option key={day} value={day}>{day}日</option>
                               ))}
                             </select>
                           </div>
                           <div>
                             <label className="block text-sm font-medium mb-2">工作期間結束日</label>
                             <select
                               value={formData.periodEndDay}
                               onChange={(e) => setFormData({...formData, periodEndDay: parseInt(e.target.value)})}
                               className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                             >
                               {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                                 <option key={day} value={day}>{day}日</option>
                               ))}
                             </select>
                           </div>
                         </div>
                         
                         <div>
                           <label className="block text-sm font-medium mb-2">發薪日期（每月幾號）</label>
                           <select
                             value={formData.customPayday}
                             onChange={(e) => setFormData({...formData, customPayday: parseInt(e.target.value)})}
                             className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                           >
                             {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                               <option key={day} value={day}>{day}日</option>
                             ))}
                           </select>
                         </div>
                         
                         <p className="text-xs text-muted-foreground">
                           例如：開始日1日，結束日31日，發薪日25日，表示每月1日到31日為工作期間，次月25日發薪
                         </p>
                       </div>
                     )}

                    {/* 當前設定說明 */}
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        {(() => {
                          if (formData.paydayType === 'month_end') {
                            return '月底發薪：每月最後一天發薪，對應當月1日到月底的工作期間';
                          } else if (formData.paydayType === 'custom_day') {
                            return `固定日期發薪：每月${formData.customPayday}日發薪，對應上月${formData.customPayday}日後一天到本月${formData.customPayday}日的工作期間`;
                          } else if (formData.paydayType === 'custom_period') {
                            return `自訂計算期間：每月${formData.periodStartDay}日到${formData.periodEndDay}日為工作期間`;
                          }
                          return '';
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isCurrent"
                  checked={formData.isCurrent}
                  onChange={(e) => setFormData({...formData, isCurrent: e.target.checked})}
                  className="rounded"
                />
                <label htmlFor="isCurrent" className="text-sm">{t('settings.setAsCurrentCompany')}</label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingCompany(null);
                    resetForm();
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-muted"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending ? t('common.saving') : t('common.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyManagement;
