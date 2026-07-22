# Plataforma de CoderEventos

API REST desarrollada como proyecto del curso **Backend II** de Coderhouse.

El objetivo del proyecto es construir una plataforma para la gestión de eventos e inscripciones, utilizando una arquitectura por capas y buenas prácticas de desarrollo. En esta segunda entrega se incorpora el primer flujo seguro de registro de usuarios utilizando MongoDB, Mongoose y bcrypt.

## Tecnologías

* JavaScript (ES Modules)
* Node.js
* Express
* MongoDB Atlas
* Mongoose
* bcrypt
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
MONGO_URL=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
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
│   │   ├── db.js
│   │   └── env.js
│   ├── controllers/
│   │   ├── events.controller.js
│   │   ├── health.controller.js
│   │   └── sessions.controller.js
│   ├── dao/
│   │   ├── events.dao.js
│   │   └── users.dao.js
│   ├── middlewares/
│   │   └── logger.middleware.js
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
│   │   └── hash.js
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
MongoDB
```

Cada capa posee una responsabilidad específica, facilitando el mantenimiento, la escalabilidad y la separación de responsabilidades del proyecto.

## Registro de usuarios

Se implementó el endpoint `POST /api/sessions/register`, encargado del registro seguro de usuarios.

El endpoint espera recibir los siguientes datos:

* `first_name`
* `last_name`
* `email`
* `password`

Durante el registro se realizan las siguientes validaciones:

* Verificación de campos obligatorios.
* Validación del formato del correo electrónico.
* Validación de una longitud mínima de 8 caracteres para la contraseña.
* Normalización del correo electrónico (`trim` y `lowercase`).
* Verificación de que el email no se encuentre registrado previamente.
* Hash de la contraseña utilizando **bcrypt** antes de almacenarla en la base de datos.

Una vez registrado el usuario, la respuesta devuelve sus datos sin incluir la contraseña.

### Prueba del endpoint

El registro de usuarios puede probarse realizando una petición `POST` a:

```text
http://localhost:8080/api/sessions/register
```

enviando un cuerpo en formato JSON con los campos requeridos.

## Rutas disponibles

| Método | Ruta                     | Descripción                                   |
| ------ | ------------------------ | --------------------------------------------- |
| GET    | `/api/health`            | Verifica que el servidor se encuentra activo. |
| GET    | `/api/events`            | Devuelve la lista de eventos.                 |
| POST   | `/api/sessions/register` | Registra un nuevo usuario de forma segura.    |

## Middleware

El proyecto incluye un middleware (`logger.middleware.js`) que registra en consola el método HTTP y la URL de cada petición recibida.

## Estado del proyecto

Esta segunda entrega incorpora el registro seguro de usuarios utilizando MongoDB Atlas, Mongoose y bcrypt, manteniendo la arquitectura por capas del proyecto. Queda preparada la base para implementar en las próximas entregas el inicio de sesión, autenticación con JWT, cookies, Passport, autorización por roles y el resto de las funcionalidades de la plataforma de eventos.
