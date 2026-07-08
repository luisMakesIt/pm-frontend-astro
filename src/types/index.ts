export type ProjectStatus = 'planificacion' | 'en_progreso' | 'revisión' | 'completado' | 'cancelado';
export type ActivityStatus = 'pendiente' | 'en_progreso' | 'completado' | 'atrasado';
export type Priority = 'alta' | 'media' | 'baja';
export type RequirementStatus = 'propuesto' | 'aprobado' | 'rechazado' | 'en_desarrollo' | 'implementado';
export type DevStatus = 'disponible' | 'ocupado' | 'ausente';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'lead' | 'dev' | 'client';
  avatar?: string;
  status?: DevStatus;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  client_name: string;
  status: ProjectStatus;
  progress: number;
  start_date: string;
  end_date: string;
  team_size: number;
  created_at: string;
  updated_at: string;
}

export interface Requirement {
  id: string;
  project_id: string;
  title: string;
  description: string;
  type: 'funcional' | 'no_funcional' | 'restricción';
  priority: Priority;
  status: RequirementStatus;
  acceptance_criteria: string;
  created_at: string;
}

export interface ActaToma {
  id: string;
  project_id: string;
  fecha_sesion: string;
  cliente_info: string;
  participantes: string;
  notas: string;
  acuerdos: string[];
  firma: string;
  created_at: string;
}

export interface Activity {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: ActivityStatus;
  priority: Priority;
  assignee_id?: string;
  assignee_name?: string;
  start_date: string;
  due_date: string;
  completed_at?: string;
}

export interface Product {
  id: string;
  project_id: string;
  name: string;
  description: string;
  type: 'documento' | 'codigo' | 'diagrama' | 'reporte' | 'otro';
  version: string;
  file_url?: string;
  created_at: string;
}

export interface TeamMember {
  user: User;
  role: 'lead' | 'desarrollador' | 'qa' | 'diseñador' | 'client';
  joined_at: string;
  tasks_count: number;
  completed_tasks: number;
}

export interface DashboardStats {
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  total_devs: number;
  available_devs: number;
  activities_today: number;
  requirements_total: number;
  requirements_pending: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ReportType {
  id: string;
  name: string;
  description: string;
  format: 'pdf' | 'csv' | 'excel';
  category: 'proyecto' | 'dev' | 'equipo';
}

export interface SearchFilters {
  search?: string;
  status?: string;
  priority?: string;
  date_from?: string;
  date_to?: string;
}
