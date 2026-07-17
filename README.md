# Plataforma de CoderEventos

API REST desarrollada como proyecto del curso **Backend II** de Coderhouse.

El objetivo del proyecto es construir una plataforma para la gestión de eventos e inscripciones, utilizando una arquitectura por capas y buenas prácticas de desarrollo. En las próximas entregas se incorporarán funcionalidades como autenticación, autorización, gestión de eventos, control de cupos e inscripciones.

## Tecnologías

* JavaScript (ES Modules)
* Node.js
* Express
* dotenv
* pnpm

## Instalación

1. Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
```

2. Acceder al directorio del proyecto:

```bash
cd backend-2
```

3. Instalar las dependencias:

```bash
pnpm install
```

4. Crear un archivo `.env` tomando como base el archivo `.env.example`.

5. Completar las variables de entorno necesarias.

## Variables de entorno

El proyecto utiliza las siguientes variables:

```env
PORT=8080
NODE_ENV=development
MONGO_URL=mongodb://localhost:27017/events_db
JWT_SECRET=your_jwt_secret_here
```

## Ejecución

Iniciar el servidor con:

```bash
pnpm start
```

## Estructura del proyecto

```text
backend-2/
├── src/
│   ├── config/
│   │   └── env.js
│   ├── controllers/
│   │   ├── events.controller.js
│   │   ├── health.controller.js
│   │   └── sessions.controller.js
│   ├── dao/
│   │   └── events.dao.js
│   ├── middlewares/
│   │   └── logger.middleware.js
│   ├── models/
│   │   ├── Event.js
│   │   └── User.js
│   ├── repositories/
│   │   └── events.repository.js
│   ├── routes/
│   │   ├── events.routes.js
│   │   ├── health.routes.js
│   │   └── sessions.routes.js
│   ├── services/
│   │   └── events.service.js
│   ├── utils/
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
├── pnpm-lock.yaml
└── README.md
```

## Arquitectura

La API está organizada siguiendo una arquitectura por capas:

```text
Cliente
   │
   ▼
Routes
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
Fuente de datos
```

Cada capa posee una responsabilidad específica, facilitando el mantenimiento, la escalabilidad y la separación de responsabilidades del proyecto.

## Rutas disponibles

| Método | Ruta            | Descripción                                   |
| ------ | --------------- | --------------------------------------------- |
| GET    | `/api/health`   | Verifica que el servidor se encuentra activo. |
| GET    | `/api/events`   | Devuelve la lista de eventos.                 |
| GET    | `/api/sessions` | Ruta base para sesiones (estructura inicial). |

## Middleware

Actualmente el proyecto incluye un middleware de ejemplo (`logger.middleware.js`) que registra en consola el método HTTP y la URL de cada petición recibida.

## Estado del proyecto

Esta primera entrega implementa la estructura base de la API, organizada mediante una arquitectura por capas. Se incluyen las capas de rutas, controladores, servicios, repositorios, DAO, modelos, middlewares y configuración, dejando preparada la base para incorporar en futuras entregas la persistencia con MongoDB, autenticación mediante JWT, autorización, gestión de eventos e inscripciones.
