import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PayrollItemTemplate, DEFAULT_PAYROLL_ITEMS, getItemName, getItemCategory } from '../../types/payrollItem';
import { Plus, Edit, Trash2, Info, Save, X } from 'lucide-react';

interface PayrollItemManagerProps {
  onSave?: (items: PayrollItemTemplate[]) => void;
}

const PayrollItemManager: React.FC<PayrollItemManagerProps> = ({ onSave }) => {
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState<PayrollItemTemplate[]>(DEFAULT_PAYROLL_ITEMS);
  const [editingItem, setEditingItem] = useState<PayrollItemTemplate | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDescription, setShowDescription] = useState<string | null>(null);

  const handleAddCustom = () => {
    const newItem: PayrollItemTemplate = {
      id: `custom_${Date.now()}`,
      name: {
        zh: '',
        en: '',
        jp: ''
      },
      type: 'income',
      category: {
        zh: t('payrollItem.customCategory'),
        en: 'Custom Items',
        jp: 'カスタム項目'
      },
      isDefault: false,
      isCustom: true,
      description: {
        zh: '',
        en: '',
        jp: ''
      }
    };
    setEditingItem(newItem);
    setShowForm(true);
  };

  const handleEdit = (item: PayrollItemTemplate) => {
    setEditingItem({ ...item });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('payrollItem.confirmDelete'))) {
      setItems(items?.filter(item => item.id !== id) || []);
    }
  };

  const handleSave = () => {
    if (editingItem && (typeof editingItem.name === 'string' ? editingItem.name.trim() : editingItem.name.zh.trim())) {
      if (editingItem.isCustom) {
        // 新增自訂項目
        setItems([...items, editingItem]);
      } else {
        // 更新現有項目
        setItems(items.map(item => 
          item.id === editingItem.id ? editingItem : item
        ));
      }
      setShowForm(false);
      setEditingItem(null);
      onSave?.(items);
    }
  };

  const getDescription = (item: PayrollItemTemplate) => {
    return item.description[i18n.language as keyof typeof item.description] || item.description.zh;
  };

  const groupedItems = items.reduce((groups, item) => {
    if (!groups[item.category]) {
      groups[item.category] = [];
    }
    groups[item.category].push(item);
    return groups;
  }, {} as Record<string, PayrollItemTemplate[]>);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={handleAddCustom}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          {t('payrollItem.addCustomItem')}
        </button>
      </div>

      {/* 項目列表 */}
      <div className="space-y-6">
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <div key={category} className="border border-border rounded-lg p-4">
            <h4 className="text-md font-medium mb-3">{getItemCategory(categoryItems[0], i18n.language)}</h4>
            <div className="grid gap-3">
              {categoryItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.type === 'income' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {item.type === 'income' ? t('payroll.income') : t('payroll.deduction')}
                    </div>
                    <span className="font-medium">{getItemName(item, i18n.language)}</span>
                    {item.isDefault && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                        {t('payrollItem.default')}
                      </span>
                    )}
                    {item.isCustom && (
                      <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full">
                        {t('payrollItem.custom')}
                      </span>
                    )}
                    <button
                      onClick={() => setShowDescription(showDescription === item.id ? null : item.id)}
                      className="p-1 text-muted-foreground hover:text-foreground"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-muted-foreground hover:text-foreground"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {item.isCustom && (
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  {/* 項目說明 */}
                  {showDescription === item.id && (
                    <div className="col-span-full mt-2 p-3 bg-background border border-border rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        {getDescription(item)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 編輯表單 */}
      {showForm && editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingItem.isCustom ? t('payrollItem.addCustomItem') : t('payrollItem.editItem')}
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="itemName" className="block text-sm font-medium mb-1">{t('payroll.itemName')} *</label>
                  <input
                    id="itemName"
                    name="itemName"
                    type="text"
                    value={typeof editingItem.name === 'string' ? editingItem.name : editingItem.name.zh}
                    onChange={(e) => setEditingItem({
                      ...editingItem, 
                      name: typeof editingItem.name === 'string' 
                        ? e.target.value 
                        : { ...editingItem.name, zh: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="itemType" className="block text-sm font-medium mb-1">{t('payroll.type')}</label>
                  <select
                    id="itemType"
                    name="itemType"
                    value={editingItem.type}
                    onChange={(e) => setEditingItem({...editingItem, type: e.target.value as 'income' | 'deduction'})}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  >
                    <option value="income">{t('payroll.income')}</option>
                    <option value="deduction">{t('payroll.deduction')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="itemCategory" className="block text-sm font-medium mb-1">{t('payrollItem.category')}</label>
                <input
                  id="itemCategory"
                  name="itemCategory"
                  type="text"
                  value={typeof editingItem.category === 'string' ? editingItem.category : editingItem.category.zh}
                  onChange={(e) => setEditingItem({
                    ...editingItem, 
                    category: typeof editingItem.category === 'string' 
                      ? e.target.value 
                      : { ...editingItem.category, zh: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                />
              </div>

              <div>
                <label htmlFor="chineseDescription" className="block text-sm font-medium mb-1">{t('payrollItem.chineseDescription')}</label>
                <textarea
                  id="chineseDescription"
                  name="chineseDescription"
                  value={editingItem.description.zh}
                  onChange={(e) => setEditingItem({
                    ...editingItem, 
                    description: {...editingItem.description, zh: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  rows={2}
                />
              </div>

              <div>
                <label htmlFor="englishDescription" className="block text-sm font-medium mb-1">{t('payrollItem.englishDescription')}</label>
                <textarea
                  id="englishDescription"
                  name="englishDescription"
                  value={editingItem.description.en}
                  onChange={(e) => setEditingItem({
                    ...editingItem, 
                    description: {...editingItem.description, en: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  rows={2}
                />
              </div>

              <div>
                <label htmlFor="japaneseDescription" className="block text-sm font-medium mb-1">{t('payrollItem.japaneseDescription')}</label>
                <textarea
                  id="japaneseDescription"
                  name="japaneseDescription"
                  value={editingItem.description.jp}
                  onChange={(e) => setEditingItem({
                    ...editingItem, 
                    description: {...editingItem.description, jp: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  rows={2}
                />
              </div>

              {!editingItem.isCustom && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={editingItem.isDefault}
                    onChange={(e) => setEditingItem({...editingItem, isDefault: e.target.checked})}
                    className="rounded"
                  />
                  <label htmlFor="isDefault" className="text-sm">{t('payrollItem.setAsDefault')}</label>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                }}
                className="px-4 py-2 border border-border rounded-lg hover:bg-muted"
              >
                {t('payrollItem.cancel')}
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                {t('payrollItem.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollItemManager;
