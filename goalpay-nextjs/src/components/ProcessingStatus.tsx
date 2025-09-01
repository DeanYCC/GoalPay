import React from 'react';

interface ProcessingStatusProps {
  step: string;
}

export default function ProcessingStatus({ step }: ProcessingStatusProps) {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
      <div className="flex items-center gap-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <div>
          <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200">
            Processing...
          </h3>
          <p className="text-blue-700 dark:text-blue-300">
            {step}
          </p>
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>Uploading file to server</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>Analyzing document content</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>Extracting payroll data</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>Preparing form data</span>
        </div>
      </div>
    </div>
  );
}
