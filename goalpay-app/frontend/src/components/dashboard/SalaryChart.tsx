import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'

interface ChartData {
  month: string
  income: number
  deductions: number
  net: number
}

interface SalaryChartProps {
  data: ChartData[]
}

const SalaryChart: React.FC<SalaryChartProps> = ({ data }) => {
  const { t } = useTranslation()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // 處理和過濾數據
  const processChartData = () => {
    if (!data || data.length === 0) return []
    
    // 按月份排序
    const sortedData = [...data].sort((a, b) => {
      const dateA = new Date(a.month)
      const dateB = new Date(b.month)
      return dateA.getTime() - dateB.getTime()
    })

    // 格式化月份顯示
    return sortedData.map(item => ({
      ...item,
      month: formatMonthDisplay(item.month)
    }))
  }

  const formatMonthDisplay = (monthString: string) => {
    try {
      const date = new Date(monthString)
      return date.toLocaleDateString('ja-JP', { 
        year: 'numeric', 
        month: 'short' 
      })
    } catch {
      return monthString
    }
  }

  const chartData = processChartData()

  if (chartData.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
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
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          {t('dashboard.salaryTrend')}
        </h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>{t('dashboard.totalIncome')}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>{t('dashboard.totalDeductions')}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>{t('dashboard.netIncome')}</span>
          </div>
        </div>
      </div>

      {/* 使用 LineChart 顯示趨勢，更適合時間序列數據 */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="month" 
            stroke="#9CA3AF"
            fontSize={12}
          />
          <YAxis 
            stroke="#9CA3AF"
            fontSize={12}
            tickFormatter={formatCurrency}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="income" 
            stroke="#3B82F6" 
            strokeWidth={2}
            name={t('dashboard.totalIncome')}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="deductions" 
            stroke="#EF4444" 
            strokeWidth={2}
            name={t('dashboard.totalDeductions')}
            dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#EF4444', strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="net" 
            stroke="#10B981" 
            strokeWidth={2}
            name={t('dashboard.netIncome')}
            dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SalaryChart
