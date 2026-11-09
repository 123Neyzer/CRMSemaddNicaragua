# Guía de pruebas de la API con Postman

Esta guía cubre las rutas disponibles en la API y propone un recorrido completo con registros relacionados entre sí.

## 1. Preparar el servidor y Postman

1. En la raíz del proyecto, configura `DATABASE_URL` en el archivo `.env`, por ejemplo:

   ```env
   DATABASE_URL="file:./dev.db"
   ```

2. Inicia el servidor:

   ```powershell
   npm run start
   ```

3. En Postman, crea un environment llamado **CRM local** con estas variables:

   | Variable | Valor inicial |
   | --- | --- |
   | `baseUrl` | `http://localhost:3000` |
   | `userId` | *(vacío)* |
   | `enterpriseId` | *(vacío)* |
   | `userEnterpriseId` | *(vacío)* |
   | `clientId` | *(vacío)* |
   | `conversationId` | *(vacío)* |
   | `detailConversationId` | *(vacío)* |
   | `taskId` | *(vacío)* |

4. Selecciona ese environment. Para cada solicitud con JSON, elige **Body → raw → JSON**. Postman configurará `Content-Type: application/json`.
5. La API no solicita autenticación. Si cambiaste `PORT`, actualiza `baseUrl`.

La ruta `GET {{baseUrl}}/` debe responder `200` con:

```json
{
  "message": "CRM Semadd Nicaragua API",
  "status": "ok"
}
```

## 2. Orden recomendado

Las claves foráneas obligan a crear los registros en este orden:

1. Usuario
2. Empresa
3. Usuario de empresa y cliente
4. Conversación
5. Detalle de conversación y tarea

Las pruebas siguientes guardan automáticamente los IDs devueltos en las variables del environment. Ejecuta las solicitudes de creación en ese orden y no reemplaces esos IDs manualmente.

Para guardar un ID, abre la pestaña **Scripts → Post-response** de la solicitud POST correspondiente y agrega:

```javascript
const data = pm.response.json();
pm.environment.set('NOMBRE_VARIABLE', data.id);
```

Reemplaza `NOMBRE_VARIABLE` de acuerdo con la variable indicada en cada recurso. Comprueba en la respuesta que el POST haya devuelto `201 Created`.

## 3. Usuarios

Ruta base: `{{baseUrl}}/api/users`

### Crear usuario

**POST** `{{baseUrl}}/api/users`

```json
{
  "name": "Ana Prueba",
  "email": "ana.prueba@example.com",
  "password": "ClaveTemporal123",
  "role": "admin",
  "state": 1
}
```

Guarda el ID con el script de post-respuesta usando `userId`.

Esperado: `201 Created`. La respuesta no debe incluir `password`. `role` y `state` son opcionales; sus valores por defecto son `admin` y `1`.
Si repites la prueba con la misma base de datos, cambia el email por uno que no esté registrado.

### Consultar usuarios

- **GET** `{{baseUrl}}/api/users` — lista los usuarios.
- **GET** `{{baseUrl}}/api/users/{{userId}}` — obtiene el usuario creado.

Esperado: `200 OK`. La contraseña no se incluye en las respuestas.

### Actualizar usuario

**PATCH** `{{baseUrl}}/api/users/{{userId}}`

```json
{
  "name": "Ana Prueba Actualizada",
  "role": "supervisor"
}
```

Esperado: `200 OK`.

### Desactivar y eliminar usuario

- **DELETE** `{{baseUrl}}/api/users/{{userId}}` — desactiva el usuario asignando `state: 0`; esperado `204 No Content`.
- **DELETE** `{{baseUrl}}/api/users/{{userId}}/permanent` — elimina definitivamente el usuario; esperado `204 No Content`.

Prueba la eliminación permanente únicamente al final del recorrido y después de borrar los registros relacionados.

## 4. Empresas

Ruta base: `{{baseUrl}}/api/enterprises`

### Crear empresa

**POST** `{{baseUrl}}/api/enterprises`

```json
{
  "nameenterprise": "Empresa de Prueba",
  "country": "Nicaragua",
  "userId": {{userId}},
  "state": 1
}
```

Guarda el ID con la variable `enterpriseId`.

Esperado: `201 Created`. `userId` debe corresponder al usuario creado en el paso anterior. `state` es opcional.

### Consultar empresas

- **GET** `{{baseUrl}}/api/enterprises`
- **GET** `{{baseUrl}}/api/enterprises/{{enterpriseId}}`

Esperado: `200 OK`.

