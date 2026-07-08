import { TrendingUp, TrendingDown, Users, FolderKanban, Clock, CheckCircle2 } from 'lucide-react';

interface StatItem {
  label: string;
  value: number | string;
  icon: any;
  trend?: { value: number; positive: boolean };
  color?: string;
}

interface StatBoardProps {
  stats: StatItem[];
  title?: string;
}

export default function StatBoard({ stats, title }: StatBoardProps) {
  const iconBgColors: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    cyan: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
  };

  return (
    <div>
      {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          const colorKey = stat.color || Object.keys(iconBgColors)[i % 6];

          return (
            <div key={i} className="card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                </div>
                <div className={`p-2.5 rounded-lg ${iconBgColors[colorKey]}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              {stat.trend && (
                <div className="flex items-center gap-1 mt-3">
                  {stat.trend.positive ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-xs font-medium ${stat.trend.positive ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.trend.positive ? '+' : ''}{stat.trend.value}% vs mes anterior
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
