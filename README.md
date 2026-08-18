# Plataforma de CoderEventos

API REST desarrollada como proyecto del curso **Backend II de Coderhouse**.

La aplicación permite gestionar usuarios, eventos e inscripciones mediante tickets, incorporando autenticación, autorización por roles, validaciones de negocio y persistencia con MongoDB.

El proyecto utiliza una arquitectura por capas basada en **DAO, Repository, Service, Controller y DTO**, buscando separar responsabilidades y mantener la lógica de negocio desacoplada de la persistencia.

---

## Tecnologías

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- Passport.js
- passport-local
- passport-jwt
- JWT
- bcrypt
- cookie-parser
- dotenv
- Nodemailer
- Jest
- Supertest
- pnpm

---

## Instalación

Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
cd backend-2

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
MAIL_FROM=CoderEventos <example@gmail.com>
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

Actualmente el proyecto cuenta con 40 pruebas automatizadas entre pruebas de integración (API REST) y pruebas unitarias de modelos, desarrolladas con Jest y Supertest.

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
│   ├── dto/
│   │   ├── event.dto.js
│   │   ├── ticket.dto.js
│   │   └── user.dto.js
│   │
│   ├── middlewares/
│   │   ├── authorize.middleware.js
│   │   ├── error.middleware.js
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
- **DTO:** controlan la información que se expone en las respuestas de la API.
- **Models:** definen los esquemas y estructuras persistidas en MongoDB.

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

# Manejo de errores

Las reglas de negocio generan errores controlados mediante AppError, permitiendo responder con códigos HTTP adecuados y mensajes consistentes desde la capa de servicios.

---

# Middlewares

Autenticación, autorización, logging y manejo de errores.

---

## Estado

Proyecto correspondiente a la **Pre-entrega 8: Arquitectura con DAO, Repository y DTO**.

Todos los tests automatizados pasan correctamente.