import type { Project } from '../../types';

interface Props {
  project: Project;
}

export default function ProjectCard({ project }: Props) {
  const statusColors: Record<string, string> = {
    planificacion: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    en_progreso: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    revisión: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    completado: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    cancelado: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  const statusLabels: Record<string, string> = {
    planificacion: 'Planificación',
    en_progreso: 'En Progreso',
    revisión: 'En Revisión',
    completado: 'Completado',
    cancelado: 'Cancelado',
  };

  return (
    <div class="card p-5 hover:shadow-md transition-shadow">
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-gray-900 dark:text-white truncate">{project.name}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{project.client_name}</p>
        </div>
        <span class={`badge ml-3 whitespace-nowrap ${statusColors[project.status] || ''}`}>
          {statusLabels[project.status] || project.status}
        </span>
      </div>

      <p class="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{project.description}</p>

      {/* Progress bar */}
      <div class="mb-3">
        <div class="flex justify-between text-xs mb-1">
          <span class="text-gray-500 dark:text-gray-400">Progreso</span>
          <span class="font-medium text-gray-700 dark:text-gray-300">{project.progress}%</span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            class="bg-primary h-2 rounded-full transition-all duration-500"
            style={`width: ${project.progress}%`}
          />
        </div>
      </div>

      <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span class="flex items-center gap-1">👥 {project.team_size} devs</span>
        <span>{new Date(project.end_date).toLocaleDateString('es-ES')}</span>
      </div>
    </div>
  );
}
