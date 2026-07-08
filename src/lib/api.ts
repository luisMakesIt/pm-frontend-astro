import axios from 'axios';
import type {
  User, Project, Requirement, ActaToma, Activity, Product,
  TeamMember, DashboardStats, LoginCredentials, AuthResponse,
  ReportType, SearchFilters, Priority, ProjectStatus,
  RequirementStatus, ActivityStatus, DevStatus
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pm_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============== AUTH ==============

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const { data } = await api.post('/api/auth/login', credentials);
  localStorage.setItem('pm_token', data.token);
  localStorage.setItem('pm_user', JSON.stringify(data.user));
  return data;
}

export function logout() {
  localStorage.removeItem('pm_token');
  localStorage.removeItem('pm_user');
}

export function getCurrentUser(): User | null {
  const raw = localStorage.getItem('pm_user');
  return raw ? JSON.parse(raw) : null;
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem('pm_token');
}

// ============== DASHBOARD ==============

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await api.get('/api/dashboard/stats');
  return data;
}

// ============== PROJECTS ==============

export async function getProjects(filters?: SearchFilters): Promise<Project[]> {
  const { data } = await api.get('/api/projects', { params: filters });
  return data;
}

export async function getProject(id: string): Promise<Project> {
  const { data } = await api.get(`/api/projects/${id}`);
  return data;
}

export async function createProject(payload: Partial<Project>): Promise<Project> {
  const { data } = await api.post('/api/projects', payload);
  return data;
}

export async function updateProject(id: string, payload: Partial<Project>): Promise<Project> {
  const { data } = await api.put(`/api/projects/${id}`, payload);
  return data;
}

export async function deleteProject(id: string): Promise<void> {
  await api.delete(`/api/projects/${id}`);
}

// ============== REQUIREMENTS ==============

export async function getRequirements(projectId: string): Promise<Requirement[]> {
  const { data } = await api.get(`/api/projects/${projectId}/requirements`);
  return data;
}

export async function createRequirement(projectId: string, payload: Partial<Requirement>): Promise<Requirement> {
  const { data } = await api.post(`/api/projects/${projectId}/requirements`, payload);
  return data;
}

export async function updateRequirement(id: string, payload: Partial<Requirement>): Promise<Requirement> {
  const { data } = await api.put(`/api/requirements/${id}`, payload);
  return data;
}

export async function deleteRequirement(id: string): Promise<void> {
  await api.delete(`/api/requirements/${id}`);
}

// ============== ACTAS ==============

export async function getActas(projectId: string): Promise<ActaToma[]> {
  const { data } = await api.get(`/api/projects/${projectId}/actas`);
  return data;
}

export async function createActa(projectId: string, payload: Partial<ActaToma>): Promise<ActaToma> {
  const { data } = await api.post(`/api/projects/${projectId}/actas`, payload);
  return data;
}

// ============== ACTIVITIES ==============

export async function getActivities(projectId: string): Promise<Activity[]> {
  const { data } = await api.get(`/api/projects/${projectId}/activities`);
  return data;
}

export async function createActivity(projectId: string, payload: Partial<Activity>): Promise<Activity> {
  const { data } = await api.post(`/api/projects/${projectId}/activities`, payload);
  return data;
}

export async function updateActivity(id: string, payload: Partial<Activity>): Promise<Activity> {
  const { data } = await api.put(`/api/activities/${id}`, payload);
  return data;
}

export async function deleteActivity(id: string): Promise<void> {
  await api.delete(`/api/activities/${id}`);
}

// ============== PRODUCTS ==============

export async function getProducts(projectId: string): Promise<Product[]> {
  const { data } = await api.get(`/api/projects/${projectId}/products`);
  return data;
}

export async function createProduct(projectId: string, payload: Partial<Product>): Promise<Product> {
  const { data } = await api.post(`/api/projects/${projectId}/products`, payload);
  return data;
}

