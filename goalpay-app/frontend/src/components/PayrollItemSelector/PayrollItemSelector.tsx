import React, { useState } from 'react';
import { ChevronDown, Plus, Info } from 'lucide-react';
import { PayrollItemTemplate, getItemTemplates, getItemName, getItemCategory } from '../../types/payrollItem';
import { useTranslation } from 'react-i18next';

interface PayrollItemSelectorProps {
  type: 'income' | 'deduction';
  onSelect: (item: PayrollItemTemplate) => void;
  placeholder?: string;
  disabled?: boolean;
}

const PayrollItemSelector: React.FC<PayrollItemSelectorProps> = ({
  type,
  onSelect,
  placeholder = "選擇項目",
  disabled = false
}) => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const templates = getItemTemplates(type);
  const filteredTemplates = templates.filter(item => 
    getItemName(item, i18n.language).toLowerCase().includes(searchTerm.toLowerCase()) ||
    getItemCategory(item, i18n.language).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (item: PayrollItemTemplate) => {
    onSelect(item);
    setIsOpen(false);
    setSearchTerm('');
  };

  const getDescription = (item: PayrollItemTemplate) => {
    return item.description[i18n.language as keyof typeof item.description] || item.description.zh;
  };

  const groupedTemplates = filteredTemplates.reduce((groups, item) => {
    const category = getItemCategory(item, i18n.language);
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {} as Record<string, PayrollItemTemplate[]>);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary'
        }`}
      >
        <span className="text-muted-foreground">{placeholder || t('payrollItem.selectItem')}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {/* 搜尋框 */}
          <div className="p-2 border-b border-border">
            <input
              id="searchItems"
              name="searchItems"
              type="text"
              placeholder={t('payrollItem.searchItems')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* 項目列表 */}
          <div className="max-h-48 overflow-y-auto">
            {Object.entries(groupedTemplates).map(([category, items]) => (
              <div key={category}>
                <div className="px-3 py-1 text-xs font-medium text-muted-foreground bg-muted">
                  {category}
                </div>
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelect(item)}
                      className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-muted"
                    >
                      <span className="font-medium">{getItemName(item, i18n.language)}</span>
                      <div className="flex items-center gap-2">
                        {item.isDefault && (
                          <span className="text-xs text-primary bg-primary/10 px-1 rounded">
                            {t('payrollItem.default')}
                          </span>
                        )}
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </button>
                    
                    {/* 項目說明提示 */}
                    {hoveredItem === item.id && (
                      <div className="absolute left-full top-0 ml-2 p-3 bg-gray-900 text-white rounded-lg shadow-lg z-50 max-w-xs">
                        <p className="text-sm">{getDescription(item)}</p>
                        <div className="absolute left-0 top-3 -ml-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-r-gray-900"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* 自訂項目按鈕 */}
          <div className="p-2 border-t border-border">
            <button
              type="button"
              onClick={() => {
                const customItem: PayrollItemTemplate = {
                  id: `custom_${Date.now()}`,
                  name: searchTerm || t('payrollItem.customCategory'),
                  type,
                  category: t('payrollItem.customCategory'),
                  isDefault: false
                };
                handleSelect(customItem);
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-primary hover:bg-primary/10 rounded"
            >
              <Plus className="w-4 h-4" />
              {t('payrollItem.addCustomItem')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollItemSelector;
