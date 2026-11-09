# CRMSemaddNicaragua

API REST para el CRM, construida con Express y Prisma ORM para SQLite.

## Requisitos e inicio

- Node.js 22 LTS o posterior.
- Instalar dependencias con `npm ci`.
- Configurar `DATABASE_URL` en `.env`, por ejemplo `DATABASE_URL="file:./dev.db"`.
- Iniciar con `npm run start` (Nodemon) o `npm run dev`.

El servidor usa el puerto `3000` por defecto; se puede cambiar con `PORT`. La ruta `GET /` responde con el estado de la API.

## Pruebas en Postman

Usa `http://localhost:3000` como URL base. Para enviar datos, selecciona **Body → raw → JSON** y agrega el encabezado `Content-Type: application/json`.

| Recurso | Ruta base | Operaciones |
| --- | --- | --- |
| Usuarios | `/api/users` | GET, POST, GET `/:id`, PATCH `/:id`, DELETE `/:id` (desactiva), DELETE `/:id/permanent` |
| Empresas | `/api/enterprises` | GET, POST, GET `/:id`, PATCH `/:id`, DELETE `/:id` |
| Usuarios de empresa | `/api/user-enterprises` | GET, POST, GET `/:id`, PATCH `/:id`, DELETE `/:id` |
| Clientes | `/api/clients` | GET, POST, GET `/:id`, PATCH `/:id`, DELETE `/:id` |
| Conversaciones | `/api/conversations` | GET, POST, GET `/:id`, PATCH `/:id`, DELETE `/:id` |
| Detalles de conversación | `/api/detail-conversations` | GET, POST, GET `/:id`, PATCH `/:id`, DELETE `/:id` |
| Tareas | `/api/tasks` | GET, POST, GET `/:id`, PATCH `/:id`, DELETE `/:id` |

Las rutas POST requieren:

- **Usuarios:** `name`, `email`, `password`. `role` y `state` son opcionales.
- **Empresas:** `nameenterprise`, `country`, `userId`.
- **Usuarios de empresa:** `userId`, `enterpriseId`, `fullName`, `email`, `username`, `password`. `role` y `state` son opcionales.
- **Clientes:** `fullName`, `telephone`, `classification`, `summary`, `empresaId`.
- **Conversaciones:** `clientId`, `userId`, `enterpriseId`, `message`, `canal`. `state` es opcional.
- **Detalles de conversación:** `conversationId`, `message`, `typeagent`, `userenterpriseId`, `content`. `state` es opcional.
- **Tareas:** `title`, `description`, `userenterpriseId`, `clientId`, `fechadeVencimiento`. La fecha debe ser válida; `priority` y `state` son opcionales.

Debido a las relaciones entre registros, crea los datos en este orden para una prueba completa: usuario → empresa → usuario de empresa y cliente → conversación → detalle de conversación y tarea. Usa los IDs devueltos por las respuestas POST como claves foráneas en las solicitudes siguientes.
