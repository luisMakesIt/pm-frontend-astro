import React, { useState, useEffect } from 'react';
import ActaTemplate from './ActaTemplate';

interface ActaData {
  id?: number | string;
  requirement_id?: number | string;
  fecha_sesion?: string;
  cliente_nombre?: string;
  cliente_email?: string;
  cliente_empresa?: string;
  participantes?: string[];
  notas?: string;
  acuerdos?: string[];
  estado_firma?: string;
  req_title?: string;
  project_name?: string;
}

function getQueryParam(name: string): string | null {
  return new URLSearchParams(window.location.search).get(name);
}

function getToken(): string | null {
  const t = localStorage.getItem('pm_token');
  if (!t) {
    window.location.href = '/login';
    return null;
  }
  return t;
}

export default function ActaPreview({ apiBase }: { apiBase: string }) {
  const [acta, setActa] = useState<ActaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function load() {
      const token = getToken();
      if (!token) return;

      const API = apiBase + '/api';
      const actaId = getQueryParam('id');
      const reqId = getQueryParam('req_id');

      if (!actaId) {
        setError('No se especificó un ID de acta. Use /actas/preview/?id=X&req_id=Y');
        setLoading(false);
        return;
      }

      try {
        // Fetch all projects, then requirements, then actas to find the one
        const pres = await fetch(`${API}/projects`, {
          headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
        });
        const pjson = await pres.json();
        const projects = pjson.data || [];
        let foundActa: ActaData | null = null;

        for (let pi = 0; pi < projects.length && !foundActa; pi++) {
          const rres = await fetch(
            `${API}/projects/${projects[pi].id}/requirements`,
            { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } }
          );
          const rjson = await rres.json();
          if (!rjson.success || !rjson.data) continue;
          const reqs = Array.isArray(rjson.data) ? rjson.data : [rjson.data];
          for (let ri = 0; ri < reqs.length && !foundActa; ri++) {
            const ares = await fetch(
              `${API}/requirements/${reqs[ri].id}/actas`,
              { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } }
            );
            const ajson = await ares.json();
            if (ajson.success && ajson.data) {
              const actas = Array.isArray(ajson.data) ? ajson.data : [ajson.data];
              for (let ai = 0; ai < actas.length; ai++) {
                if (String(actas[ai].id) === String(actaId)) {
                  foundActa = actas[ai] as ActaData;
                  foundActa.req_title = reqs[ri].title;
                  foundActa.project_name = projects[pi].name;
                  break;
                }
              }
            }
          }
        }

        if (!foundActa && reqId) {
          const dres = await fetch(
            `${API}/requirements/${reqId}/actas/${actaId}`,
            { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } }
          );
          const djson = await dres.json();
          if (djson.success && djson.data) {
            foundActa = djson.data as ActaData;
          }
        }

        if (foundActa) {
          setActa(foundActa);
        } else {
          setError(`No se encontró el acta con ID ${actaId}`);
        }
      } catch (e) {
        setError(`Error: ${(e as Error).message}`);
      }
      setLoading(false);
    }
    load();
  }, [apiBase]);

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Cargando acta...</div>;
  }
  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }
  if (!acta) {
    return <div className="text-center py-8 text-red-500">No se encontró el acta.</div>;
  }
  return <ActaTemplate acta={acta} />;
}
