# Plataforma de CoderEventos

API REST desarrollada como proyecto del curso **Backend II** de Coderhouse.

El objetivo del proyecto es construir una plataforma para la gestión de eventos e inscripciones, utilizando una arquitectura por capas y buenas prácticas de desarrollo. En las próximas entregas se incorporarán funcionalidades como autenticación, autorización, gestión de eventos, control de cupos e inscripciones.

## Tecnologías

- JavaScript (ES Modules)
- Node.js
- Express
- pnpm

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

Si no agregaste el script `start` al `package.json`, también podés ejecutar:

```bash
node ./src/server.js
```

## Estructura del proyecto

```text
src/
├── config/
├── controllers/
├── dao/
├── middlewares/
├── models/
├── repositories/
├── routes/
├── services/
├── utils/
├── app.js
└── server.js
```

## Rutas disponibles

- metodo: GET, ruta: `/api/health`, descripción: Verifica que el servidor se encuentra activo.
- metodo: GET, ruta: `/api/events`, descripción: Devuelve la lista de eventos (actualmente vacía).
- metodo: GET, ruta: `/api/sessions`, descripción: Ruta base de sesiones (estructura inicial, sin autenticación).

## Estado del proyecto

Esta primera entrega implementa la estructura base de la API y la arquitectura por capas. Las próximas entregas incorporarán autenticación con JWT, manejo de usuarios, gestión de eventos, inscripciones, control de cupos y persistencia de datos.