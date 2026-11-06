# CRMSemaddNicaragua

Backend en desarrollo para un sistema CRM. Actualmente incluye un servidor con Express y un esquema de datos de Prisma para SQLite.

## Requisitos

- Node.js 22 LTS o posterior.
- npm (se instala junto con Node.js).

## Instalación

Desde la carpeta del proyecto, instala las dependencias registradas en el archivo de bloqueo:

```powershell
npm ci
```

La configuración de Prisma importa `dotenv/config`, pero `dotenv` todavía no está declarado en `package.json`. Instálalo para poder usar esa configuración:

```powershell
npm install dotenv
```

Dependencias principales:

- **Express** (`express`): servidor HTTP y rutas.
- **CORS** (`cors`): permite solicitudes desde otros orígenes.
- **Prisma ORM para SQLite** (`@prisma/orm-sqlite`): integración ORM con SQLite.
- **Prisma CLI** (`prisma`, dependencia de desarrollo): herramientas de configuración y gestión de Prisma.
- **Nodemon** (`nodemon`): reinicia el servidor cuando detecta cambios durante el desarrollo.
- **dotenv**: carga variables de entorno usadas por la configuración de Prisma.

## Configuración de la base de datos

Crea un archivo `.env` en la raíz del proyecto y define la URL de SQLite:

```env
DATABASE_URL="file:./dev.db"
```

La configuración de Prisma está en `prisma.config.ts` y el esquema está en `src/prisma/contract.prisma`.

> El servidor actual todavía no realiza consultas a la base de datos; esta configuración prepara Prisma, pero no activa por sí sola el acceso a SQLite.

## Iniciar el servidor

```powershell
npm run start
```

El servidor escucha en el puerto `3000`. Al abrir `http://localhost:3000/`, responde `Hello, World!`.

