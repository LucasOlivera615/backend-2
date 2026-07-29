# Plataforma de CoderEventos

API REST desarrollada como proyecto del curso **Backend II de Coderhouse**.

El objetivo del proyecto es construir una plataforma para la gestión de eventos e inscripciones aplicando una arquitectura por capas, separación de responsabilidades y reglas de negocio centralizadas en la capa de servicios.

En esta séptima entrega se incorpora el **sistema completo de inscripciones mediante la entidad Ticket**, permitiendo gestionar asistentes, controlar cupos disponibles, cancelar inscripciones y validar reglas de negocio complejas. Además, se amplía la cobertura mediante pruebas automatizadas de integración y pruebas unitarias sobre los modelos principales.

La autenticación continúa centralizada mediante **Passport.js**, JWT y cookies HTTP Only.

---

# Tecnologías

- JavaScript (ES Modules)
- Node.js
- Express
- MongoDB Atlas
- Mongoose
- Passport.js
- passport-local
- passport-jwt
- bcrypt
- JSON Web Token (JWT)
- cookie-parser
- dotenv
- Jest
- Supertest
- pnpm
- Nodemailer

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

4. Crear un archivo `.env` utilizando como referencia `.env.example`.

5. Completar las variables de entorno.

---

# Variables de entorno

```env
PORT=8080
NODE_ENV=development

MONGO_URL=<your_mongodb_connection_string>

JWT_SECRET=<your_jwt_secret>
JWT_EXPIRES_IN=1h

MAIL_HOST=<smtp_host>
MAIL_PORT=<smtp_port>
MAIL_USER=<smtp_user>
MAIL_PASS=<smtp_password>
```

---

# Ejecución

Iniciar el servidor:

```bash
pnpm start
```

---

# Testing

El proyecto utiliza **Jest** y **Supertest** para pruebas automatizadas.

Ejecutar:

```bash
pnpm test
```

Actualmente el proyecto cuenta con 40 pruebas automatizadas entre pruebas de integración (API REST) y pruebas unitarias de modelos, desarrolladas con Jest y Supertest., cubriendo:

## Usuarios y autenticación

- Registro de usuarios.
- Registro con email duplicado.
- Inicio de sesión.
- Credenciales inválidas.
- Usuario autenticado.
- Logout.

## Eventos

- Creación de eventos.
- Validaciones de negocio.
- Validación de ownership.
- Control RBAC.
- Consulta individual.
- Listado con filtros.
- Paginación.
- Cambio de estado.
- Cancelación lógica.

## Tickets

- Inscripción a eventos publicados.
- Validación de cupos disponibles.
- Prevención de inscripciones duplicadas.
- Consulta de tickets propios.
- Consulta de asistentes por evento.
- Cancelación de tickets.
- Liberación automática de cupos.
- Permisos administrativos.

## Modelos

- Validaciones del modelo Event.
- Validaciones del modelo Ticket.

---

# Estructura del proyecto

```text
backend-2/
├── src/
│   ├── config/
│   │   ├── db.js
│   │   ├── env.js
│   │   └── passport.config.js
│   │
│   ├── controllers/
│   │   ├── events.controller.js
│   │   ├── health.controller.js
│   │   ├── sessions.controller.js
│   │   └── tickets.controller.js
│   │
│   ├── dao/
│   │   ├── events.dao.js
│   │   ├── tickets.dao.js
│   │   └── users.dao.js
│   │
│   ├── middlewares/
│   │   ├── authorize.middleware.js
│   │   ├── logger.middleware.js
│   │   └── passportCurrent.middleware.js
│   │
│   ├── models/
│   │   ├── Event.js
│   │   ├── Ticket.js
│   │   └── User.js
│   │
│   ├── repositories/
│   │   ├── events.repository.js
│   │   ├── sessions.repository.js
│   │   ├── tickets.repository.js
│   │   └── users.repository.js
│   │
│   ├── routes/
│   │   ├── events.routes.js
│   │   ├── health.routes.js
│   │   ├── sessions.routes.js
│   │   └── tickets.routes.js
│   │
│   ├── services/
│   │   ├── events.service.js
│   │   ├── mail.service.js
│   │   ├── sessions.service.js
│   │   └── tickets.service.js
│   │
│   ├── utils/
│   │   ├── AppError.js
│   │   ├── hash.js
│   │   └── jwt.js
│   │
│   ├── app.js
│   └── server.js
│
├── tests/
│   ├── event.model.test.js
│   ├── events.test.js
│   ├── sessions.test.js
│   ├── ticket.model.test.js
│   └── tickets.test.js
│
├── .env.example
├── .gitignore
├── jest.config.js
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── README.md
```

---

# Arquitectura

La aplicación sigue una arquitectura por capas.

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

Cada capa posee una responsabilidad específica:

- **Routes:** definición de endpoints.
- **Middlewares:** autenticación y autorización.
- **Controllers:** manejo de las peticiones HTTP.
- **Services:** reglas de negocio.
- **Repositories:** encapsulan el acceso a los DAO y desacoplan la lógica de negocio de la persistencia.
- **DAO:** interacción directa con MongoDB.

---

# Entidades

## User

Representa a los usuarios registrados.

Cada usuario posee un rol que determina los permisos disponibles dentro de la plataforma.

