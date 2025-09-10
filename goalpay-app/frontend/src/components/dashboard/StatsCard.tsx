import React from 'react'
import { TrendingUp, TrendingDown, DollarSign, Calendar, BarChart3 } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: number
  currency: string
  trend: number
  icon: string
  color: 'green' | 'red' | 'blue' | 'purple'
  isCurrency?: boolean; // Added isCurrency prop
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  currency,
  trend,
  icon,
  color,
  isCurrency = true
}) => {
  const formatValue = (amount: number) => {
    if (isCurrency) {
      // 確保有有效的貨幣代碼
      const validCurrency = currency && currency.trim() !== '' ? currency : 'JPY';
      
      try {
        return new Intl.NumberFormat('ja-JP', {
          style: 'currency',
          currency: validCurrency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(amount)
      } catch (error) {
        // 如果 Intl.NumberFormat 失敗，使用簡單格式化
        const formattedNumber = amount.toLocaleString('ja-JP')
        return `${validCurrency} ${formattedNumber}`
      }
    } else {
      // 非貨幣值，直接格式化數字
      try {
        return new Intl.NumberFormat('ja-JP').format(amount)
      } catch (error) {
        return amount.toLocaleString('ja-JP')
      }
    }
  }

  const getIcon = () => {
    switch (icon) {
      case 'trending-up':
        return <TrendingUp className="w-5 h-5" />
      case 'trending-down':
        return <TrendingDown className="w-5 h-5" />
      case 'dollar-sign':
        return <DollarSign className="w-5 h-5" />
      case 'calendar':
        return <Calendar className="w-5 h-5" />
      default:
        return <BarChart3 className="w-5 h-5" />
    }
  }

  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return 'bg-green-500/10 text-green-600 border-green-500/20'
      case 'red':
        return 'bg-red-500/10 text-red-600 border-red-500/20'
      case 'blue':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
      case 'purple':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20'
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {formatValue(value)}
          </p>
        </div>
        <div className={`p-3 rounded-lg border ${getColorClasses()}`}>
          {getIcon()}
        </div>
      </div>
      
      <div className="flex items-center mt-4">
        {trend >= 0 ? (
          <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
        ) : (
          <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
        )}
        <span className={`text-sm font-medium ${
          trend >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {Math.abs(trend).toFixed(1)}%
        </span>
        <span className="text-sm text-muted-foreground ml-1">
          與上月相比
        </span>
      </div>
    </div>
  )
}

export default StatsCard
