import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendIcon?: LucideIcon;
  bgColor?: string;
  className?: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendIcon: TrendIcon,
  bgColor = "from-blue-500 to-indigo-600",
  className = ""
}: StatsCardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`flex-shrink-0 p-3 rounded-lg bg-gradient-to-r ${bgColor}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {value}
            </p>
          </div>
        </div>
        {trend && TrendIcon && (
          <div className={`flex items-center text-sm ${
            trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendIcon className="h-4 w-4 mr-1" />
            <span className="font-medium">{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
}