Roles disponibles:

- user
- organizer
- admin

---

## Event

Representa un evento organizado dentro de la plataforma.

Campos principales:

| Campo | Descripción |
|--------|-------------|
| title | Nombre del evento |
| description | Descripción |
| category | Categoría |
| date | Fecha |
| location | Ubicación |
| capacity | Cupos disponibles |
| price | Precio |
| status | Estado del evento |
| organizer | Usuario creador |

Estados permitidos:

```text
draft
published
cancelled
finished
```

---

## Ticket

Cada Ticket representa una inscripción individual de un usuario a un evento y mantiene la referencia tanto al usuario como al evento correspondiente.

Campos principales:

| Campo | Descripción |
|--------|-------------|
| user | Usuario inscripto |
| event | Evento |
| quantity | Cantidad de entradas |
| total | Precio total |
| status | Estado del ticket |

Estados permitidos:

```text
confirmed
cancelled
```

---

# Reglas de negocio

## Eventos

La capa de servicios valida:

- Campos obligatorios.
- Fechas válidas.
- Capacidad mayor a cero.
- Precio mayor o igual a cero.
- Estados permitidos.
- Ownership.
- Restricción de modificaciones sobre eventos cancelados.
- Restricción para publicar eventos finalizados.
- Restricción para publicar eventos con fecha pasada.

---

## Tickets

La capa de servicios valida:

- Usuario autenticado.
- Evento publicado.
- Cupos disponibles.
- Inscripción única por usuario.
- Actualización automática de los cupos disponibles del evento.
- Cancelación de tickets.
- Liberación de cupos al cancelar.
- Permisos de cancelación.

---

# Autorización por roles (RBAC)

| Acción | user | organizer | admin |
|--------|------|-----------|-------|
| Consultar eventos | ✅ | ✅ | ✅ |
| Crear eventos | ❌ | ✅ | ✅ |
| Modificar eventos propios | ❌ | ✅ | ✅ |
| Modificar cualquier evento | ❌ | ❌ | ✅ |
| Crear tickets | ✅ | ✅ | ✅ |
| Cancelar ticket propio | ✅ | ✅ | ✅ |
| Cancelar cualquier ticket | ❌ | ❌ | ✅ |
| Consultar asistentes de un evento | ❌ | ✅ (propios) | ✅ |

---

# Ownership

La plataforma implementa control de propiedad sobre los recursos.

### Eventos

- Un organizer solamente puede modificar sus propios eventos.
- Un Admin puede modificar cualquier evento.

### Tickets

- Cada usuario puede cancelar únicamente sus propios tickets.
- Un Admin puede cancelar cualquier ticket.

---

# Rutas principales

## Health

| Método | Ruta |
|---------|------|
| GET | `/api/health` |

---

## Sessions

| Método | Ruta |
|---------|------|
| POST | `/api/sessions/register` |
| POST | `/api/sessions/login` |
| GET | `/api/sessions/current` |
| POST | `/api/sessions/logout` |

---

## Events

| Método | Ruta |
|---------|------|
| GET | `/api/events` |
| GET | `/api/events/:id` |
| POST | `/api/events` |
| PUT | `/api/events/:id` |
| PATCH | `/api/events/:id/status` |

---

## Tickets

| Método | Ruta |
|---------|------|
| POST | `/api/events/:id/tickets` |
| GET | `/api/events/:id/tickets` |
| GET | `/api/tickets/my-tickets` |
| PATCH | `/api/tickets/:id/cancel` |

---

# Filtros y paginación

El endpoint:

```http
GET /api/events
```

permite utilizar filtros como:

- status
- category
- location
- dateFrom
- dateTo

También soporta:

- paginación
- límite de resultados
- ordenamiento

Ejemplo:

```http
GET /api/events?status=published&category=workshop&page=1&limit=5&sort=date
```

---

# Middlewares

## passportCurrent.middleware.js

Responsable de:

- Validar JWT.
- Recuperar el usuario autenticado.
- Cargar `req.user`.

---

## authorize.middleware.js

Responsable de:

- Validar roles permitidos.
- Autorizar o rechazar acciones protegidas.

---

## logger.middleware.js

Registra el método HTTP y la URL de cada petición recibida.

---

# Manejo de errores

Las reglas de negocio generan errores controlados mediante AppError, permitiendo responder con códigos HTTP adecuados y mensajes consistentes desde la capa de servicios.

---

# Estado del proyecto

Actualmente la aplicación cuenta con:

- Arquitectura backend por capas.
- Autenticación mediante Passport.js.
- JWT utilizando cookies HTTP Only.
- Registro e inicio de sesión.
- Sistema RBAC.
- Ownership de recursos.
- Gestión completa de eventos.
- Gestión completa de tickets.
- Control automático de cupos.
- Validaciones de negocio centralizadas.
- Persistencia mediante MongoDB Atlas.
- 40 pruebas automatizadas entre integración y modelos.
- Arquitectura Repository + DAO.
- Cobertura de pruebas sobre modelos y API REST.

El proyecto queda preparado para futuras mejoras como notificaciones por correo, documentación mediante Swagger/OpenAPI, integración con proveedores OAuth y nuevas funcionalidades orientadas a la gestión integral de eventos.