### Actualizar empresa

**PATCH** `{{baseUrl}}/api/enterprises/{{enterpriseId}}`

```json
{
  "country": "Costa Rica"
}
```

Esperado: `200 OK`.

### Eliminar empresa

**DELETE** `{{baseUrl}}/api/enterprises/{{enterpriseId}}`

Esperado: `204 No Content`. Primero deben eliminarse los registros que dependan de esta empresa.

## 5. Usuarios de empresa

Ruta base: `{{baseUrl}}/api/user-enterprises`

### Crear usuario de empresa

**POST** `{{baseUrl}}/api/user-enterprises`

```json
{
  "userId": {{userId}},
  "enterpriseId": {{enterpriseId}},
  "fullName": "Carlos Agente",
  "email": "carlos.agente@example.com",
  "username": "carlos.agente",
  "password": "ClaveTemporal123",
  "role": "agente",
  "state": 1
}
```

Guarda el ID con la variable `userEnterpriseId`.

Esperado: `201 Created`. La respuesta no debe incluir `password`. `role` y `state` son opcionales; sus valores por defecto son `agente` y `1`.

### Consultar usuarios de empresa

- **GET** `{{baseUrl}}/api/user-enterprises`
- **GET** `{{baseUrl}}/api/user-enterprises/{{userEnterpriseId}}`

Esperado: `200 OK`. La contraseña no se incluye en las respuestas.

### Actualizar usuario de empresa

**PATCH** `{{baseUrl}}/api/user-enterprises/{{userEnterpriseId}}`

```json
{
  "fullName": "Carlos Agente Actualizado",
  "role": "supervisor"
}
```

Esperado: `200 OK`.

### Eliminar usuario de empresa

**DELETE** `{{baseUrl}}/api/user-enterprises/{{userEnterpriseId}}`

Esperado: `204 No Content`. Elimina primero las tareas y los detalles de conversación asociados.

## 6. Clientes

Ruta base: `{{baseUrl}}/api/clients`

### Crear cliente

**POST** `{{baseUrl}}/api/clients`

```json
{
  "fullName": "María Cliente",
  "telephone": "88881234",
  "classification": "prospecto",
  "summary": "Cliente de prueba para Postman",
  "empresaId": {{enterpriseId}}
}
```

Guarda el ID con la variable `clientId`.

Esperado: `201 Created`. `empresaId` debe ser el ID de la empresa creada.

### Consultar clientes

- **GET** `{{baseUrl}}/api/clients`
- **GET** `{{baseUrl}}/api/clients/{{clientId}}`

Esperado: `200 OK`.

### Actualizar cliente

**PATCH** `{{baseUrl}}/api/clients/{{clientId}}`

```json
{
  "summary": "Resumen actualizado desde Postman"
}
```

Esperado: `200 OK`.

### Eliminar cliente

**DELETE** `{{baseUrl}}/api/clients/{{clientId}}`

Esperado: `204 No Content`. Elimina primero las tareas y conversaciones relacionadas.

## 7. Conversaciones

Ruta base: `{{baseUrl}}/api/conversations`

### Crear conversación

**POST** `{{baseUrl}}/api/conversations`

```json
{
  "clientId": {{clientId}},
  "userId": {{userId}},
  "enterpriseId": {{enterpriseId}},
  "message": "Primera conversación de prueba",
  "canal": "email",
  "state": 1
}
```

Guarda el ID con la variable `conversationId`.

Esperado: `201 Created`. `clientId`, `userId` y `enterpriseId` deben existir. `state` es opcional.

### Consultar conversaciones

- **GET** `{{baseUrl}}/api/conversations`
- **GET** `{{baseUrl}}/api/conversations/{{conversationId}}`

Esperado: `200 OK`.

### Actualizar conversación

**PATCH** `{{baseUrl}}/api/conversations/{{conversationId}}`

```json
{
  "message": "Mensaje actualizado desde Postman",
  "state": 1
}
```

Esperado: `200 OK`.

### Eliminar conversación

**DELETE** `{{baseUrl}}/api/conversations/{{conversationId}}`

Esperado: `204 No Content`. Elimina primero sus detalles de conversación.

## 8. Detalles de conversación

Ruta base: `{{baseUrl}}/api/detail-conversations`

### Crear detalle

**POST** `{{baseUrl}}/api/detail-conversations`

```json
{
  "conversationId": {{conversationId}},
  "message": "Respuesta del agente",
  "typeagent": "agente",
  "userenterpriseId": {{userEnterpriseId}},
  "state": 1,
  "content": "Contenido de prueba del detalle"
}
```

