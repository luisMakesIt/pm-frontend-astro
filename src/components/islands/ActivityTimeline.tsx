import { Activity, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import type { Activity as ActivityType } from '../../types';

interface ActivityTimelineProps {
  activities: ActivityType[];
}

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const statusConfig = {
    pendiente: { icon: Clock, color: 'bg-gray-400', text: 'text-gray-600 dark:text-gray-400', label: 'Pendiente' },
    en_progreso: { icon: Activity, color: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400', label: 'En Progreso' },
    completado: { icon: CheckCircle2, color: 'bg-green-500', text: 'text-green-600 dark:text-green-400', label: 'Completado' },
    atrasado: { icon: AlertCircle, color: 'bg-red-500', text: 'text-red-600 dark:text-red-400', label: 'Atrasado' },
  };

  const sorted = [...activities].sort((a, b) =>
    new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  );

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />

      {sorted.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
          <p>No hay actividades registradas</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((activity, i) => {
            const config = statusConfig[activity.status] || statusConfig.pendiente;
            const Icon = config.icon;

            return (
              <div key={activity.id} className="relative flex gap-4 pl-2">
                {/* Timeline dot */}
                <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full ${config.color} flex items-center justify-center shadow-md`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <div className="card p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{activity.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{activity.description}</p>
                      </div>
                      <span className={`badge ${getBadgeColor(activity.status)}`}>
                        {config.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                      <span>📅 {formatDate(activity.start_date)} → {formatDate(activity.due_date)}</span>
                      {activity.assignee_name && (
                        <span>👤 {activity.assignee_name}</span>
                      )}
                      {activity.priority === 'alta' && (
                        <span className="text-red-500 font-medium">⚡ Alta prioridad</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function getBadgeColor(status: string): string {
  const colors: Record<string, string> = {
    pendiente: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    en_progreso: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    completado: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    atrasado: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
