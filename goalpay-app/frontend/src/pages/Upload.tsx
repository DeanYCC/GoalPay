import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { Upload as UploadIcon, FileText, Plus, X, Download, FileSpreadsheet } from 'lucide-react'
import CompanySelector from '../components/CompanySelector/CompanySelector'
import PayrollItemSelector from '../components/PayrollItemSelector/PayrollItemSelector'
import { Company } from '../types/company'
import { getDefaultItems, PayrollItemTemplate } from '../types/payrollItem'

const Upload: React.FC = () => {
  const { t } = useLanguage()
  // 從 localStorage 恢復狀態
  const [isManualEntry, setIsManualEntry] = useState(() => {
    const saved = localStorage.getItem('upload_isManualEntry')
    return saved ? JSON.parse(saved) : false
  })
  
  const [uploadMode, setUploadMode] = useState<'file' | 'csv' | 'manual'>('file')
  
  const [payrollData, setPayrollData] = useState(() => {
    const saved = localStorage.getItem('upload_payrollData')
    return saved ? JSON.parse(saved) : {
      company: '',
      employeeId: '',
      slipDate: '',
      paymentMethod: 'bank_transfer',
      items: getDefaultItems()
    }
  })

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(() => {
    const saved = localStorage.getItem('upload_selectedCompany')
    return saved ? JSON.parse(saved) : null
  })

  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState(() => {
    return localStorage.getItem('upload_fileName') || ''
  })

  const [csvData, setCsvData] = useState<any[]>([])
  const [isProcessingCsv, setIsProcessingCsv] = useState(false)

  // 保存狀態到 localStorage
  useEffect(() => {
    localStorage.setItem('upload_isManualEntry', JSON.stringify(isManualEntry))
  }, [isManualEntry])

  useEffect(() => {
    localStorage.setItem('upload_payrollData', JSON.stringify(payrollData))
  }, [payrollData])

  useEffect(() => {
    localStorage.setItem('upload_selectedCompany', JSON.stringify(selectedCompany))
  }, [selectedCompany])

  useEffect(() => {
    localStorage.setItem('upload_fileName', uploadedFileName)
  }, [uploadedFileName])

  // 下載CSV範本
  const downloadCsvTemplate = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/payroll/template/csv')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'payroll-template.csv'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert('下載範本失敗，請重試')
      }
    } catch (error) {
      console.error('Error downloading template:', error)
      alert('下載範本失敗，請重試')
    }
  }

  // 處理CSV檔案上傳
  const handleCsvUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'text/csv') {
      setIsProcessingCsv(true)
      setUploadedFile(file)
      setUploadedFileName(file.name)
      
      try {
        const formData = new FormData()
        formData.append('csvFile', file)
        
        const response = await fetch('http://localhost:5001/api/payroll/upload/csv', {
          method: 'POST',
          body: formData
        })
        
        if (response.ok) {
          const result = await response.json()
          setCsvData(result.data)
          alert(`成功處理 ${result.totalRecords} 筆薪資資料`)
          setUploadMode('csv')
        } else {
          const error = await response.json()
          alert(`處理失敗: ${error.error}`)
        }
      } catch (error) {
        console.error('CSV processing error:', error)
        alert('CSV檔案處理失敗，請重試')
      } finally {
        setIsProcessingCsv(false)
      }
    } else {
      alert('請選擇有效的CSV檔案')
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      console.log('File uploaded:', file)
      setUploadedFile(file)
      setUploadedFileName(file.name)
      setIsUploading(true)
      
      try {
        // 模擬檔案處理過程
        await processUploadedFile(file)
      } catch (error) {
        console.error('File processing error:', error)
        alert('檔案處理失敗，請重試')
      } finally {
        setIsUploading(false)
      }
    }
  }

  const processUploadedFile = async (file: File) => {
    // 模擬檔案解析過程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 根據檔案類型處理
    if (file.type === 'application/pdf') {
      // 模擬 PDF 解析結果
      const mockParsedData = {
        company: '測試科技公司',
        employeeId: 'EMP001',
        slipDate: '2025-03-31',
        items: [
          { item_type: 'income', item_name: '基本薪資', amount: 400000 },
          { item_type: 'income', item_name: '加班費', amount: 30000 },
          { item_type: 'income', item_name: '津貼', amount: 20000 },
          { item_type: 'deduction', item_name: '所得稅', amount: 45000 },
          { item_type: 'deduction', item_name: '健康保險', amount: 25000 },
          { item_type: 'deduction', item_name: '養老金', amount: 15000 }
        ]
      }
      
      // 更新表單數據
      setPayrollData(prev => ({
        ...prev,
        company: mockParsedData.company,
        employeeId: mockParsedData.employeeId,
        slipDate: mockParsedData.slipDate,
        items: mockParsedData.items
      }))
      
      // 自動切換到手動輸入模式以顯示解析結果
      setIsManualEntry(true)
      
      alert('檔案解析完成！請檢查並確認薪資單數據。')
    } else {
      // 圖片檔案處理
      alert('圖片檔案解析功能開發中，請使用手動輸入模式。')
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setPayrollData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCompanyChange = (company: Company) => {
    setSelectedCompany(company)
    setPayrollData(prev => ({
      ...prev,
      company: company.name,
      employeeId: company.employeeId
    }))
  }

  const handleItemChange = (index: number, field: string, value: string | number) => {
    setPayrollData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const addItem = (type: 'income' | 'deduction' = 'income') => {
    setPayrollData(prev => ({
      ...prev,
      items: [...prev.items, { item_type: type, item_name: '', amount: 0 }]
    }))
  }

  const handleItemSelect = (index: number, template: PayrollItemTemplate) => {
    const { currentLanguage } = useLanguage()
    setPayrollData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { 
          ...item, 
          item_name: typeof template.name === 'string' ? template.name : template.name[currentLanguage as keyof typeof template.name] || template.name.zh
        } : item
      )
    }))
  }

  const removeItem = (index: number) => {
    setPayrollData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    
    try {
      // 模擬 API 調用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 這裡應該調用實際的 API 來保存薪資單
      console.log('Payroll data to save:', payrollData)
      
      // 顯示成功消息
      alert('薪資單保存成功！')
      
      // 重置表單
      setPayrollData({
        company: '',
        employeeId: '',
        slipDate: '',
        paymentMethod: 'bank_transfer',
        items: getDefaultItems()
      })
      setSelectedCompany(null)
      setUploadedFile(null)
      setUploadedFileName('')
      setIsManualEntry(false)
      setCsvData([])
      setUploadMode('file')
      
      // 清除 localStorage
      localStorage.removeItem('upload_payrollData')
      localStorage.removeItem('upload_selectedCompany')
      localStorage.removeItem('upload_fileName')
      localStorage.removeItem('upload_isManualEntry')
      
    } catch (error) {
      console.error('Failed to save payroll:', error)
      alert('保存失敗，請重試')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 批量保存CSV數據
  const handleBulkSave = async () => {
    if (csvData.length === 0) {
      alert('沒有可保存的數據')
      return
    }

    setIsSubmitting(true)
    
    try {
      // 這裡應該調用實際的 API 來批量保存薪資單
      console.log('Bulk payroll data to save:', csvData)
      
      // 模擬API調用
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert(`成功保存 ${csvData.length} 筆薪資資料！`)
      
      // 重置狀態
      setCsvData([])
      setUploadedFile(null)
      setUploadedFileName('')
      setUploadMode('file')
      
    } catch (error) {
      console.error('Failed to save bulk payroll:', error)
      alert('批量保存失敗，請重試')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* 頁面標題 */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {t('upload.title')}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t('upload.subtitle')}
        </p>
      </div>

      {!isManualEntry && uploadMode === 'file' ? (
        /* 文件上傳區域 */
        <div className="bg-card border border-border rounded-lg p-8">
          {isUploading ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                正在處理檔案...
              </h3>
              <p className="text-muted-foreground mb-6">
                正在解析您的薪資單，請稍候
              </p>
            </div>
          ) : uploadedFileName ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                檔案已上傳
              </h3>
              <p className="text-muted-foreground mb-4">
                {uploadedFileName}
              </p>
              <button
                onClick={() => {
                  setUploadedFile(null)
                  setUploadedFileName('')
                  setIsManualEntry(false)
                  // 清除 localStorage
                  localStorage.removeItem('upload_fileName')
                  localStorage.removeItem('upload_payrollData')
                  localStorage.removeItem('upload_selectedCompany')
                  localStorage.removeItem('upload_isManualEntry')
                }}
                className="inline-flex items-center px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                重新上傳
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <UploadIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {t('upload.dragDropTitle')}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t('upload.dragDropSubtitle')}
              </p>
              
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4 mr-2" />
                {t('upload.selectFile')}
              </label>
            </div>
          )}

          <div className="mt-8 text-center">
            <span className="text-muted-foreground">{t('upload.or')}</span>
          </div>

          <div className="mt-4 flex justify-center gap-4">
            <button
              onClick={() => setUploadMode('csv')}
              className="inline-flex items-center px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              CSV 批量上傳
            </button>
            <button
              onClick={() => setIsManualEntry(true)}
              className="inline-flex items-center px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('upload.startManualEntry')}
            </button>
          </div>
        </div>
      ) : !isManualEntry && uploadMode === 'csv' ? (
        /* CSV上傳區域 */
        <div className="bg-card border border-border rounded-lg p-8">
          {isProcessingCsv ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                正在處理CSV檔案...
              </h3>
              <p className="text-muted-foreground mb-6">
                正在解析您的薪資資料，請稍候
              </p>
            </div>
          ) : csvData.length > 0 ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileSpreadsheet className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  CSV檔案處理完成
                </h3>
                <p className="text-muted-foreground mb-4">
                  共解析出 {csvData.length} 筆薪資資料
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleBulkSave}
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? '保存中...' : '批量保存'}
                  </button>
                  <button
                    onClick={() => {
                      setCsvData([])
                      setUploadedFile(null)
                      setUploadedFileName('')
                      setUploadMode('file')
                    }}
                    className="inline-flex items-center px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    重新上傳
                  </button>
                </div>
              </div>

              {/* CSV數據預覽 */}
              <div className="mt-6">
                <h4 className="text-lg font-medium text-foreground mb-4">數據預覽</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border border-border rounded-lg">
                    <thead>
                      <tr className="bg-muted">
                        <th className="px-3 py-2 text-left text-sm font-medium">選擇</th>
                        <th className="px-3 py-2 text-left text-sm font-medium">公司名稱</th>
                        <th className="px-3 py-2 text-left text-sm font-medium">員工編號</th>
                        <th className="px-3 py-2 text-left text-sm font-medium">員工姓名</th>
                        <th className="px-3 py-2 text-left text-sm font-medium">部門</th>
                        <th className="px-3 py-2 text-left text-sm font-medium">薪資日期</th>
                        <th className="px-3 py-2 text-left text-sm font-medium">基本薪資</th>
                        <th className="px-3 py-2 text-left text-sm font-medium">實發薪資</th>
                      </tr>
                    </thead>
                    <tbody>
                      {csvData.slice(0, 5).map((row, index) => (
                        <tr key={index} className="border-t border-border hover:bg-muted/50">
                          <td className="px-3 py-2 text-sm">
                            <button
                              onClick={() => {
                                // 將選中的CSV數據轉換為薪資項目格式
                                const items = []
                                
                                // 添加收入項目
                                if (row.baseSalary > 0) {
                                  items.push({
                                    item_type: 'income',
                                    item_name: '基本薪資',
                                    amount: row.baseSalary
                                  })
                                }
                                
                                if (row.allowance > 0) {
                                  items.push({
                                    item_type: 'income',
                                    item_name: '津貼',
                                    amount: row.allowance
                                  })
                                }
                                
                                // 添加扣除項目
                                if (row.incomeTax > 0) {
                                  items.push({
                                    item_type: 'deduction',
                                    item_name: '所得稅',
                                    amount: row.incomeTax
                                  })
                                }
                                
                                if (row.insurance > 0) {
                                  items.push({
                                    item_type: 'deduction',
                                    item_name: '保險費',
                                    amount: row.insurance
                                  })
                                }
                                
                                if (row.deductions > 0) {
                                  items.push({
                                    item_type: 'deduction',
                                    item_name: '其他扣除',
                                    amount: row.deductions
                                  })
                                }
                                
                                // 更新表單數據
                                setPayrollData({
                                  company: row.companyName || '',
                                  employeeId: row.employeeNo || '',
                                  slipDate: row.slipDate || '',
                                  paymentMethod: 'bank_transfer',
                                  items: items.length > 0 ? items : getDefaultItems()
                                })
                                
                                // 如果有公司名稱，嘗試匹配公司
                                if (row.companyName) {
                                  const matchedCompany = companies.find(c => c.name === row.companyName)
                                  if (matchedCompany) {
                                    setSelectedCompany(matchedCompany)
                                  }
                                }
                                
                                // 切換到手動編輯模式
                                setIsManualEntry(true)
                              }}
                              className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs hover:bg-primary/90 transition-colors"
                            >
                              編輯
                            </button>
                          </td>
                          <td className="px-3 py-2 text-sm">{row.companyName}</td>
                          <td className="px-3 py-2 text-sm">{row.employeeNo}</td>
                          <td className="px-3 py-2 text-sm">{row.name}</td>
                          <td className="px-3 py-2 text-sm">{row.division}</td>
                          <td className="px-3 py-2 text-sm">{row.slipDate}</td>
                          <td className="px-3 py-2 text-sm">{row.baseSalary?.toLocaleString()}</td>
                          <td className="px-3 py-2 text-sm">{row.netPay?.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {csvData.length > 5 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      顯示前5筆資料，共 {csvData.length} 筆
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <FileSpreadsheet className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                CSV 批量上傳
              </h3>
              <p className="text-muted-foreground mb-6">
                上傳CSV檔案來批量導入薪資資料
              </p>
              
              <div className="flex justify-center gap-4 mb-6">
                <button
                  onClick={downloadCsvTemplate}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  下載CSV範本
                </button>
              </div>
              
              <input
                type="file"
                accept=".csv"
                onChange={handleCsvUpload}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                選擇CSV檔案
              </label>
            </div>
          )}

          <div className="mt-8 text-center">
            <span className="text-muted-foreground">{t('upload.or')}</span>
          </div>

          <div className="mt-4 flex justify-center gap-4">
            <button
              onClick={() => setUploadMode('file')}
              className="inline-flex items-center px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <FileText className="w-4 h-4 mr-2" />
              檔案上傳
            </button>
            <button
              onClick={() => setIsManualEntry(true)}
              className="inline-flex items-center px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('upload.startManualEntry')}
            </button>
          </div>
        </div>
      ) : (
        /* 手動輸入表單 */
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {uploadedFileName ? '薪資單數據確認' : t('upload.manualEntry')}
              </h3>
              {uploadedFileName && (
                <p className="text-sm text-muted-foreground mt-1">
                  已從檔案 "{uploadedFileName}" 解析出以下數據
                </p>
              )}
            </div>
            <button
              onClick={() => {
                setIsManualEntry(false)
                setUploadedFile(null)
                setUploadedFileName('')
                setCsvData([])
                setUploadMode('file')
                // 清除 localStorage
                localStorage.removeItem('upload_fileName')
                localStorage.removeItem('upload_payrollData')
                localStorage.removeItem('upload_selectedCompany')
                localStorage.removeItem('upload_isManualEntry')
              }}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本信息 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('payroll.company')}
                </label>
                <CompanySelector
                  selectedCompanyId={selectedCompany?.id}
                  onCompanyChange={handleCompanyChange}
                  placeholder={t('payroll.selectCompany')}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('payroll.employeeId')}
                </label>
                <input
                  type="text"
                  value={payrollData.employeeId}
                  onChange={(e) => handleInputChange('employeeId', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  readOnly={!!selectedCompany}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('payroll.slipDate')}
                </label>
                <input
                  type="date"
                  value={payrollData.slipDate}
                  onChange={(e) => handleInputChange('slipDate', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('payroll.paymentMethod')}
                </label>
                <select
                  value={payrollData.paymentMethod}
                  onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="bank_transfer">{t('payroll.bankTransfer')}</option>
                  <option value="cash">{t('payroll.cash')}</option>
                </select>
              </div>
            </div>

            {/* 薪資項目 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-foreground">
                  薪資項目
                </h4>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => addItem('income')}
                    className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    {t('payroll.addIncome')}
                  </button>
                  <button
                    type="button"
                    onClick={() => addItem('deduction')}
                    className="inline-flex items-center px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    {t('payroll.addDeduction')}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {payrollData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-border rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        {t('payroll.type')}
                      </label>
                      <select
                        value={item.item_type}
                        onChange={(e) => handleItemChange(index, 'item_type', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="income">{t('payroll.income')}</option>
                        <option value="deduction">{t('payroll.deduction')}</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-foreground mb-1">
                        {t('payroll.itemName')}
                      </label>
                      <PayrollItemSelector
                        type={item.item_type}
                        onSelect={(template) => handleItemSelect(index, template)}
                        placeholder={item.item_name || "選擇項目"}
                      />
                    </div>

                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-foreground mb-1">
                          {t('payroll.amount')}
                        </label>
                        <input
                          type="number"
                          value={item.amount}
                          onChange={(e) => handleItemChange(index, 'amount', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>
                      
                      {payrollData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 提交按鈕 */}
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => {
                  // 清除所有數據
                  setPayrollData({
                    company: '',
                    employeeId: '',
                    slipDate: '',
                    paymentMethod: 'bank_transfer',
                    items: getDefaultItems()
                  })
                  setSelectedCompany(null)
                  setUploadedFile(null)
                  setUploadedFileName('')
                  setIsManualEntry(false)
                  setCsvData([])
                  setUploadMode('file')
                  
                  // 清除 localStorage
                  localStorage.removeItem('upload_payrollData')
                  localStorage.removeItem('upload_selectedCompany')
                  localStorage.removeItem('upload_fileName')
                  localStorage.removeItem('upload_isManualEntry')
                }}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
              >
                清除所有數據
              </button>
              
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsManualEntry(false)
                    setUploadMode('file')
                  }}
                  className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? '保存中...' : t('common.save')}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default Upload
