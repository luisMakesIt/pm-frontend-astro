import { CheckCircle, AlertCircle, XCircle, Clock, Filter } from 'lucide-react';

interface Props {
  status: 'planificacion' | 'en_progreso' | 'revisión' | 'completado' | 'cancelado' |
           'pendiente' | 'atrasado' |
           'propuesto' | 'aprobado' | 'rechazado' |
           'alta' | 'media' | 'baja';
}

export default function StatusBadge({ status }: Props) {
  const config: Record<string, { bg: string; text: string; icon: any }> = {
    planificacion: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', icon: Clock },
    en_progreso: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', icon: '▶' },
    revisión: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', icon: '👁' },
    completado: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-400', icon: CheckCircle },
    cancelado: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', icon: XCircle },
    pendiente: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400', icon: Clock },
    atrasado: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', icon: AlertCircle },
    propuesto: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', icon: Clock },
    aprobado: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', icon: CheckCircle },
    rechazado: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', icon: XCircle },
    alta: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', icon: '⚡' },
    media: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', icon: '⚠' },
    baja: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', icon: '✓' },
  };

  const c = config[status] || config.pendiente;
  const labels: Record<string, string> = {
    planificacion: 'Planificación', en_progreso: 'En Progreso', revisión: 'En Revisión',
    completado: 'Completado', cancelado: 'Cancelado', pendiente: 'Pendiente', atrasado: 'Atrasado',
    propuesto: 'Propuesto', aprobado: 'Aprobado', rechazado: 'Rechazado',
    alta: 'Alta', media: 'Media', baja: 'Baja',
  };

  const Icon = c.icon;

  return (
    <span className={`badge inline-flex items-center gap-1.5 ${c.bg} ${c.text}`}>
      {typeof Icon === 'string' ? Icon : <Icon className="w-3.5 h-3.5" />}
      {labels[status] || status}
    </span>
  );
}
