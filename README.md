# CoderEventos

API REST desarrollada como proyecto final del curso **Backend II de Coderhouse**.

Plataforma para la gestión de eventos e inscripciones. Los usuarios pueden registrarse, autenticarse y adquirir tickets para eventos, mientras que los organizadores pueden crear y administrar sus eventos y los administradores poseen permisos globales.

---

## Tecnologías

* Node.js + Express
* MongoDB Atlas + Mongoose
* Passport.js + JWT
* bcrypt
* cookie-parser
* Nodemailer
* Jest + Supertest
* pnpm

---

## Instalación

```bash
git clone <URL_DEL_REPOSITORIO>
cd backend-2
pnpm install
```

Crear un archivo `.env` a partir de `.env.example`:

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

## Ejecución

Iniciar el servidor:

```bash
pnpm start
```

Por defecto, la API utiliza el puerto definido en `PORT`.

---

## Testing

Ejecutar todos los tests:

```bash
pnpm test
```

Estado actual:

```text
Test Suites: 5 passed, 5 total
Tests:       40 passed, 40 total
```

Los tests cubren modelos, eventos, autenticación, autorización e inscripciones mediante tickets.

---

# Arquitectura

El proyecto utiliza una **arquitectura por capas**:

```text
Cliente
   │
   ▼
Routes
   │
   ▼
Middlewares / Passport
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

### Responsabilidades

| Capa         | Responsabilidad                                |
| ------------ | ---------------------------------------------- |
| Routes       | Define los endpoints                           |
| Middlewares  | Autenticación, autorización, logging y errores |
| Controllers  | Maneja HTTP y respuestas                       |
| Services     | Contiene las reglas de negocio                 |
| Repositories | Abstracción entre Services y DAO               |
| DAO          | Acceso a MongoDB mediante Mongoose             |
| Models       | Esquemas de MongoDB                            |
| DTO          | Controla la información expuesta por la API    |

La regla principal es que los **Services trabajan con Repositories y no directamente con los DAO**.

---

# Estructura

```text
src/
├── config/          # DB, variables de entorno y Passport
├── controllers/     # Controladores HTTP
├── dao/             # Acceso a datos
├── dto/             # Data Transfer Objects
├── middlewares/     # Auth, RBAC, logging y errores
├── models/          # Modelos Mongoose
├── repositories/    # Abstracción de persistencia
├── routes/          # Endpoints
├── services/        # Lógica de negocio
├── utils/           # Errores, hash y JWT
├── app.js
└── server.js

tests/
├── event.model.test.js
├── events.test.js
├── sessions.test.js
├── ticket.model.test.js
└── tickets.test.js
```

---

# Autenticación

La autenticación utiliza **Passport.js + JWT**.

El JWT se almacena en una cookie HTTP-only llamada:

```text
currentUser
```

Principales operaciones:

```http
POST /api/sessions/register
POST /api/sessions/login
GET  /api/sessions/current
POST /api/sessions/logout
```

Las contraseñas se almacenan utilizando `bcrypt`.

---

# Autorización (RBAC)

La aplicación utiliza tres roles:

* `user`
* `organizer`
* `admin`

| Acción                     | user | organizer | admin |
| -------------------------- | :--: | :-------: | :---: |
| Consultar eventos          |   ✅  |     ✅     |   ✅   |
| Crear eventos              |   ❌  |     ✅     |   ✅   |
| Modificar eventos propios  |   ❌  |     ✅     |   ✅   |
| Modificar cualquier evento |   ❌  |     ❌     |   ✅   |
| Crear tickets              |   ✅  |     ✅     |   ✅   |
| Cancelar ticket propio     |   ✅  |     ✅     |   ✅   |
| Cancelar cualquier ticket  |   ❌  |     ❌     |   ✅   |
| Consultar asistentes       |   ❌  |  Propios  | Todos |

La autorización se implementa mediante el middleware `authorize`.

Además, las operaciones sensibles verifican la **propiedad del recurso**. Por ejemplo, un `organizer` solo puede modificar sus propios eventos.

---

# Eventos

Endpoints principales:

```http
GET   /api/events
GET   /api/events/:id
POST  /api/events
PUT   /api/events/:id
PATCH /api/events/:id/status
```

El listado de eventos permite:

* Filtrar por estado, categoría, ubicación y fechas.
* Paginar resultados.
* Definir límite de resultados.
* Ordenar resultados.

Ejemplo:

```http
GET /api/events?status=published&category=workshop&page=1&limit=5&sort=date
```

Los eventos se crean inicialmente con estado:

```text
draft
```

y pueden ser publicados posteriormente.

---

# Tickets e inscripciones

Los usuarios autenticados pueden inscribirse a eventos publicados:

```http
POST /api/events/:id/tickets
```

Ejemplo:

```json
{
    "quantity": 1
}
```

El sistema verifica:

* Existencia del evento.
* Estado `published`.
* Cantidad solicitada.
* Cupos disponibles.
* Que el usuario no tenga otra inscripción activa.

Cada inscripción genera un `reservationCode` único.

Endpoints:

```http
POST  /api/events/:id/tickets
GET   /api/events/:id/tickets
GET   /api/tickets/my-tickets
PATCH /api/tickets/:id/cancel
```

Las cancelaciones no eliminan el ticket de MongoDB. El estado cambia de `confirmed` a `cancelled` y se registra `cancelledAt`.

Los tickets cancelados dejan de ocupar capacidad del evento.

---

# Emails

Al confirmar una inscripción, la aplicación intenta enviar un email de confirmación mediante **Nodemailer**.

La configuración SMTP se realiza mediante variables de entorno.

---

# Manejo de errores

Los errores de negocio se gestionan mediante `AppError` y un middleware global.

Principales códigos utilizados:

| HTTP | Situación           |
| ---: | ------------------- |
|  400 | Datos inválidos     |
|  401 | No autenticado      |
|  403 | Sin permisos        |
|  404 | Recurso inexistente |
|  409 | Recurso duplicado   |

---

# Health Check

Para comprobar que el servidor está funcionando:

```http
GET /api/health
```

---

# Estado del proyecto

**Proyecto final — Backend II, Coderhouse**

CoderEventos es una API REST desarrollada como proyecto final del curso, implementando una arquitectura por capas y aplicando los principales conceptos trabajados durante el curso.

Actualmente cuenta con:

* Arquitectura por capas.
* Persistencia con MongoDB y Mongoose.
* DAO y Repository.
* Services con reglas de negocio.
* DTO para controlar las respuestas.
* Autenticación con Passport y JWT.
* Autorización basada en roles (RBAC).
* Gestión de eventos.
* Sistema de inscripciones mediante tickets.
* Cancelación de inscripciones.
* Generación de códigos de reserva.
* Envío de emails de confirmación.
* Filtros, paginación y ordenamiento.
* Manejo centralizado de errores.
* Tests automatizados.

### Tests

```text
Test Suites: 5 passed, 5 total
Tests:       40 passed, 40 total
```

Todos los tests automatizados pasan correctamente.