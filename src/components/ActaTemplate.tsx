import React from 'react';

interface ActaParticipante {
  nombre?: string;
}

interface ActaAcuerdo {
  descripcion?: string;
}

interface Acta {
  id?: number | string;
  requirement_id?: number | string;
  fecha_sesion?: string;
  cliente_nombre?: string;
  cliente_email?: string;
  cliente_empresa?: string;
  participantes?: string[] | ActaParticipante[];
  notas?: string;
  acuerdos?: string[] | ActaAcuerdo[];
  estado_firma?: string;
}

const estadoFirmaLabels: Record<string, string> = {
  sin_firmar: 'Sin Firmar',
  esperando_firma: 'Esperando Firma',
  firmado: 'Firmado',
  archivado: 'Archivado',
};

const estadoFirmaStyles: Record<string, string> = {
  sin_firmar: 'bg-red-100 text-red-700 border-red-300',
  esperando_firma: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  firmado: 'bg-green-100 text-green-700 border-green-300',
  archivado: 'bg-gray-100 text-gray-700 border-gray-300',
};

function getParticipante(p: string | ActaParticipante): string {
  if (typeof p === 'string') return p;
  return p?.nombre || '-';
}

function getAcuerdo(a: string | ActaAcuerdo): string {
  if (typeof a === 'string') return a;
  return a?.descripcion || '-';
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '-';
  try {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export default function ActaTemplate({ acta }: { acta: Acta }) {
  const participantes = Array.isArray(acta.participantes) ? acta.participantes : [];
  const acuerdos = Array.isArray(acta.acuerdos) ? acta.acuerdos : [];
  const estado = acta.estado_firma || 'sin_firmar';

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-8 rounded-lg shadow print:shadow-none print:max-w-none print:p-0">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 dark:border-gray-200 pb-6 mb-6">
        <h1 className="text-2xl font-bold tracking-wide uppercase">
          Acta de Toma de Requerimientos
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Acta N° {acta.id || '-'} &middot; {formatDate(acta.fecha_sesion)}
        </p>
      </div>

      {/* Client Info */}
      <section className="mb-6">
        <h2 className="text-lg font-bold border-b border-gray-300 dark:border-gray-700 pb-1 mb-3">
          Información del Cliente
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="font-medium text-gray-500">Nombre:</span>{' '}
            {acta.cliente_nombre || '-'}
          </div>
          <div>
            <span className="font-medium text-gray-500">Empresa:</span>{' '}
            {acta.cliente_empresa || '-'}
          </div>
          <div className="col-span-2">
            <span className="font-medium text-gray-500">Email:</span>{' '}
            {acta.cliente_email || '-'}
          </div>
        </div>
      </section>

      {/* Participants */}
      <section className="mb-6">
        <h2 className="text-lg font-bold border-b border-gray-300 dark:border-gray-700 pb-1 mb-3">
          Participantes
        </h2>
        {participantes.length > 0 ? (
          <ol className="list-decimal list-inside text-sm space-y-1">
            {participantes.map((p, i) => (
              <li key={i}>{getParticipante(p)}</li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-gray-400">Sin participantes registrados.</p>
        )}
      </section>

      {/* Notes */}
      <section className="mb-6">
        <h2 className="text-lg font-bold border-b border-gray-300 dark:border-gray-700 pb-1 mb-3">
          Notas
        </h2>
        <p className="text-sm whitespace-pre-wrap">
          {acta.notas || 'Sin notas registradas.'}
        </p>
      </section>

      {/* Agreements */}
      <section className="mb-6">
        <h2 className="text-lg font-bold border-b border-gray-300 dark:border-gray-700 pb-1 mb-3">
          Acuerdos
        </h2>
        {acuerdos.length > 0 ? (
          <ol className="list-decimal list-inside text-sm space-y-1">
            {acuerdos.map((a, i) => (
              <li key={i}>{getAcuerdo(a)}</li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-gray-400">Sin acuerdos registrados.</p>
        )}
      </section>

      {/* Signature Section */}
      <section className="mt-8">
        <h2 className="text-lg font-bold border-b border-gray-300 dark:border-gray-700 pb-1 mb-3">
          Estado de Firma
        </h2>
        <div className="flex items-center gap-3 mb-6">
          <span
            className={`inline-block px-4 py-1 rounded-full text-sm font-medium border ${
              estadoFirmaStyles[estado] || estadoFirmaStyles.sin_firmar
            }`}
          >
            {estadoFirmaLabels[estado] || estado}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12">
          <div className="text-center">
            <div className="border-t border-gray-400 dark:border-gray-600 pt-2 mx-8">
              <p className="text-sm font-medium">{acta.cliente_nombre || 'Cliente'}</p>
              <p className="text-xs text-gray-500">Firma del Cliente</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t border-gray-400 dark:border-gray-600 pt-2 mx-8">
              <p className="text-sm font-medium">Representante</p>
              <p className="text-xs text-gray-500">Firma del Representante</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="mt-10 pt-4 border-t border-gray-200 dark:border-gray-800 text-center text-xs text-gray-400">
        <p>
          Documento generado por PM System &middot; Acta N° {acta.id || '-'} &middot;{' '}
          {formatDate(acta.fecha_sesion)}
        </p>
      </div>
    </div>
  );
}