export async function updateProduct(id: string, payload: Partial<Product>): Promise<Product> {
  const { data } = await api.put(`/api/products/${id}`, payload);
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/api/products/${id}`);
}

// ============== TEAM ==============

export async function getTeam(projectId: string): Promise<TeamMember[]> {
  const { data } = await api.get(`/api/projects/${projectId}/team`);
  return data;
}

export async function addTeamMember(projectId: string, payload: { user_id: string; role: string }): Promise<TeamMember> {
  const { data } = await api.post(`/api/projects/${projectId}/team`, payload);
  return data;
}

export async function removeTeamMember(projectId: string, userId: string): Promise<void> {
  await api.delete(`/api/projects/${projectId}/team/${userId}`);
}

// ============== USERS (for dev status) ==============

export interface UserWithStatus {
  id: string;
  name: string;
  email: string;
  status: DevStatus;
  current_project?: string;
  tasks_assigned: number;
  tasks_completed: number;
}

export async function getUsers(): Promise<UserWithStatus[]> {
  const { data } = await api.get('/api/users');
  return data;
}

// ============== REPORTS ==============

export async function getReportTypes(): Promise<ReportType[]> {
  const { data } = await api.get('/api/reports/types');
  return data;
}

export async function generateReport(
  type: string,
  filters: Record<string, any>
): Promise<{ url: string; format: string }> {
  const { data } = await api.post('/api/reports/generate', { type, filters });
  return data;
}

// ============== MOCK DATA (fallback when API unavailable) ==============

const MOCK_PROJECTS: Project[] = [
  {
    id: '1', name: 'E-Commerce Platform', description: 'Plataforma de comercio electrónico con catálogo, carrito y pagos',
    client_name: 'TiendaMax S.A.', status: 'en_progreso', progress: 65,
    start_date: '2025-01-15', end_date: '2025-06-30', team_size: 5,
    created_at: '2025-01-15T00:00:00Z', updated_at: '2025-03-20T00:00:00Z'
  },
  {
    id: '2', name: 'Mobile Banking App', description: 'Aplicación móvil para banca en línea con biometría',
    client_name: 'BancoDigital', status: 'planificacion', progress: 15,
    start_date: '2025-04-01', end_date: '2025-09-30', team_size: 8,
    created_at: '2025-03-01T00:00:00Z', updated_at: '2025-03-18T00:00:00Z'
  },
  {
    id: '3', name: 'Healthcare Portal', description: 'Portal de gestión clínica con historial de pacientes',
    client_name: 'Hospital Central', status: 'completado', progress: 100,
    start_date: '2024-09-01', end_date: '2025-02-28', team_size: 6,
    created_at: '2024-09-01T00:00:00Z', updated_at: '2025-02-28T00:00:00Z'
  },
  {
    id: '4', name: 'Inventory Management', description: 'Sistema de gestión de inventario con escaneo RFID',
    client_name: 'LogiCorp', status: 'revisión', progress: 90,
    start_date: '2025-02-01', end_date: '2025-05-30', team_size: 4,
    created_at: '2025-02-01T00:00:00Z', updated_at: '2025-03-22T00:00:00Z'
  },
  {
    id: '5', name: 'Learning Management System', description: 'Plataforma LMS con cursos en video y certificaciones',
    client_name: 'EduTech Academy', status: 'en_progreso', progress: 40,
    start_date: '2025-03-01', end_date: '2025-08-30', team_size: 7,
    created_at: '2025-03-01T00:00:00Z', updated_at: '2025-03-21T00:00:00Z'
  },
];

const MOCK_STATS: DashboardStats = {
  total_projects: 12, active_projects: 4, completed_projects: 5,
  total_devs: 15, available_devs: 6, activities_today: 8,
  requirements_total: 45, requirements_pending: 12,
};

const MOCK_USERS: UserWithStatus[] = [
  { id: 'u1', name: 'Ana García', email: 'ana@dev.com', status: 'disponible', tasks_assigned: 3, tasks_completed: 12 },
  { id: 'u2', name: 'Carlos López', email: 'carlos@dev.com', status: 'ocupado', current_project: 'E-Commerce Platform', tasks_assigned: 7, tasks_completed: 23 },
  { id: 'u3', name: 'María Torres', email: 'maria@dev.com', status: 'disponible', tasks_assigned: 2, tasks_completed: 18 },
  { id: 'u4', name: 'Diego Ruiz', email: 'diego@dev.com', status: 'ocupado', current_project: 'Mobile Banking', tasks_assigned: 6, tasks_completed: 15 },
  { id: 'u5', name: 'Laura Méndez', email: 'laura@dev.com', status: 'ausente', tasks_assigned: 0, tasks_completed: 9 },
  { id: 'u6', name: 'Pedro Soto', email: 'pedro@dev.com', status: 'disponible', tasks_assigned: 1, tasks_completed: 21 },
];

// Simulate API delay for mock mode
function mockDelay(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, 300));
}

// Export mock overrides for development
export const mock = {
  getDashboardStats: async () => { await mockDelay(); return MOCK_STATS; },
  getProjects: async () => { await mockDelay(); return MOCK_PROJECTS; },
  getProject: async (id: string) => {
    await mockDelay();
    return MOCK_PROJECTS[parseInt(id) - 1] || MOCK_PROJECTS[0];
  },
  getUsers: async () => { await mockDelay(); return MOCK_USERS; },
  // ... add more as needed
};

export default api;
