import axios from 'axios';
import type {
  User, Project, Requirement, ActaToma, Activity, Product,
  TeamMember, DashboardStats, LoginCredentials, AuthResponse,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'https://pm-system-laravel-api.lizhxi1ycxuago5849irydi7.coolify.app';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Token interceptor
api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('pm_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ============== AUTH ==============

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const { data } = await api.post('/api/auth/login', credentials);
  localStorage.setItem('pm_token', data.data.token);
  localStorage.setItem('pm_user', JSON.stringify(data.data.user));
  return data.data as AuthResponse;
}

export function logout(): void {
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
  return data.data;
}

// ============== PROJECTS ==============

export async function getProjects(filters?: Record<string, any>): Promise<Project[]> {
  const { data } = await api.get('/api/projects', { params: filters });
  return toFlatList(data.data);
}

export async function getProject(id: string): Promise<Project> {
  const { data } = await api.get(`/api/projects/${id}`);
  return toSingle(data.data);
}

export async function createProject(payload: Partial<Project>): Promise<Project> {
  const { data } = await api.post('/api/projects', payload);
  return toSingle(data.data);
}

export async function updateProject(id: string, payload: Partial<Project>): Promise<Project> {
  const { data } = await api.put(`/api/projects/${id}`, payload);
  return toSingle(data.data);
}

export async function deleteProject(id: string): Promise<void> {
  await api.delete(`/api/projects/${id}`);
}

export async function getProjectStats(id: string): Promise<Record<string, any>> {
  const { data } = await api.get(`/api/projects/${id}/stats`);
  return data.data;
}

// ============== REQUIREMENTS ==============

export async function getRequirements(projectId: string): Promise<Requirement[]> {
  const { data } = await api.get(`/api/projects/${projectId}/requirements`);
  return toFlatList(data.data);
}

export async function createRequirement(projectId: string, payload: Partial<Requirement>): Promise<Requirement> {
  const { data } = await api.post(`/api/projects/${projectId}/requirements`, payload);
  return toSingle(data.data);
}

export async function updateRequirement(id: string, payload: Partial<Requirement>): Promise<Requirement> {
  const { data } = await api.put(`/api/requirements/${id}`, payload);
  return toSingle(data.data);
}

export async function deleteRequirement(id: string): Promise<void> {
  await api.delete(`/api/requirements/${id}`);
}

// ============== ACTAS ==============

export async function getActas(requirementId: string): Promise<ActaToma[]> {
  const { data } = await api.get(`/api/requirements/${requirementId}/actas`);
  return toFlatList(data.data);
}

export async function createActa(requirementId: string, payload: Partial<ActaToma>): Promise<ActaToma> {
  const { data } = await api.post(`/api/requirements/${requirementId}/actas`, payload);
  return toSingle(data.data);
}

export async function updateActa(requirementId: string, actaId: string, payload: Partial<ActaToma>): Promise<ActaToma> {
  const { data } = await api.put(`/api/requirements/${requirementId}/actas/${actaId}`, payload);
  return toSingle(data.data);
}

export async function deleteActa(requirementId: string, actaId: string): Promise<void> {
  await api.delete(`/api/requirements/${requirementId}/actas/${actaId}`);
}

// ============== ACTIVITIES ==============

export async function getActivities(requirementId: string): Promise<Activity[]> {
  const { data } = await api.get(`/api/requirements/${requirementId}/activities`);
  return toFlatList(data.data);
}

export async function createActivity(requirementId: string, payload: Partial<Activity>): Promise<Activity> {
  const { data } = await api.post(`/api/requirements/${requirementId}/activities`, payload);
  return toSingle(data.data);
}

export async function updateActivity(id: string, payload: Partial<Activity>): Promise<Activity> {
  const { data } = await api.put(`/api/activities/${id}`, payload);
  return toSingle(data.data);
}

export async function deleteActivity(id: string): Promise<void> {
  await api.delete(`/api/activities/${id}`);
}

// ============== PRODUCTS ==============

export async function getProducts(activityId: string): Promise<Product[]> {
  const { data } = await api.get(`/api/activities/${activityId}/products`);
  return toFlatList(data.data);
}

export async function createProduct(activityId: string, payload: Partial<Product>): Promise<Product> {
  const { data } = await api.post(`/api/activities/${activityId}/products`, payload);
  return toSingle(data.data);
}

export async function updateProduct(id: string, payload: Partial<Product>): Promise<Product> {
  const { data } = await api.put(`/api/products/${id}`, payload);
  return toSingle(data.data);
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/api/products/${id}`);
}

// ============== TEAM ==============

export async function getTeam(projectId: string): Promise<TeamMember[]> {
  const { data } = await api.get(`/api/projects/${projectId}/team-members`);
  return toFlatList(data.data);
}

export async function addTeamMember(projectId: string, payload: Record<string, any>): Promise<TeamMember> {
  const { data } = await api.post(`/api/projects/${projectId}/team-members`, payload);
  return toSingle(data.data);
}

export async function removeTeamMember(projectId: string, memberId: string): Promise<void> {
  await api.delete(`/api/projects/${projectId}/team-members/${memberId}`);
}

// ============== REPORTS ==============

export async function getReportSummary(): Promise<any> {
  const { data } = await api.get('/api/reports/summary');
  return data.data;
}

export async function getProjectReport(projectId: string): Promise<any> {
  const { data } = await api.get(`/api/reports/projects/${projectId}`);
  return data.data;
}

export async function projectReportPdf(projectId: string): string {
  return `${API_URL}/api/reports/projects/${projectId}/pdf`;
}

export async function projectReportCsv(projectId: string): string {
  return `${API_URL}/api/reports/projects/${projectId}/csv`;
}

// ============== HELPERS ==============

/**
 * API returns either a single object or a paginated structure.
 * Normalize to flat array.
 */
function toFlatList(obj: any): any[] {
  if (Array.isArray(obj)) return obj;
  if (obj && Array.isArray(obj.data)) return obj.data;
  if (obj && Array.isArray(obj.data?.data)) return obj.data.data;
  return [];
}

function toSingle(obj: any): any {
  if (obj && obj.data && !Array.isArray(obj.data)) return obj.data;
  return obj;
}
