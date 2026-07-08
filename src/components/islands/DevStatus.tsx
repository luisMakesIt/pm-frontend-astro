import { useState } from 'react';
import { Users, CheckCircle, AlertCircle, XCircle, Edit3 } from 'lucide-react';
import type { User } from '../../types';

interface DevStatusProps {
  users: User[];
  title?: string;
}

export default function DevStatus({ users, title = 'Estado del Equipo' }: DevStatusProps) {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const statusConfig: Record<string, { icon: any; color: string; bg: string }> = {
    disponible: {
      icon: CheckCircle,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    },
    ocupado: {
      icon: AlertCircle,
      color: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    },
    ausente: {
      icon: XCircle,
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    },
  };

  const filtered = selectedStatus
    ? users.filter(u => u.status === selectedStatus)
    : users;

  const counts = {
    disponible: users.filter(u => u.status === 'disponible').length,
    ocupado: users.filter(u => u.status === 'ocupado').length,
    ausente: users.filter(u => u.status === 'ausente').length,
  };

  const filterButtons = [
    { status: null, label: 'Todos', count: users.length },
    { status: 'disponible', label: 'Disponibles', count: counts.disponible },
    { status: 'ocupado', label: 'Ocupados', count: counts.ocupado },
    { status: 'ausente', label: 'Ausentes', count: counts.ausente },
  ];

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <span className="text-sm text-gray-500">{users.length} devs</span>
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2 mb-5">
        {filterButtons.map(btn => (
          <button
            key={btn.status ?? 'all'}
            onClick={() => setSelectedStatus(btn.status)}
            className={`btn btn-sm rounded-full px-3 ${
              selectedStatus === btn.status
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {btn.label}
            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
              selectedStatus === btn.status
                ? 'bg-white/20'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}>
              {btn.count}
            </span>
          </button>
        ))}
      </div>

      {/* User cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(user => {
          const config = statusConfig[user.status || 'ausente'];
          const StatusIcon = config.icon;

          return (
            <div
              key={user.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${config.bg}`}
            >
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-lg font-bold flex-shrink-0">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                <div className="flex items-center gap-1.5">
                  <StatusIcon className={`w-3.5 h-3.5 ${config.color}`} />
                  <span className={`text-xs ${config.color} capitalize`}>{user.status}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8 text-gray-400 dark:text-gray-600">
          <Users className="w-10 h-10 mx-auto mb-2" />
          <p className="text-sm">No hay desarrolladores con este estado</p>
        </div>
      )}
    </div>
  );
}
