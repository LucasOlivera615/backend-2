# Plataforma de CoderEventos

API REST desarrollada como proyecto del curso **Backend II de Coderhouse**.

El objetivo del proyecto es construir una plataforma para la gestión de eventos e inscripciones utilizando una arquitectura por capas, aplicando buenas prácticas de diseño backend, separación de responsabilidades y reglas de negocio dentro de la capa de servicios.

En esta sexta entrega se incorpora la **entidad Event completa**, incluyendo CRUD de eventos, validaciones de negocio, control de permisos por rol (RBAC), validación de ownership, filtros avanzados, paginación, ordenamiento y pruebas automatizadas de integración.

La autenticación continúa centralizada mediante **Passport.js**, JWT y cookies HTTP Only.

---

# Tecnologías

* JavaScript (ES Modules)
* Node.js
* Express
* MongoDB Atlas
* Mongoose
* Passport.js
* passport-local
* passport-jwt
* bcrypt
* JSON Web Token (JWT)
* cookie-parser
* dotenv
* Jest
* Supertest
* pnpm

---

# Instalación

1. Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
```

2. Acceder al directorio:

```bash
cd backend-2
```

3. Instalar dependencias:

```bash
pnpm install
```

4. Crear un archivo `.env` tomando como referencia `.env.example`.

5. Completar las variables de entorno.

---

# Variables de entorno

```env
PORT=8080
NODE_ENV=development
MONGO_URL=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
JWT_EXPIRES_IN=1h
```

---

# Ejecución

Iniciar servidor:

```bash
pnpm start
```

---

# Testing

El proyecto utiliza **Jest** y **Supertest** para pruebas automatizadas de integración.

Ejecutar:

```bash
pnpm test
```

Actualmente se validan:

## Usuarios y autenticación

* Registro exitoso.
* Registro con email duplicado.
* Login correcto.
* Login con credenciales inválidas.
* Obtención del usuario autenticado.
* Logout.

## Eventos

* Creación de eventos.
* Validación de roles al crear eventos.
* Rechazo de fechas pasadas.
* Validación de capacidad.
* Listado con filtros.
* Consulta por ID.
* Modificación del evento propio.
* Bloqueo de modificación de eventos ajenos.
* Permisos administrativos.
* Cambio de estado.
* Cancelación lógica.
* Validaciones de estados inválidos.

---

# Estructura del proyecto

```text
backend-2/
├── tests/
│   ├── sessions.test.js
│   ├── events.test.js
│   └── event.model.test.js
├── src/
│   ├── config/
│   │   ├── db.js
│   │   ├── env.js
│   │   └── passport.config.js
│   ├── controllers/
│   │   ├── events.controller.js
│   │   ├── health.controller.js
│   │   └── sessions.controller.js
│   ├── dao/
│   │   ├── events.dao.js
│   │   └── users.dao.js
│   ├── middlewares/
│   │   ├── logger.middleware.js
│   │   ├── passportCurrent.middleware.js
│   │   └── authorize.middleware.js
│   ├── models/
│   │   ├── Event.js
│   │   └── User.js
│   ├── repositories/
│   │   ├── events.repository.js
│   │   └── users.repository.js
│   ├── routes/
│   │   ├── events.routes.js
│   │   ├── health.routes.js
│   │   └── sessions.routes.js
│   ├── services/
│   │   ├── events.service.js
│   │   └── sessions.service.js
│   ├── utils/
        ├── AppError.js
│   │   ├── hash.js
│   │   └── jwt.js
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── README.md
```

---

# Arquitectura

La API sigue una arquitectura por capas:

```text
Cliente
   │
   ▼
Routes
   │
   ▼
Passport / Middlewares
   │
   ▼
Controllers
   │
   ▼
Services
   │
   ▼
Repositories
   │
   ▼
DAO
   │
   ▼
