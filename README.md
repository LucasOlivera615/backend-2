# Plataforma de CoderEventos

API REST desarrollada como proyecto del curso **Backend II** de Coderhouse.

El objetivo del proyecto es construir una plataforma para la gestión de eventos e inscripciones, utilizando una arquitectura por capas y buenas prácticas de desarrollo.

En esta quinta entrega se incorpora un sistema de **autorización basada en roles (RBAC)** y validación de propiedad de recursos (**Ownership**), manteniendo la autenticación centralizada mediante **Passport.js**, JWT y cookies HTTP Only.

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

Cada capa posee una responsabilidad específica, facilitando el mantenimiento, la escalabilidad y la separación de responsabilidades del proyecto.

---

# Autenticación

La autenticación fue centralizada mediante **Passport.js**, manteniendo JWT y cookies HTTP Only para la identificación del usuario.

## Estrategias implementadas

### register

Gestiona el registro de usuarios mediante Passport.

Realiza:

* Validación de campos obligatorios.
* Validación del formato del correo electrónico.
* Normalización del email (`trim` y `lowercase`).
* Verificación de email duplicado.
* Hash de la contraseña utilizando **bcrypt**.
* Asignación del rol por defecto (`user`).

El registro público no permite asignar roles privilegiados (`admin` u `organizer`) desde el body.

---

### login

Valida las credenciales utilizando Passport.

Si son correctas:

* Se autentica el usuario.
* El controlador genera el JWT.
* El token se almacena en una cookie HTTP Only llamada `currentUser`.

Las credenciales inválidas responden con:

```text
Credenciales inválidas
```

---

### current

Permite obtener la identidad del usuario autenticado.

La estrategia:

* Extrae el JWT desde la cookie `currentUser`.
* Verifica firma y expiración.
* Coloca la información del usuario en `req.user`.

Cuando no existe una sesión válida responde con:

```json
{
  "status": "error",
  "message": "No autenticado"
}
```

---

# Autorización por roles (RBAC)

El sistema incorpora autorización basada en roles mediante un middleware reutilizable.

Los roles disponibles son:

| Rol       | Descripción                         |
| --------- | ----------------------------------- |
| user      | Usuario estándar                    |
| organizer | Puede gestionar sus propios eventos |
| admin     | Tiene permisos globales             |

---

# Matriz de permisos

| Acción                       | user | organizer | admin |
| ---------------------------- | ---- | --------- | ----- |
| Consultar eventos publicados | ✅    | ✅         | ✅     |
| Crear eventos                | ❌    | ✅         | ✅     |
| Modificar eventos propios    | ❌    | ✅         | ✅     |
| Modificar cualquier evento   | ❌    | ❌         | ✅     |
| Ver todos los usuarios       | ❌    | ❌         | ✅     |

---

# Ownership de recursos

Además del control por roles, se implementa validación de propiedad sobre los eventos.

Reglas:

* Un `organizer` solamente puede modificar eventos donde sea propietario.
* Un `admin` puede modificar cualquier evento.
* Un usuario no puede modificar eventos.

La validación se realiza en la capa de servicios, evitando duplicar lógica de permisos dentro de las rutas.

---

# Rutas disponibles

| Método | Ruta                     | Descripción                          |
| ------ | ------------------------ | ------------------------------------ |
| GET    | `/api/health`            | Verifica que el servidor está activo |
| GET    | `/api/events`            | Consulta eventos                     |
| POST   | `/api/events`            | Crea eventos (organizer/admin)       |
| PUT    | `/api/events/:id`        | Modifica eventos según permisos      |
| POST   | `/api/sessions/register` | Registra usuarios                    |
| POST   | `/api/sessions/login`    | Autentica usuarios                   |
| GET    | `/api/sessions/current`  | Obtiene usuario autenticado          |
| POST   | `/api/sessions/logout`   | Cierra sesión                        |

---

# Middlewares

Actualmente el proyecto utiliza:

### passportCurrent.middleware.js

Responsable de autenticación.

Funciones:

* Validar el JWT almacenado en cookie.
* Recuperar el usuario autenticado.
* Cargar información en `req.user`.
* Responder `401 Unauthorized` cuando no existe una sesión válida.

---

### authorize.middleware.js

Responsable de autorización.

Funciones:

* Recibir roles permitidos.
* Comparar el rol del usuario autenticado.
* Permitir o rechazar acciones.

Responde:

```text
403 Forbidden
```

cuando el usuario está autenticado pero no posee permisos suficientes.

---

### logger.middleware.js

Registra el método HTTP y la URL de cada petición recibida.

---

# Diferencia entre 401 y 403

## 401 Unauthorized

Se utiliza cuando el usuario no está autenticado.

Ejemplos:

* No existe cookie `currentUser`.
* JWT inválido.
* JWT expirado.

---

## 403 Forbidden

Se utiliza cuando el usuario está autenticado pero no tiene permisos.

Ejemplos:

* Usuario `user` intentando crear eventos.
* Organizer intentando modificar un evento ajeno.

---

# Preparado para futuras estrategias

La configuración de Passport fue centralizada en:

```text
src/config/passport.config.js
```

Esto permite agregar nuevas estrategias de autenticación (Google, GitHub u otros proveedores OAuth) sin modificar `app.js` ni la estructura principal de la aplicación.

---

# Estado del proyecto

Esta quinta entrega incorpora un sistema completo de autenticación y autorización profesional.

La aplicación cuenta con:

* Autenticación mediante Passport.js.
* JWT almacenado en cookies HTTP Only.
* Estrategias centralizadas de registro, login y usuario actual.
* Control de acceso basado en roles.
* Validación de propiedad de recursos.
* Protección de rutas sensibles.

El proyecto queda preparado para continuar con funcionalidades como gestión avanzada de eventos, inscripciones, persistencia completa de recursos y nuevas estrategias de autenticación externas.