Guarda el ID con la variable `detailConversationId`.

Esperado: `201 Created`. `conversationId` y `userenterpriseId` deben existir. `state` es opcional.

### Consultar detalles

- **GET** `{{baseUrl}}/api/detail-conversations`
- **GET** `{{baseUrl}}/api/detail-conversations/{{detailConversationId}}`

Esperado: `200 OK`.

### Actualizar detalle

**PATCH** `{{baseUrl}}/api/detail-conversations/{{detailConversationId}}`

```json
{
  "message": "Respuesta actualizada",
  "content": "Contenido actualizado desde Postman"
}
```

Esperado: `200 OK`.

### Eliminar detalle

**DELETE** `{{baseUrl}}/api/detail-conversations/{{detailConversationId}}`

Esperado: `204 No Content`.

## 9. Tareas

Ruta base: `{{baseUrl}}/api/tasks`

### Crear tarea

**POST** `{{baseUrl}}/api/tasks`

```json
{
  "title": "Contactar al cliente",
  "description": "Dar seguimiento a la solicitud de información",
  "userenterpriseId": {{userEnterpriseId}},
  "clientId": {{clientId}},
  "priority": "alta",
  "state": 1,
  "fechadeVencimiento": "2030-12-31T18:00:00.000Z"
}
```

Guarda el ID con la variable `taskId`.

Esperado: `201 Created`. `userenterpriseId` y `clientId` deben existir. La fecha debe ser válida; `priority` y `state` son opcionales.

### Consultar tareas

- **GET** `{{baseUrl}}/api/tasks`
- **GET** `{{baseUrl}}/api/tasks/{{taskId}}`

Esperado: `200 OK`.

### Actualizar tarea

**PATCH** `{{baseUrl}}/api/tasks/{{taskId}}`

```json
{
  "priority": "media",
  "fechadeVencimiento": "2031-01-15T18:00:00.000Z"
}
```

Esperado: `200 OK`.

### Eliminar tarea

**DELETE** `{{baseUrl}}/api/tasks/{{taskId}}`

Esperado: `204 No Content`.

## 10. Pruebas de validación y errores

Estas pruebas son independientes del recorrido exitoso:

| Prueba | Solicitud | Resultado esperado |
| --- | --- | --- |
| Campos obligatorios faltantes | POST a cualquier ruta de recurso con `{}` | `400 Bad Request` |
| Usuario no encontrado | GET `{{baseUrl}}/api/users/999999999` | `404 Not Found` |
| Empresa no encontrada | GET `{{baseUrl}}/api/enterprises/999999999` | `404 Not Found` |
| Cliente no encontrado | GET `{{baseUrl}}/api/clients/999999999` | `404 Not Found` |
| Conversación no encontrada | GET `{{baseUrl}}/api/conversations/999999999` | `404 Not Found` |
| Detalle no encontrado | GET `{{baseUrl}}/api/detail-conversations/999999999` | `404 Not Found` |
| Tarea no encontrada | GET `{{baseUrl}}/api/tasks/999999999` | `404 Not Found` |
| Email duplicado de usuario | Repetir POST de usuario con el mismo email | `409 Conflict` |
| Fecha de tarea no válida | POST de tarea usando `"fechadeVencimiento": "no-es-una-fecha"` | `400 Bad Request` |
| Actualización vacía de usuario | PATCH usuario con `{}` | `400 Bad Request` |
| Actualización vacía de usuario de empresa | PATCH usuario de empresa con `{}` | `400 Bad Request` |

Al probar duplicados, usa un email que ya exista en la base de datos. Para comprobar un campo obligatorio concreto, envía el JSON omitiendo ese campo.

## 11. Limpieza de los datos de prueba

Elimina en este orden para respetar las relaciones:

1. `DELETE {{baseUrl}}/api/tasks/{{taskId}}`
2. `DELETE {{baseUrl}}/api/detail-conversations/{{detailConversationId}}`
3. `DELETE {{baseUrl}}/api/conversations/{{conversationId}}`
4. `DELETE {{baseUrl}}/api/clients/{{clientId}}`
5. `DELETE {{baseUrl}}/api/user-enterprises/{{userEnterpriseId}}`
6. `DELETE {{baseUrl}}/api/enterprises/{{enterpriseId}}`
7. `DELETE {{baseUrl}}/api/users/{{userId}}/permanent`

Cada eliminación exitosa responde `204 No Content` sin cuerpo.