MongoDB
```

Responsabilidades:

* **Routes:** definición de endpoints.
* **Middlewares:** autenticación y autorización.
* **Controllers:** manejo HTTP request/response.
* **Services:** reglas de negocio.
* **Repositories:** abstracción del acceso a datos.
* **DAO:** comunicación directa con MongoDB.

---

# Entidad Event

La entidad Event representa el núcleo de la plataforma.

Campos principales:

| Campo       | Descripción                   |
| ----------- | ----------------------------- |
| title       | Nombre del evento             |
| description | Descripción                   |
| category    | Categoría                     |
| date        | Fecha del evento              |
| location    | Ubicación                     |
| capacity    | Cantidad máxima de asistentes |
| price       | Precio                        |
| status      | Estado actual                 |
| organizer   | Referencia al usuario creador |

El campo `organizer` utiliza una referencia mediante `ObjectId` hacia User.

No se almacena el usuario completo dentro del evento.

---

# Estados del evento

Los estados permitidos son:

```text
draft
published
cancelled
finished
```

Reglas:

* Todo evento nace como `draft`.
* Un evento cancelado no puede modificarse.
* La cancelación es lógica: cambia el estado a `cancelled`.
* No se eliminan registros físicamente.

---

# Reglas de negocio de eventos

Las validaciones se encuentran en la capa `services`.

Se controla:

* Campos obligatorios.
* Fecha válida.
* Capacidad mayor a cero.
* Precio mayor o igual a cero.
* Estados permitidos.
* Ownership del evento.
* Restricción de modificaciones sobre eventos cancelados.
* Restricción de publicación de eventos finalizados.
* Restricción de publicación de eventos con fecha pasada.

---

# Autorización por roles (RBAC)

Roles disponibles:

| Rol       | Descripción                         |
| --------- | ----------------------------------- |
| user      | Usuario estándar                    |
| organizer | Puede crear y gestionar sus eventos |
| admin     | Acceso administrativo completo      |

---

# Matriz de permisos

| Acción                   | user | organizer | admin |
| ------------------------ | ---- | --------- | ----- |
| Consultar eventos        | ✅    | ✅         | ✅     |
| Crear eventos            | ❌    | ✅         | ✅     |
| Modificar evento propio  | ❌    | ✅         | ✅     |
| Modificar evento ajeno   | ❌    | ❌         | ✅     |
| Cambiar estado de evento | ❌    | ✅         | ✅     |

---

# Ownership de recursos

La plataforma implementa control de propiedad sobre eventos.

Reglas:

* Un organizer solo puede modificar sus propios eventos.
* Un admin puede modificar cualquier evento.
* Un usuario estándar no puede gestionar eventos.

La validación se realiza en la capa de servicios.

---

# Rutas disponibles

| Método | Ruta                     | Descripción               |
| ------ | ------------------------ | ------------------------- |
| GET    | `/api/health`            | Estado del servidor       |
| GET    | `/api/events`            | Listar eventos            |
| GET    | `/api/events/:id`        | Obtener evento específico |
| POST   | `/api/events`            | Crear evento              |
| PUT    | `/api/events/:id`        | Modificar evento          |
| PATCH  | `/api/events/:id/status` | Cambiar estado            |
| POST   | `/api/sessions/register` | Registrar usuario         |
| POST   | `/api/sessions/login`    | Login                     |
| GET    | `/api/sessions/current`  | Usuario autenticado       |
| POST   | `/api/sessions/logout`   | Cerrar sesión             |

---

# Listado de eventos

El endpoint:

```http
GET /api/events
```

permite filtros avanzados.

Filtros disponibles:

```text
status
category
location
dateFrom
dateTo
```

Ejemplo:

```http
/api/events?status=published&category=workshop&page=2&limit=5
```

Incluye:

```json
{
  "data": [],
  "page": 2,
  "limit": 5,
  "total": 20,
  "totalPages": 4
}
```

También permite ordenamiento:

```http
/api/events?sort=date
```

---

# Middlewares

## passportCurrent.middleware.js

Responsable de autenticación:

* Valida JWT.
* Recupera usuario desde cookie HTTP Only.
* Carga información en `req.user`.

---

## authorize.middleware.js

Responsable de autorización:

* Recibe roles permitidos.
* Compara con el rol del usuario.
* Permite o bloquea acciones.

Cuando el usuario está autenticado pero no posee permisos devuelve:

```text
403 Forbidden
```

---

# Diferencia entre 401 y 403

## 401 Unauthorized

Usuario no autenticado.

Ejemplos:

* JWT inexistente.
* JWT inválido.
* Sesión expirada.

---

## 403 Forbidden

Usuario autenticado pero sin permisos.

Ejemplos:

* Usuario intentando crear eventos.
* Organizer modificando evento ajeno.

---

# Pruebas automatizadas

Las pruebas utilizan:

* Jest.
* Supertest.

Se validan:

* Respuestas HTTP.
* Códigos de estado.
* Cookies.
* Permisos.
* Validaciones de negocio.
* Flujos completos de eventos.

---

# Estado del proyecto

Actualmente la aplicación cuenta con:

* Arquitectura backend por capas.
* Autenticación mediante Passport.js.
* JWT mediante cookies HTTP Only.
* Registro, login y sesión actual.
* Sistema RBAC.
* Ownership de recursos.
* Entidad Event completa.
* CRUD de eventos.
* Validaciones de negocio.
* Filtros y paginación.
* Ordenamiento.
* Cancelación lógica.
* Tests automatizados con Jest y Supertest.

El proyecto queda preparado para continuar con:

* Sistema de inscripciones.
* Gestión de cupos.
* Tickets.
* Notificaciones.
* Eventos de dominio.
* Nuevas estrategias OAuth.
