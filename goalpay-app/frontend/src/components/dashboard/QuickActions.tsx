import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'
import {
  Upload,
  FileText,
  Download, 
  BookOpen,
  Plus,
  BarChart3,
  Settings
} from 'lucide-react'

interface QuickActionsProps {
  onOpenSalaryTerms?: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onOpenSalaryTerms }) => {
  const navigate = useNavigate()
  const { t } = useLanguage()

  const actions = [
    {
      title: t('dashboard.uploadPayslip'),
      description: '新增薪資單數據',
      icon: Upload,
      color: 'bg-blue-500',
      onClick: () => navigate('/upload')
    },
    {
      title: t('dashboard.viewReports'),
      description: '查看詳細報告',
      icon: FileText,
      color: 'bg-green-500',
      onClick: () => navigate('/reports')
    },
    {
      title: t('dashboard.exportData'),
      description: '匯出薪資數據',
      icon: Download,
      color: 'bg-purple-500',
      onClick: () => {
        // TODO: 實現匯出功能
        console.log('Export data')
      }
    },
    {
      title: t('dashboard.salaryTerms'),
      description: '了解薪資術語',
      icon: BookOpen,
      color: 'bg-orange-500',
      onClick: () => {
        if (onOpenSalaryTerms) {
          onOpenSalaryTerms();
        } else {
          console.log('Salary terms');
        }
      }
    }
  ]

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        {t('dashboard.quickActions')}
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="flex flex-col items-center p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors text-center"
          >
            <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
              <action.icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-foreground mb-1">
              {action.title}
            </span>
            <span className="text-xs text-muted-foreground">
              {action.description}
            </span>
          </button>
        ))}
      </div>


    </div>
  )
}

export default QuickActions
