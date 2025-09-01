'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Info, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SalaryTerm {
  key: string;
  label: string;
  description: string;
}

interface SalaryTermsGuideProps {
  className?: string;
}

export default function SalaryTermsGuide({ className = '' }: SalaryTermsGuideProps) {
  const { language, t } = useLanguage();
  const [terms, setTerms] = useState<SalaryTerm[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<SalaryTerm | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTerms = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/salary-terms?lang=${language}`);
      if (response.ok) {
        const data = await response.json();
        setTerms(data.terms);
      }
    } catch (error) {
      console.error('Error fetching salary terms:', error);
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  useEffect(() => {
    fetchTerms();
  }, [fetchTerms]);

  const openTermModal = (term: SalaryTerm) => {
    setSelectedTerm(term);
  };

  const closeTermModal = () => {
    setSelectedTerm(null);
  };

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-3 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('salaryTerms.title')}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {terms.map((term) => (
            <div
              key={term.key}
              className="group relative p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-400 transition-colors cursor-pointer"
              onClick={() => openTermModal(term)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                    {term.label}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {term.description}
                  </p>
                </div>
                <Info className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0 ml-2" />
              </div>
              
              <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none"></div>
            </div>
          ))}
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
          {t('salaryTerms.subtitle')}
        </p>
      </div>

      {/* Term Detail Modal */}
      {selectedTerm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedTerm.label}
              </h3>
              <button
                onClick={closeTermModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {selectedTerm.description}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
