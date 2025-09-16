import { ReactNode } from 'react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: string
  description?: string
}

export default function StatsCard({ title, value, icon, trend, description }: StatsCardProps) {
  const isPositiveTrend = trend && trend.startsWith('+')
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
          )}
        </div>
        <div className="flex-shrink-0">
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-4">
          <span
            className={`text-sm font-medium ${
              isPositiveTrend
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {trend}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">vs last period</span>
        </div>
      )}
    </div>
  )
}