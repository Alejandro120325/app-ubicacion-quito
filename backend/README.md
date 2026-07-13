# Backend Express - GeoKipu

API REST de GeoKipu para autenticacion, usuarios, grupos, miembros, ubicaciones consentidas y proxy seguro de Geoapify. MongoDB/Mongoose es la persistencia principal para el Taller 3. Supabase y memoria se conservan como alternativas para no romper el proyecto.

## Requisitos

- Node.js 18 o superior.
- MongoDB Community Server ejecutandose localmente, o una URI de MongoDB Atlas.
- Postman, Thunder Client o un cliente HTTP equivalente.

## Instalacion en Windows

```powershell
cd backend
npm install
Copy-Item .env.example .env
npm run dev
```

MongoDB local debe estar iniciado antes del backend:

```powershell
Get-Service MongoDB
Start-Service MongoDB
```

Si MongoDB se ejecuta manualmente:

```powershell
mongod --dbpath C:\data\db
```

## Variables de entorno

```env
PORT=4000
APP_NAME=GeoKipu
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/geokipu
SUPABASE_URL=tu_supabase_url
SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_supabase_service_role_key
GEOAPIFY_API_KEY=tu_geoapify_api_key
```

Orden de persistencia: MongoDB, Supabase y memoria. Si MongoDB no responde en tres segundos, el backend intenta el almacenamiento alternativo y sigue disponible. Las claves privadas permanecen solo en backend.

## Scripts

```json
{
  "dev": "nodemon src/server.js",
  "start": "node src/server.js"
}
```

## Verificacion rapida

```powershell
Invoke-RestMethod http://localhost:4000/api/health
```

Con MongoDB activo, la respuesta debe incluir:

```json
{
  "ok": true,
  "storage": "mongodb",
  "mongodb": "connected"
}
```

Tambien se puede verificar en `mongosh`:

```javascript
use geokipu
show collections
db.users.find().limit(5)
db.groups.find().limit(5)
db.groupmembers.find().limit(5)
db.locations.find().limit(5)
```

## Autenticacion de prueba

```text
Admin:   admin@geokipu.com / Admin123
Persona: persona@geokipu.com / Persona123
```

El login devuelve un token academico. En rutas protegidas usar:

```http
Authorization: Bearer token-simulado-1
Content-Type: application/json
```

## Recursos REST

- Health: `GET /api/health`.
- Auth: registro, login y usuario autenticado.
- Users: `GET`, `POST`, `GET /:id`, `PATCH /:id`, `DELETE /:id`.
- Groups: CRUD completo.
- Group Members: listar, crear, actualizar, eliminar y cambiar estado.
- Locations: CRUD, consulta por grupo/usuario y estado.
- Location Sharing: iniciar, actualizar y detener ubicacion.
- Maps: status, geocode, reverse, routing, places, isoline y ruta simulada.

La referencia completa, cuerpos y respuestas esperadas esta en `../docs/postman-pruebas.md`. La coleccion importable esta en `../docs/GeoKipu.postman_collection.json`.

## Prueba con Postman

1. Importar `docs/GeoKipu.postman_collection.json`.
2. Ejecutar `Health` y comprobar `storage: mongodb`.
3. Ejecutar `Login Admin`; la coleccion guarda el token.
4. Ejecutar las carpetas Users, Groups, Group Members y Locations en orden.
5. Ejecutar Login Persona y luego iniciar, actualizar y detener ubicacion.
6. Probar Maps. Sin `GEOAPIFY_API_KEY`, status muestra modo simulado y las consultas externas devuelven un error controlado `503`.

## Estructura tecnica

```text
src/config       Conexion MongoDB y Supabase
src/models       Modelos Mongoose
src/routes       Definicion de endpoints Express
src/controllers  Validacion HTTP y respuestas
src/services     Logica de negocio y persistencia
src/middlewares  Autenticacion
src/utils        Validaciones y errores
```

El backend supera el minimo del Taller 3: implementa mas de tres recursos, cada recurso principal dispone de al menos dos metodos HTTP y MongoDB/Mongoose almacena los datos NoSQL.
