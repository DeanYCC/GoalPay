import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()

  const actions = [
    {
      title: t('dashboard.uploadPayslip'),
      description: t('dashboard.uploadPayslipData'),
      icon: Upload,
      color: 'bg-blue-500',
      onClick: () => navigate('/upload')
    },
    {
      title: t('dashboard.viewReports'),
      description: t('dashboard.viewDetailedReports'),
      icon: FileText,
      color: 'bg-green-500',
      onClick: () => navigate('/reports')
    },
    {
      title: t('dashboard.exportData'),
      description: t('dashboard.exportPayrollData'),
      icon: Download,
      color: 'bg-purple-500',
      onClick: () => {
        // TODO: 實現匯出功能
        console.log('Export data')
      }
    },
    {
      title: t('dashboard.salaryTerms'),
      description: t('dashboard.salaryTermsGuide'),
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
