# PM System — Sistema de Gestión de Proyectos de Software

Sistema web para gestión de proyectos de software que permite crear requerimientos definidos por acta de toma de requerimientos, crear actividades para requerimientos, registrar productos por actividad, ver avance por proyecto/desarrollador/equipo, y exportar informes en formato PDF y CSV.

---

## Tabla de Contenidos

- [Stack Tecnológico](#stack-tecnológico)
- [Características](#características)
- [Arquitectura](#arquitectura)
- [Endpoints de la API](#endpoints-de-la-api)
- [Relaciones de Entidades](#relaciones-de-entidades)
- [Campos de Entidades](#campos-de-entidades)
- [Desarrollo Local](#desarrollo-local)
- [Despliegue](#despliegue)
- [Pruebas](#pruebas)
- [Resultados de Pruebas E2E](#resultados-de-pruebas-e2e)

---

## Stack Tecnológico

| Capa          | Tecnología                                          |
|---------------|-----------------------------------------------------|
| Frontend      | Astro 4, React 18, Tailwind CSS 3, Recharts, Lucide |
| Backend       | Laravel 11 (PHP 8.3), Sanctum (autenticación)       |
| Base de Datos | PostgreSQL 16                                       |
| Caché         | Redis 7                                             |
| Despliegue    | Coolify (Docker)                                    |
| Tests         | Shell script E2E (curl + Python JSON parse)         |

---

## Características

| Módulo         | Descripción                                                              |
|----------------|--------------------------------------------------------------------------|
| Dashboard      | Estadísticas generales del sistema (proyectos, devs, requerimientos)     |
| Proyectos      | CRUD completo de proyectos con vista de detalle y estadísticas           |
| Requerimientos | CRUD con prioridades y estados                                           |
| Actas          | Actas de toma de requerimientos con participantes y estados de firma     |
| Actividades    | CRUD con tiempos estimados/reales y asignación de desarrollador          |
| Productos      | CRUD con tipos (documento, código, diseño, etc.)                         |
| Bitácora       | Logs de desarrollo (commits, fixes, reviews) con tiempo gastado          |
| Equipo         | Gestión de miembros por proyecto con roles y experiencia                 |
| Reportes       | Reportes por proyecto, desarrollador y equipo con exportación PDF/CSV    |

---

## Arquitectura

```
┌─────────────────────────┐     HTTP/JSON      ┌──────────────────────────┐
│   Frontend (Astro 4)    │  ◄──────────────► │   Backend (Laravel 11)    │
│                         │                    │                          │
│  • React Islands        │                    │  • REST API (42 routes)  │
│  • Tailwind CSS         │                    │  • Sanctum Auth          │
│  • Recharts             │                    │  • Controllers           │
│  • Axios Client         │                    │  • Eloquent Models       │
└─────────────────────────┘                    └───────────┬──────────────┘
                                                            │
                                              ┌─────────────┴──────────────┐
                                              │                            │
                                              ▼                            ▼
                                    ┌──────────────────┐         ┌──────────────┐
                                    │ PostgreSQL 16    │         │   Redis 7    │
                                    │                  │         │              │
                                    │  • projects      │         │  • Caché     │
                                    │  • requirements  │         │  • Sesiones  │
                                    │  • activities    │         │  • Colas     │
                                    │  • products      │         │              │
                                    │  • + 4 tablas    │         └──────────────┘
                                    └──────────────────┘
```

**URLs de producción:**

| Servicio  | URL                                                                                  |
|-----------|--------------------------------------------------------------------------------------|
| Frontend  | http://msiqnz11cno6q97gb4gjk5rs.144.217.163.180.sslip.io                             |
| API       | http://zasm8vmm79eejamdbgx3zwda.144.217.163.180.sslip.io/api                         |
| Health    | http://zasm8vmm79eejamdbgx3zwda.144.217.163.180.sslip.io/api/health                  |

---

## Endpoints de la API

La API expone **42 endpoints** agrupados por entidad. Todos los endpoints (excepto `health` y `login`) requieren autenticación mediante Bearer Token (Sanctum).

### Health (1 endpoint)

| Método | Endpoint       | Descripción                  |
|--------|----------------|------------------------------|
| GET    | `/health`       | Estado del servicio          |

### Autenticación (3 endpoints)

| Método | Endpoint          | Descripción                  |
|--------|-------------------|------------------------------|
| POST   | `/auth/login`       | Iniciar sesión, retorna token |
| POST   | `/auth/logout`      | Cerrar sesión                |
| GET    | `/auth/me`          | Datos del usuario autenticado|

### Dashboard (1 endpoint)

| Método | Endpoint            | Descripción                              |
|--------|---------------------|------------------------------------------|
| GET    | `/dashboard/stats`    | Estadísticas globales del sistema        |

### Projects (7 endpoints)

| Método | Endpoint                     | Descripción                              |
|--------|------------------------------|------------------------------------------|
| GET    | `/projects`                    | Listar proyectos                         |
| POST   | `/projects`                    | Crear proyecto                           |
| GET    | `/projects/{project}`          | Obtener proyecto                         |
| PUT    | `/projects/{project}`          | Actualizar proyecto                      |
| DELETE | `/projects/{project}`          | Eliminar proyecto                        |
| GET    | `/projects/{project}/stats`    | Estadísticas del proyecto                |

### Requirements (5 endpoints)

| Método | Endpoint                                      | Descripción                              |
|--------|-----------------------------------------------|------------------------------------------|
| GET    | `/projects/{project}/requirements`              | Listar requerimientos del proyecto       |
| POST   | `/projects/{project}/requirements`              | Crear requerimiento                      |
| GET    | `/projects/{project}/requirements/{requirement}`| Obtener requerimiento                   |
| PUT    | `/projects/{project}/requirements/{requirement}`| Actualizar requerimiento                |
| DELETE | `/projects/{project}/requirements/{requirement}`| Eliminar requerimiento                  |

### Requirement Actas (5 endpoints)

| Método | Endpoint                                              | Descripción                              |
|--------|-------------------------------------------------------|------------------------------------------|
| GET    | `/requirements/{requirement}/actas`                     | Listar actas del requerimiento           |
| POST   | `/requirements/{requirement}/actas`                     | Crear acta                               |
| GET    | `/requirements/{requirement}/actas/{acta}`              | Obtener acta                             |
| PUT    | `/requirements/{requirement}/actas/{acta}`               | Actualizar acta                          |
| DELETE | `/requirements/{requirement}/actas/{acta}`              | Eliminar acta                            |

### Activities (5 endpoints)

| Método | Endpoint                                                  | Descripción                              |
|--------|-----------------------------------------------------------|------------------------------------------|
| GET    | `/requirements/{requirement}/activities`                    | Listar actividades del requerimiento      |
| POST   | `/requirements/{requirement}/activities`                    | Crear actividad                          |
| GET    | `/requirements/{requirement}/activities/{activity}`         | Obtener actividad                        |
| PUT    | `/requirements/{requirement}/activities/{activity}`         | Actualizar actividad                    |
| DELETE | `/requirements/{requirement}/activities/{activity}`         | Eliminar actividad                      |

### Products (5 endpoints)

| Método | Endpoint                                              | Descripción                              |
|--------|-------------------------------------------------------|------------------------------------------|
| GET    | `/activities/{activity}/products`                       | Listar productos de la actividad         |
| POST   | `/activities/{activity}/products`                       | Crear producto                           |
| GET    | `/activities/{activity}/products/{product}`             | Obtener producto                         |
| PUT    | `/activities/{activity}/products/{product}`              | Actualizar producto                     |
| DELETE | `/activities/{activity}/products/{product}`              | Eliminar producto                       |

### Development Logs (5 endpoints)

| Método | Endpoint                                                       | Descripción                              |
|--------|----------------------------------------------------------------|------------------------------------------|
| GET    | `/activities/{activity}/development-logs`                        | Listar logs de desarrollo                |
| POST   | `/activities/{activity}/development-logs`                        | Crear log                                |
| GET    | `/activities/{activity}/development-logs/{log}`                  | Obtener log                              |
| PUT    | `/activities/{activity}/development-logs/{log}`                  | Actualizar log                           |
| DELETE | `/activities/{activity}/development-logs/{log}`                  | Eliminar log                             |

### Team Members (5 endpoints)

| Método | Endpoint                                                | Descripción                              |
|--------|---------------------------------------------------------|------------------------------------------|
| GET    | `/projects/{project}/team-members`                        | Listar miembros del proyecto             |
| POST   | `/projects/{project}/team-members`                        | Añadir miembro                           |
| GET    | `/projects/{project}/team-members/{member}`              | Obtener miembro                          |
| PUT    | `/projects/{project}/team-members/{member}`              | Actualizar miembro                       |
| DELETE | `/projects/{project}/team-members/{member}`              | Eliminar miembro                         |

### Reports (8 endpoints)

| Método | Endpoint                                | Descripción                              |
|--------|-----------------------------------------|------------------------------------------|
| GET    | `/reports/summary`                        | Resumen general de reportes              |
| GET    | `/reports/projects/{project}`             | Reporte de proyecto                      |
| GET    | `/reports/projects/{project}/pdf`         | Exportar reporte de proyecto en PDF      |
| GET    | `/reports/projects/{project}/csv`         | Exportar reporte de proyecto en CSV      |
| GET    | `/reports/developers/{developer}`         | Reporte por desarrollador                |
| GET    | `/reports/developers/{developer}/pdf`     | Exportar reporte de dev en PDF           |
| GET    | `/reports/team`                           | Reporte del equipo                       |
| GET    | `/reports/team/pdf`                       | Exportar reporte de equipo en PDF        |

---

## Relaciones de Entidades

```
Project
├── Requirement
│   ├── RequirementActa (acta de toma de requerimientos)
│   └── Activity
│       ├── Product
│       └── DevelopmentLog
├── TeamMember
└── Reports (transversal: por proyecto, desarrollador y equipo)
```

**Jerarquía de anidación:**

```
Project ──► Requirement ──► Activity ──► Product
   │           │                 │
   │           └──► Acta         └──► DevelopmentLog
   │
   └──► TeamMember

Reports ──► Project / Developer / Team (transversal)
```

**Reglas de eliminación:** Todas las relaciones foráneas usan `onDelete('cascade')`, por lo que eliminar un proyecto elimina en cascada sus requerimientos, actas, actividades, productos, logs y miembros.

---

## Campos de Entidades

### Project

| Campo           | Tipo      | Descripción                                      |
|-----------------|-----------|--------------------------------------------------|
| `id`            | bigint    | Identificador único                              |
| `name`          | string    | Nombre del proyecto                              |
| `description`   | text      | Descripción (nullable)                           |
| `git_repo_url`  | string    | URL del repositorio Git (nullable)               |
| `client_name`   | string    | Nombre del cliente (nullable)                    |
| `status`        | string    | Estado: `planificacion`, `en_progreso`, `revisión`, `completado`, `cancelado` |
| `start_date`    | date      | Fecha de inicio (nullable)                       |
| `end_date`      | date      | Fecha de fin (nullable)                          |
| `created_at`    | timestamp | Fecha de creación                                |
| `updated_at`    | timestamp | Fecha de actualización                           |

### Requirement

| Campo         | Tipo      | Descripción                                      |
|---------------|-----------|--------------------------------------------------|
| `id`          | bigint    | Identificador único                              |
| `project_id`  | bigint FK | Proyecto al que pertenece                        |
| `title`       | string    | Título del requerimiento                         |
| `description` | text      | Descripción (nullable)                           |
| `priority`    | string    | Prioridad: `alta`, `media`, `baja`               |
| `status`      | string    | Estado: `propuesto`, `aprobado`, `rechazado`, `en_desarrollo`, `implementado` |
| `created_at`  | timestamp | Fecha de creación                                |
| `updated_at`  | timestamp | Fecha de actualización                           |

### RequirementActa

| Campo              | Tipo      | Descripción                                      |
|--------------------|-----------|--------------------------------------------------|
| `id`               | bigint    | Identificador único                              |
| `requirement_id`   | bigint FK | Requerimiento al que pertenece                   |
| `fecha_sesion`     | date      | Fecha de la sesión (nullable)                    |
| `cliente_nombre`   | string    | Nombre del cliente                               |
| `cliente_email`    | string    | Email del cliente                                |
| `cliente_empresa`  | string    | Empresa del cliente                               |
| `participantes`    | json      | Lista de participantes (nullable)               |
| `notas`            | text      | Notas de la sesión (nullable)                    |
| `firmas`           | text      | Firmas (nullable)                                |
| `acuerdos`         | json      | Acuerdos de la sesión (nullable)                |
| `fecha_firma_acta` | date      | Fecha de firma del acta (nullable)               |
| `estado_firma`     | string    | Estado: `sin_firmar`, `firmado` (default: `sin_firmar`) |
| `created_at`       | timestamp | Fecha de creación                                |
| `updated_at`       | timestamp | Fecha de actualización                           |

### Activity

| Campo                    | Tipo         | Descripción                                      |
|--------------------------|--------------|--------------------------------------------------|
| `id`                     | bigint       | Identificador único                              |
| `requirement_id`         | bigint FK    | Requerimiento al que pertenece                   |
| `title`                  | string       | Título de la actividad                           |
| `description`            | text         | Descripción (nullable)                           |
| `status`                 | string       | Estado: `pendiente`, `en_progreso`, `completado`, `atrasado` |
| `fecha_inicio_planificada` | date       | Fecha de inicio planificada (nullable)           |
| `fecha_limite`           | date         | Fecha límite (nullable)                          |
| `tiempo_estimado_horas`  | decimal(8,2) | Tiempo estimado en horas (default: 0)            |
| `tiempo_real_horas`      | decimal(8,2) | Tiempo real gastado en horas (default: 0)         |
| `asignado_a`             | bigint       | ID del usuario asignado (nullable)               |
| `created_at`             | timestamp    | Fecha de creación                                |
| `updated_at`             | timestamp    | Fecha de actualización                           |

### Product

| Campo          | Tipo      | Descripción                                      |
|----------------|-----------|--------------------------------------------------|
| `id`           | bigint    | Identificador único                              |
| `activity_id`  | bigint FK | Actividad a la que pertenece                     |
| `name`         | string    | Nombre del producto                              |
| `description`  | text      | Descripción (nullable)                           |
| `type`         | string    | Tipo: `documento`, `codigo`, `diagrama`, `reporte`, `otro` |
| `url_or_path`  | string    | URL o ruta del archivo (nullable)                |
| `version`      | string    | Versión del producto (nullable)                  |
| `created_by`   | bigint    | ID del creador (nullable)                        |
| `notes`        | text      | Notas adicionales (nullable)                     |
| `created_at`   | timestamp | Fecha de creación                                |
| `updated_at`   | timestamp | Fecha de actualización                           |

### DevelopmentLog

| Campo                    | Tipo         | Descripción                                      |
|--------------------------|--------------|--------------------------------------------------|
| `id`                     | bigint       | Identificador único                              |
| `activity_id`            | bigint FK    | Actividad a la que pertenece                     |
| `developer_name`         | string       | Nombre del desarrollador                         |
| `developer_email`        | string       | Email del desarrollador                          |
| `tipo_accion`            | string       | Tipo: `commit`, `fix`, `review`, `merge`, `otro` |
| `descripcion`            | text         | Descripción de la acción                         |
| `tiempo_gastado_minutos` | decimal(8,2) | Tiempo gastado en minutos (default: 0)            |
| `fecha_registro`         | date         | Fecha de registro                                |
| `link_o_ref`             | string       | Link o referencia (nullable)                     |
| `developer_id`           | bigint       | ID del desarrollador (nullable)                  |
| `created_at`             | timestamp    | Fecha de creación                                |
| `updated_at`             | timestamp    | Fecha de actualización                           |

### TeamMember

| Campo               | Tipo      | Descripción                                      |
|---------------------|-----------|--------------------------------------------------|
| `id`                | bigint    | Identificador único                              |
| `project_id`        | bigint FK | Proyecto al que pertenece                        |
| `name`              | string    | Nombre del miembro                               |
| `email`             | string    | Email del miembro                                |
| `role`              | string    | Rol: `lead`, `desarrollador`, `qa`, `diseñador`, `client` |
| `nivel_experiencia` | string    | Nivel: `junior`, `semi-senior`, `senior` (nullable) |
| `avatar_url`        | string    | URL del avatar (nullable)                         |
| `estado`            | string    | Estado: `disponible`, `ocupado`, `ausente` (default: `disponible`) |
| `joined_date`       | date      | Fecha de incorporación (nullable)                |
| `git_username`      | string    | Usuario de Git (nullable)                         |
| `github_url`        | string    | URL de GitHub (nullable)                          |
| `dev_id`            | bigint    | ID del desarrollador (nullable)                  |
| `created_at`        | timestamp | Fecha de creación                                |
| `updated_at`        | timestamp | Fecha de actualización                           |

---

## Desarrollo Local

### Requisitos

- **Node.js** 20+
- **npm** 10+
- **Docker** + Docker Compose (para el backend)

### Frontend (Astro)

```bash
# Clonar el repositorio
git clone <repo-url>
cd pm-frontend-astro

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env y configurar PUBLIC_API_URL

# Iniciar servidor de desarrollo
npm run dev
# → http://localhost:4321

# Build de producción
npm run build

# Preview del build
npm run preview

# Verificación de tipos
npm run check
```

### Backend (Laravel)

```bash
cd pm-api-laravel

# Levantar PostgreSQL + Laravel con Docker
docker-compose up -d

# Ejecutar migraciones
docker-compose exec app php artisan migrate

# Sembrar datos de prueba
docker-compose exec app php artisan db:seed

# El backend estará disponible en http://localhost:8080
```

### Variable de Entorno del Frontend

| Variable         | Descripción                        | Valor por defecto                      |
|------------------|------------------------------------|----------------------------------------|
| `PUBLIC_API_URL` | URL base de la API de Laravel      | `http://zasm8vmm79eejamdbgx3zwda...`   |

### Páginas del Frontend (9 páginas)

| Ruta              | Página                  |
|-------------------|-------------------------|
| `/`                | Dashboard               |
| `/login/`          | Inicio de sesión        |
| `/projects/`       | Lista de proyectos      |
| `/projects/[id]`   | Detalle de proyecto     |
| `/requerimientos/` | Requerimientos          |
| `/actas/`          | Actas                   |
| `/actividades/`    | Actividades             |
| `/productos/`      | Productos             |
| `/bitacora/`       | Bitácora de desarrollo  |
| `/equipo/`         | Equipo                  |
| `/reportes/`       | Reportes              |

---

## Despliegue

El despliegue se realiza mediante **Coolify** con Docker.

### Frontend

1. **Dockerfile multi-stage:**
   - Stage 1 (`build`): Node 20 Alpine, `npm install` + `npm run build`
   - Stage 2: Nginx Alpine, sirve `dist/` como estático
2. **Coolify** detecta el `Dockerfile`, construye la imagen y despliega el contenedor en el puerto 80.
3. El contenedor Nginx sirve el sitio estático con SPA routing configurado en `nginx.conf`.

```bash
# El build se ejecuta automáticamente en Coolify:
docker build -t pm-frontend .
docker run -p 80:80 pm-frontend
```

### Backend

1. Coolify construye la imagen Docker del backend Laravel.
2. Ejecuta migraciones automáticamente (`php artisan migrate`).
3. La API queda disponible en el puerto 80 del contenedor.

### URLs de Producción

| Servicio  | URL                                                                                  |
|-----------|--------------------------------------------------------------------------------------|
| Frontend  | http://msiqnz11cno6q97gb4gjk5rs.144.217.163.180.sslip.io                             |
| API       | http://zasm8vmm79eejamdbgx3zwda.144.217.163.180.sslip.io/api                         |
| Health    | http://zasm8vmm79eejamdbgx3zwda.144.217.163.180.sslip.io/api/health                  |

---

## Pruebas

### Tests E2E

El proyecto incluye un script de pruebas end-to-end que valida el flujo completo de la API:

```bash
# Ejecutar tests E2E
cd pm-frontend-astro
bash tests/e2e.sh
```

### Credenciales de prueba

| Email                  | Contraseña |
|------------------------|------------|
| `admin@pmsystem.com`   | `admin123` |

### Flujo de pruebas

El script `tests/e2e.sh` cubre el siguiente flujo:

1. **Login** — Autenticación con Sanctum, obtención de Bearer token
2. **Create Project** — Crear proyecto nuevo
3. **Create Requirement** — Crear requerimiento dentro del proyecto
4. **Create Acta** — Crear acta de toma de requerimientos
5. **Create Activity** — Crear actividad para el requerimiento
6. **Create Product** — Crear producto para la actividad
7. **Create DevelopmentLog** — Registrar log de desarrollo
8. **Create TeamMember** — Añadir miembro al proyecto
9. **Read back** — Verificar lectura de todas las entidades creadas
10. **Update Project** — Actualizar nombre y estado del proyecto
11. **Cleanup** — Eliminar todas las entidades de prueba (hijos primero)

---

## Resultados de Pruebas E2E

```
==========================================
  E2E Test — PM System API
==========================================

--- Step 1: Login ---
 ✅ PASS: Login successful, token obtained

--- Step 2: Create Project ---
 ✅ PASS: Project created (ID: 10)

--- Step 3: Create Requirement ---
 ✅ PASS: Requirement created (ID: 14)

--- Step 4: Create Acta ---
 ✅ PASS: Acta created (ID: 5)

--- Step 5: Create Activity ---
 ✅ PASS: Activity created (ID: 14)

--- Step 6: Create Product ---
 ✅ PASS: Product created (ID: 10)

--- Step 7: Create Development Log ---
 ✅ PASS: Development Log created (ID: 6)

--- Step 8: Create Team Member ---
 ✅ PASS: Team Member created (ID: 18)

--- Step 9: Read back all entities ---
 ✅ PASS: Read project: E2E Test Project
 ✅ PASS: Requirements list: 1 item(s)
 ✅ PASS: Actas list: 1 item(s)
 ✅ PASS: Activities list: 1 item(s)
 ✅ PASS: Products list: 1 item(s)
 ✅ PASS: Dev Logs list: 1 item(s)
 ✅ PASS: Team Members list: 1 item(s)

--- Step 10: Update Project ---
 ✅ PASS: Project updated: E2E Updated Project

--- Step 11: Cleanup (delete test data) ---
 ✅ PASS: DevLog deleted
 ✅ PASS: Product deleted
 ✅ PASS: Activity deleted
 ✅ PASS: Acta deleted
 ✅ PASS: Requirement deleted
 ✅ PASS: Team Member deleted
 ✅ PASS: Project deleted

==========================================
  RESULTS: 23 passed, 0 failed
==========================================
  ALL TESTS PASSED ✅
```

**Resumen: 23/23 pruebas exitosas ✅**