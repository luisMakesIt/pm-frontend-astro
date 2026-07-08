import { useState } from 'react';
import { FileDown, FileText, FileSpreadsheet, Download, X } from 'lucide-react';
import type { ReportType } from '../../types';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  onExport?: (type: string, format: string) => void;
}

const REPORT_TYPES: ReportType[] = [
  { id: 'project_summary', name: 'Resumen del Proyecto', description: 'Estado general, tareas completadas, métricas de rendimiento', format: 'pdf', category: 'proyecto' },
  { id: 'req_coverage', name: 'Cobertura de Requerimientos', description: 'Estado de requirements por categoría y prioridad', format: 'pdf', category: 'proyecto' },
  { id: 'dev_performance', name: 'Rendimiento del Dev', description: 'Tareas asignadas/completadas, eficiencia por desarrollador', format: 'excel', category: 'dev' },
  { id: 'team_timeline', name: 'Timeline del Equipo', description: 'Planificación de actividades y fechas clave', format: 'csv', category: 'equipo' },
  { id: 'product_catalog', name: 'Catálogo de Productos', description: 'Lista de todos los productos entregables', format: 'pdf', category: 'proyecto' },
  { id: 'activity_log', name: 'Log de Actividades', description: 'Historial completo de actividades y su estado', format: 'excel', category: 'equipo' },
];

export default function ExportDialog({ isOpen, onClose, projectId, onExport }: ExportDialogProps) {
  const [selectedType, setSelectedType] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;

    setIsGenerating(true);
    try {
      await onExport?.(selectedType, selectedFormat);
      onClose();
    } finally {
      setIsGenerating(false);
    }
  };

  const formatIcons: Record<string, any> = {
    pdf: FileText,
    excel: FileSpreadsheet,
    csv: FileDown,
  };

  const categoryColors: Record<string, string> = {
    proyecto: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    dev: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    equipo: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Dialog */}
      <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Download className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Generar Reporte</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {REPORT_TYPES.map(report => {
              const Icon = formatIcons[report.format];

              return (
                <button
                  key={report.id}
                  type="button"
                  onClick={() => setSelectedType(report.id)}
                  className={`relative p-4 rounded-lg border-2 text-left transition-all ${
                    selectedType === report.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <Icon className="w-5 h-5 text-primary" />
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[report.category]}`}>
                      {report.category}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">{report.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{report.description}</p>
                </button>
              );
            })}
          </div>

          {/* Format selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Formato de salida</label>
            <div className="flex gap-3">
              {['pdf', 'excel', 'csv'].map(format => (
                <button
                  key={format}
                  type="button"
                  onClick={() => setSelectedFormat(format)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium border-2 transition-all ${
                    selectedFormat === format
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                  }`}
                >
                  {format.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancelar
          </button>
          <button
            type="submit"
            form="export-form"
            onClick={handleSubmit}
            disabled={!selectedType || isGenerating}
            className="btn btn-primary"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Exportar
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
