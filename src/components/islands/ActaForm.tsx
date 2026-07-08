import { useState } from 'react';
import { Calendar, Users, FileText, CheckSquare, Signature } from 'lucide-react';

interface ActaFormProps {
  projectId?: string;
  onSubmit?: (data: any) => void;
}

export default function ActaForm({ projectId, onSubmit }: ActaFormProps) {
  const [formData, setFormData] = useState({
    fecha_sesion: new Date().toISOString().split('T')[0],
    cliente_info: '',
    participantes: '' as string | string[],
    notas: '',
    acuerdos: [''] as string[],
    firma: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fecha_sesion) newErrors.fecha_sesion = 'La fecha es requerida';
    if (!formData.cliente_info.trim()) newErrors.cliente_info = 'La info del cliente es requerida';
    if (!formData.participantes.trim()) newErrors.participantes = 'Los participantes son requeridos';
    if (!formData.firma.trim()) newErrors.firma = 'La firma es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      ...formData,
      project_id: projectId,
      participantes: typeof formData.participantes === 'string'
        ? formData.participantes.split(',').map(p => p.trim()).filter(Boolean)
        : formData.participantes,
      acuerdos: formData.acuerdos.filter(a => a.trim()),
    };

    onSubmit?.(data);
    alert('Acta guardada correctamente');
  };

  const addAcuerdo = () => {
    setFormData(prev => ({ ...prev, acuerdos: [...prev.acuerdos, ''] }));
  };

  const updateAcuerdo = (index: number, value: string) => {
    setFormData(prev => {
      const updated = [...prev.acuerdos];
      updated[index] = value;
      return { ...prev, acuerdos: updated };
    });
  };

  const removeAcuerdo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      acuerdos: prev.acuerdos.filter((_, i) => i !== index),
    }));
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
        <FileText className="w-6 h-6 text-primary" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Acta de Toma de Requerimientos</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Documente la sesión de recopilación de requisitos</p>
        </div>
      </div>

      {/* Fecha de Sesión */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Fecha de Sesión *
          </label>
          <input
            type="date"
            value={formData.fecha_sesion}
            onChange={e => updateField('fecha_sesion', e.target.value)}
            className="input"
          />
          {errors.fecha_sesion && <p className="text-red-500 text-xs mt-1">{errors.fecha_sesion}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
            <Signature className="w-4 h-4" />
            Firma del Cliente *
          </label>
          <input
            type="text"
            value={formData.firma}
            onChange={e => updateField('firma', e.target.value)}
            placeholder="Nombre y cargo del cliente"
            className="input"
          />
          {errors.firma && <p className="text-red-500 text-xs mt-1">{errors.firma}</p>}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Información del Cliente *
          </label>
          <input
            type="text"
            value={formData.cliente_info}
            onChange={e => updateField('cliente_info', e.target.value)}
            placeholder="Empresa, departamento, contacto principal"
            className="input"
          />
          {errors.cliente_info && <p className="text-red-500 text-xs mt-1">{errors.cliente_info}</p>}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Participantes *
          </label>
          <input
            type="text"
            value={formData.participantes}
            onChange={e => updateField('participantes', e.target.value)}
            placeholder="Lista de participantes separados por comas"
            className="input"
          />
          {errors.participantes && <p className="text-red-500 text-xs mt-1">{errors.participantes}</p>}
        </div>
      </div>

      {/* Acuerdos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
          <CheckSquare className="w-4 h-4" />
          Acuerdos
        </label>
        <div className="space-y-2">
          {formData.acuerdos.map((acuerdo, index) => (
            <div key={index} className="flex gap-2">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium mt-2">
                {index + 1}
              </span>
              <input
                type="text"
                value={acuerdo}
                onChange={e => updateAcuerdo(index, e.target.value)}
                placeholder={`Acuerdo ${index + 1}`}
                className="input flex-1"
              />
              {formData.acuerdos.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAcuerdo(index)}
                  className="btn btn-ghost btn-sm text-red-500 mt-2"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={addAcuerdo} className="btn btn-secondary btn-sm mt-2">
          + Agregar acuerdo
        </button>
      </div>

      {/* Notas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Notas Adicionales
        </label>
        <textarea
          value={formData.notas}
          onChange={e => updateField('notas', e.target.value)}
          placeholder="Observaciones, decisiones importantes, riesgos identificados..."
          rows={4}
          className="input resize-none"
        />
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button type="button" className="btn btn-secondary">
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary">
          Guardar Acta
        </button>
      </div>
    </form>
  );
}
