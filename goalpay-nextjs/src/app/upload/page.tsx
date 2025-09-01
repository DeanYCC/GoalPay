'use client';

import React, { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import { 
  Upload, 
  Building, 
  Calendar, 
  DollarSign, 
  User, 
  Save, 
  X, 
  FileText, 
  AlertCircle,
  ArrowLeft,
  Camera
} from 'lucide-react';
import Layout from '@/components/Layout';

interface Company {
  id: string;
  name: string;
  industry?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  position?: string;
  isActive: boolean;
}

interface PayrollForm {
  companyId: string;
  companyName: string;
  division: string;
  employeeNo: string;
  name: string;
  daysWorked: number;
  absentDays: number;
  paidLeave: number;
  unpaidLeave: number;
  baseSalary: number;
  allowance: number;
  grossSalary: number;
  deductions: number;
  insurance: number;
  incomeTax: number;
  netPay: number;
  bankTransfer: number;
  cash: number;
  payrollDate: string;
  paymentMonth: string;
  paymentYear: string;
}

interface UploadedFile {
  file: File;
  file_url: string;
}

interface ExtractedData {
  pay_period: string;
  currency: string;
  earnings: Record<string, any>;
  deductions: Record<string, any>;
  payment: Record<string, any>;
  work_record: Record<string, any>;
  file_url?: string;
}

export default function UploadPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [form, setForm] = useState<PayrollForm>({
    companyId: '',
    companyName: '',
    division: '',
    employeeNo: '',
    name: user?.name || '',
    daysWorked: 0,
    absentDays: 0,
    paidLeave: 0,
    unpaidLeave: 0,
    baseSalary: 0,
    allowance: 0,
    grossSalary: 0,
    deductions: 0,
    insurance: 0,
    incomeTax: 0,
    netPay: 0,
    bankTransfer: 0,
    cash: 0,
    payrollDate: new Date().toISOString().split('T')[0],
    paymentMonth: new Date().toISOString().slice(0, 7),
    paymentYear: new Date().getFullYear().toString(),
  });

  React.useEffect(() => {
    fetchCompanies();
  }, []);

  React.useEffect(() => {
    if (selectedCompany) {
      setForm(prev => ({
        ...prev,
        companyId: selectedCompany.id,
        companyName: selectedCompany.name,
        division: selectedCompany.position || '',
      }));
    }
  }, [selectedCompany]);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies');
      if (response.ok) {
        const data = await response.json();
        setCompanies(data.companies);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setProcessingStep(t('upload.uploadingFile') || 'Uploading file...');

    try {
      // Upload file first
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('File upload failed');
      }

      const { file_url } = await uploadResponse.json();
      setUploadedFile({ file, file_url });
      
      setProcessingStep(t('upload.analyzingData') || 'Analyzing data...');
      
      // Extract data from the uploaded file
      const extractResponse = await fetch('/api/integration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file_url,
          json_schema: 'payroll_slip' // You can define your schema here
        }),
      });

      if (!extractResponse.ok) {
        throw new Error('Data extraction failed');
      }

      const result = await extractResponse.json();
      
      if (result.status === "success" && result.output) {
        setExtractedData({
          ...result.output,
          file_url,
          pay_period: result.output.pay_period || new Date().toISOString().slice(0, 7) + '-01'
        });
        
        // Auto-fill form with extracted data if possible
        if (result.output.earnings?.baseSalary) {
          setForm(prev => ({
            ...prev,
            baseSalary: result.output.earnings.baseSalary,
            allowance: result.output.earnings.allowance || 0,
            grossSalary: (result.output.earnings.baseSalary || 0) + (result.output.earnings.allowance || 0),
            deductions: result.output.deductions?.total || 0,
            insurance: result.output.deductions?.insurance || 0,
            incomeTax: result.output.deductions?.incomeTax || 0,
            netPay: result.output.payment?.netPay || 0,
            bankTransfer: result.output.payment?.bankTransfer || 0,
            cash: result.output.payment?.cash || 0,
          }));
        }
      } else {
        throw new Error("Failed to extract payroll data from the file");
      }
    } catch (error) {
      setError("Failed to process the payroll slip. Please try uploading again or enter data manually.");
      console.error("Error processing file:", error);
    }
    
    setIsProcessing(false);
    setProcessingStep('');
  };

  const handleManualEntry = () => {
    setExtractedData({
      pay_period: new Date().toISOString().slice(0, 7) + '-01',
      currency: 'JPY',
      earnings: {},
      deductions: {},
      payment: {},
      work_record: {}
    });
  };

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
  };

  const handleInputChange = (field: keyof PayrollForm, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const calculateTotals = () => {
    const gross = form.baseSalary + form.allowance;
    const totalDeductions = form.insurance + form.incomeTax + form.deductions;
    const net = gross - totalDeductions;
    const totalPayment = form.bankTransfer + form.cash;

    setForm(prev => ({
      ...prev,
      grossSalary: gross,
      netPay: net,
      deductions: totalDeductions,
    }));

    return { gross, net, totalDeductions, totalPayment };
  };

  const handleSavePayslip = async (payslipData: PayrollForm) => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/payroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payslipData),
      });

      if (response.ok) {
        alert('Payroll slip created successfully!');
        router.push('/dashboard');
      } else {
        throw new Error('Failed to save payroll slip');
      }
    } catch (error) {
      setError("Failed to save payroll slip. Please try again.");
      setIsProcessing(false);
    }
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setExtractedData(null);
    setError(null);
    setProcessingStep('');
    setForm({
      companyId: '',
      companyName: '',
      division: '',
      employeeNo: '',
      name: user?.name || '',
      daysWorked: 0,
      absentDays: 0,
      paidLeave: 0,
      unpaidLeave: 0,
      baseSalary: 0,
      allowance: 0,
      grossSalary: 0,
      deductions: 0,
      insurance: 0,
      incomeTax: 0,
      netPay: 0,
      bankTransfer: 0,
      cash: 0,
      payrollDate: new Date().toISOString().split('T')[0],
      paymentMonth: new Date().toISOString().slice(0, 7),
      paymentYear: new Date().getFullYear().toString(),
    });
    setSelectedCompany(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('payroll.uploadSlip')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {t('upload.pageSubtitle') || 'Upload your payroll slip or enter data manually'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="mb-6 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-blue-800 dark:text-blue-200 font-medium">
                {processingStep}
              </span>
            </div>
          </div>
        )}

        {!extractedData && !isProcessing && (
          <div className="space-y-6">
            {/* File Upload Zone */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-8 text-center">
              <div
                className="space-y-4"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {t('upload.dragDropTitle') || 'Drag and drop your payroll slip'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {t('upload.dragDropSubtitle') || 'or click to browse files'}
                  </p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('upload.selectFile') || 'Select File'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {t('upload.or') || 'OR'}
              </span>
              <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
            </div>

            {/* Manual Entry Option */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {t('upload.manualEntry') || 'Manual Entry'}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {t('upload.manualEntryDescription') || 'Enter payroll data manually if you prefer'}
              </p>
              <button
                onClick={handleManualEntry}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {t('upload.startManualEntry') || 'Start Manual Entry'}
              </button>
            </div>
          </div>
        )}

        {/* Company Selection */}
        {extractedData && !selectedCompany && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {t('payroll.selectCompany') || 'Select Company'}
            </h3>
            
            {companies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {companies.map((company) => (
                  <div
                    key={company.id}
                    onClick={() => handleCompanySelect(company)}
                    className="p-4 border-2 rounded-lg cursor-pointer transition-colors hover:border-blue-300 dark:hover:border-blue-600"
                  >
                    <div className="flex items-center space-x-3">
                      <Building className="w-5 h-5 text-gray-500" />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {company.name}
                        </h4>
                        {company.position && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {company.position}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Building className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                  {t('payroll.noCompanies') || 'No companies found'}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {t('payroll.addCompanyFirst') || 'Please add a company first'}
                </p>
                <button
                  onClick={() => router.push('/account')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('payroll.goToAccount') || 'Go to Account'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Payroll Form */}
        {extractedData && selectedCompany && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {t('payroll.payrollDetails') || 'Payroll Details'}
              </h3>
              <button
                onClick={resetUpload}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSavePayslip(form); }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                    {t('payroll.basicInfo') || 'Basic Information'}
                  </h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('payroll.employeeName') || 'Employee Name'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('payroll.employeeNo') || 'Employee No.'}
                    </label>
                    <input
                      type="text"
                      value={form.employeeNo}
                      onChange={(e) => handleInputChange('employeeNo', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('payroll.division') || 'Division'}
                    </label>
                    <input
                      type="text"
                      value={form.division}
                      onChange={(e) => handleInputChange('division', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('payroll.slipDate') || 'Slip Date'} *
                    </label>
                    <input
                      type="date"
                      required
                      value={form.payrollDate}
                      onChange={(e) => handleInputChange('payrollDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Attendance */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                    {t('payroll.attendance') || 'Attendance'}
                  </h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('payroll.daysWorked') || 'Days Worked'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.daysWorked}
                      onChange={(e) => handleInputChange('daysWorked', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('payroll.absentDays') || 'Absent Days'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.absentDays}
                      onChange={(e) => handleInputChange('absentDays', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('payroll.paidLeave') || 'Paid Leave'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.paidLeave}
                      onChange={(e) => handleInputChange('paidLeave', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('payroll.unpaidLeave') || 'Unpaid Leave'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.unpaidLeave}
                      onChange={(e) => handleInputChange('unpaidLeave', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Salary Details */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  {t('payroll.salaryDetails') || 'Salary Details'}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('payroll.baseSalary') || 'Base Salary'} *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={form.baseSalary}
                        onChange={(e) => handleInputChange('baseSalary', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('payroll.allowance') || 'Allowance'}
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.allowance}
                        onChange={(e) => handleInputChange('allowance', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('payroll.grossSalary') || 'Gross Salary'}
                      </label>
                      <input
                        type="number"
                        readOnly
                        value={form.grossSalary}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('payroll.insurance') || 'Insurance'}
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.insurance}
                        onChange={(e) => handleInputChange('insurance', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('payroll.incomeTax') || 'Income Tax'}
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.incomeTax}
                        onChange={(e) => handleInputChange('incomeTax', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('payroll.deductions') || 'Other Deductions'}
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.deductions}
                        onChange={(e) => handleInputChange('deductions', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('payroll.netPay') || 'Net Pay'}
                      </label>
                      <input
                        type="number"
                        readOnly
                        value={form.netPay}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('payroll.bankTransfer') || 'Bank Transfer'}
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.bankTransfer}
                        onChange={(e) => handleInputChange('bankTransfer', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('payroll.cash') || 'Cash'}
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.cash}
                        onChange={(e) => handleInputChange('cash', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={resetUpload}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  {t('common.cancel') || 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isProcessing ? (t('common.saving') || 'Saving...') : (t('common.save') || 'Save')}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
}
