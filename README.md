Plataforma de CoderEventos

API REST desarrollada como proyecto del curso Backend II de Coderhouse.

El objetivo del proyecto es construir una plataforma para la gestión de eventos e inscripciones, utilizando una arquitectura por capas y buenas prácticas de desarrollo. En esta tercera entrega se incorpora autenticación de usuarios mediante JWT y cookies HTTP Only, manteniendo el registro seguro implementado en la entrega anterior.

Tecnologías
JavaScript (ES Modules)
Node.js
Express
MongoDB Atlas
Mongoose
bcrypt
JSON Web Token (JWT)
cookie-parser
dotenv
pnpm
Instalación
Clonar el repositorio:
git clone <URL_DEL_REPOSITORIO>
Acceder al directorio del proyecto:
cd backend-2
Instalar las dependencias:
pnpm install
Crear un archivo .env tomando como base el archivo .env.example.
Completar las variables de entorno necesarias.
Variables de entorno

El proyecto utiliza las siguientes variables:

PORT=8080
NODE_ENV=development
MONGO_URL=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
JWT_EXPIRES_IN=1h
Ejecución

Iniciar el servidor con:

pnpm start
Estructura del proyecto
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
│   │   ├── auth.middleware.js
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
Arquitectura

La API está organizada siguiendo una arquitectura por capas:

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

Cada capa posee una responsabilidad específica, facilitando el mantenimiento, la escalabilidad y la separación de responsabilidades del proyecto.

Autenticación de usuarios

La aplicación permite registrar usuarios, iniciar sesión y consultar el usuario autenticado mediante JWT almacenado en una cookie HTTP Only.

Registro

POST /api/sessions/register

El endpoint espera recibir:

first_name
last_name
email
password

Durante el registro se realizan las siguientes validaciones:

Verificación de campos obligatorios.
Validación del formato del correo electrónico.
Longitud mínima de 8 caracteres para la contraseña.
Normalización del correo electrónico (trim y lowercase).
Verificación de email duplicado.
Hash de la contraseña utilizando bcrypt.

La respuesta devuelve los datos del usuario sin incluir la contraseña.

Login

POST /api/sessions/login

Recibe:

email
password

Si las credenciales son válidas:

Se compara la contraseña utilizando bcrypt.
Se genera un JWT con la información básica del usuario.
El token se almacena en una cookie HTTP Only llamada currentUser.
Usuario autenticado

GET /api/sessions/current

Ruta protegida mediante un middleware de autenticación que verifica el JWT almacenado en la cookie.

Si el usuario está autenticado, devuelve:

id
email
role
Logout

POST /api/sessions/logout

Elimina la cookie de autenticación y cierra la sesión del usuario.

Rutas disponibles
Método	Ruta	Descripción
GET	/api/health	Verifica que el servidor se encuentra activo.
GET	/api/events	Devuelve la lista de eventos.
POST	/api/sessions/register	Registra un nuevo usuario.
POST	/api/sessions/login	Inicia sesión y genera el JWT.
GET	/api/sessions/current	Devuelve el usuario autenticado.
POST	/api/sessions/logout	Cierra la sesión del usuario.
Middleware

Actualmente el proyecto incluye los siguientes middlewares:

logger.middleware.js: registra el método HTTP y la URL de cada petición recibida.
auth.middleware.js: protege las rutas privadas verificando el JWT almacenado en la cookie de autenticación.
Estado del proyecto

Esta tercera entrega incorpora autenticación completa mediante JWT y cookies HTTP Only, manteniendo el registro seguro implementado anteriormente. El proyecto queda preparado para incorporar Passport, autorización por roles, gestión de eventos, inscripciones y el resto de funcionalidades previstas para la plataforma.