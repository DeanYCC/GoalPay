import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FileText, Calendar, Building } from 'lucide-react'
import { format } from 'date-fns'

interface PayrollItem {
  id: number
  item_type: 'income' | 'deduction'
  item_name: string
  amount: number
}

interface Payroll {
  id: number
  company: string
  employee_id?: string
  slip_date: string
  payment_method: string
  items: PayrollItem[]
}

interface RecentPayrollsProps {
  payrolls: Payroll[]
  isLoading?: boolean
}

const RecentPayrolls: React.FC<RecentPayrollsProps> = ({ payrolls, isLoading }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const calculateNetIncome = (items: PayrollItem[]) => {
    const income = items
      .filter(item => item.item_type === 'income')
      .reduce((sum, item) => sum + item.amount, 0)
    
    const deductions = items
      .filter(item => item.item_type === 'deduction')
      .reduce((sum, item) => sum + item.amount, 0)
    
    return income - deductions
  }

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {t('dashboard.recentPayrolls')}
        </h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (payrolls.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {t('dashboard.recentPayrolls')}
        </h3>
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-2">
            {t('dashboard.noData')}
          </p>
          <p className="text-sm text-muted-foreground">
            {t('dashboard.noDataDescription')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          {t('dashboard.recentPayrolls')}
        </h3>
        <button className="text-sm text-primary hover:text-primary/80 font-medium">
          {t('dashboard.viewAll')}
        </button>
      </div>

      <div className="space-y-4">
        {payrolls.slice(0, 5).map((payroll) => (
          <div 
            key={payroll.id} 
            className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => navigate(`/payroll/${payroll.id}`)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium text-foreground">
                  {payroll.company}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {format(new Date(payroll.slipDate || payroll.slip_date), 'MMM dd, yyyy')}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{format(new Date(payroll.slipDate || payroll.slip_date), 'yyyy/MM/dd')}</span>
              </div>
              {(payroll.employeeId || payroll.employee_id) && (
                <span>ID: {payroll.employeeId || payroll.employee_id}</span>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t('dashboard.netIncome')}
                </span>
                <span className="font-semibold text-foreground">
                  {formatCurrency(calculateNetIncome(payroll.items))}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentPayrolls
