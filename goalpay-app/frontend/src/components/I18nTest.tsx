import React from 'react';
import { useTranslation } from 'react-i18next';

const I18nTest: React.FC = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
      <h3 className="font-bold">i18n 測試</h3>
      <p>當前語言: {i18n.language}</p>
      <p>測試文字: {t('dashboard.title')}</p>
      <p>載入中: {t('common.loading')}</p>
      <p>錯誤: {t('common.error')}</p>
    </div>
  );
};

export default I18nTest;
