# Plataforma de CoderEventos

API REST desarrollada como proyecto del curso **Backend II** de Coderhouse.

El objetivo del proyecto es construir una plataforma para la gestión de eventos e inscripciones, utilizando una arquitectura por capas y buenas prácticas de desarrollo. En esta cuarta entrega se refactoriza el sistema de autenticación incorporando **Passport.js**, centralizando las estrategias de registro, inicio de sesión y autenticación del usuario actual, manteniendo el uso de JWT y cookies HTTP Only.

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
* pnpm

---

# Instalación

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

---

# Variables de entorno

El proyecto utiliza las siguientes variables:

```env
PORT=8080
NODE_ENV=development
MONGO_URL=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
JWT_EXPIRES_IN=1h
```

---

# Ejecución

Iniciar el servidor con:

```bash
pnpm start
```

---

# Estructura del proyecto

```text
backend-2/
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

La API está organizada siguiendo una arquitectura por capas:

```text
Cliente
   │
   ▼
Routes
   │
   ▼
Passport
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

---

# Autenticación

La autenticación fue centralizada mediante **Passport.js**, manteniendo JWT y cookies HTTP Only para la identificación del usuario.

## Estrategias implementadas

### register

Se encarga del registro de nuevos usuarios realizando:

* Validación de campos obligatorios.
* Validación del formato del correo electrónico.
* Normalización del email (`trim` y `lowercase`).
* Verificación de email duplicado.
* Hash de la contraseña utilizando **bcrypt**.
* Asignación del rol por defecto (`user`).

---

### login

Valida las credenciales del usuario utilizando Passport.

Si las credenciales son correctas:

* Se autentica el usuario.
* El controlador genera un JWT.
* El JWT se almacena en una cookie HTTP Only llamada `currentUser`.

En caso de error siempre responde con el mensaje:

```text
Credenciales inválidas
```

---

### current

Protege la ruta del usuario autenticado.

La estrategia:

* Lee el JWT desde la cookie `currentUser`.
* Verifica la firma y expiración del token.
* Coloca los datos del usuario en `req.user`.

Si el token no existe o no es válido, responde con:

```json
{
  "status": "error",
  "message": "No autenticado"
}
```

---

# Rutas disponibles

| Método | Ruta                     | Descripción                                   |
| ------ | ------------------------ | --------------------------------------------- |
| GET    | `/api/health`            | Verifica que el servidor se encuentra activo. |
| GET    | `/api/events`            | Devuelve la lista de eventos.                 |
| POST   | `/api/sessions/register` | Registra un nuevo usuario.                    |
| POST   | `/api/sessions/login`    | Autentica al usuario y genera el JWT.         |
| GET    | `/api/sessions/current`  | Devuelve el usuario autenticado.              |
| POST   | `/api/sessions/logout`   | Cierra la sesión del usuario.                 |

Estas rutas pueden probarse utilizando herramientas como **Postman** o **Thunder Client** enviando solicitudes HTTP al servidor local (`http://localhost:8080`). Los endpoints de registro y login reciben los datos en formato JSON, mientras que las rutas protegidas utilizan la cookie HTTP Only generada automáticamente durante la autenticación.

---

# Middlewares

Actualmente el proyecto utiliza:

* **logger.middleware.js**: registra el método HTTP y la URL de cada petición recibida.
* **Passport.js**: centraliza la autenticación mediante las estrategias `register`, `login` y `current`.

---

# Preparado para futuras estrategias

La configuración de Passport fue centralizada en `src/config/passport.config.js`, permitiendo incorporar nuevas estrategias de autenticación (como Google, GitHub u otros proveedores OAuth) sin modificar `app.js` ni la estructura principal de la aplicación.

---

# Estado del proyecto

Esta cuarta entrega incorpora Passport.js como capa de autenticación, centralizando las estrategias de registro, inicio de sesión y usuario autenticado. La aplicación mantiene el uso de JWT y cookies HTTP Only y queda preparada para incorporar autorización por roles, autenticación con proveedores externos (como Google o GitHub), gestión de eventos, inscripciones y el resto de funcionalidades previstas para la plataforma.
