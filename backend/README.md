# Backend Express - GeoKipu

API REST local de GeoKipu para autenticacion, usuarios, grupos, miembros, ubicaciones consentidas y estado de mapas. En esta fase usa MongoDB local con Mongoose.

## Requisitos

- Node.js 18 o superior.
- MongoDB Community Server ejecutandose localmente.
- Postman, Thunder Client o cliente HTTP equivalente.

## Instalacion en Windows

```powershell
cd backend
copy .env.example .env
npm install
npm run seed
npm run dev
```

MongoDB local debe estar disponible en:

```text
mongodb://127.0.0.1:27017/geokipu
```

Si el servicio esta instalado en Windows:

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
GEOAPIFY_API_KEY=
```

`GEOAPIFY_API_KEY` es opcional. Si queda vacia, el backend mantiene el estado de mapas en modo simulado y no consume APIs externas.

## Scripts

```json
{
  "dev": "nodemon src/server.js",
  "start": "node src/server.js",
  "seed": "node scripts/seed.js",
  "smoke:local": "node scripts/smoke-local.js"
}
```

## Verificacion rapida

```powershell
Invoke-RestMethod http://localhost:4000/api/health
```

Respuesta esperada:

```json
{
  "ok": true,
  "app": "GeoKipu",
  "service": "backend",
  "storage": "mongodb",
  "mongodb": "connected"
}
```

Smoke test con backend encendido:

```powershell
npm run smoke:local
```

## Autenticacion de prueba

```text
Admin:   admin@geokipu.com / Admin123
Persona: persona@geokipu.com / Persona123
```

Alias compatibles:

```text
admin@quitoapp.com / Admin123
persona@quitoapp.com / Persona123
```

El login devuelve:

```json
{
  "ok": true,
  "token": "token-simulado-1",
  "accessToken": "token-simulado-1",
  "user": {
    "id": 1,
    "fullName": "Administrador GeoKipu",
    "email": "admin@geokipu.com",
    "role": "admin"
  }
}
```

En rutas protegidas usar:

```http
Authorization: Bearer token-simulado-1
Content-Type: application/json
```

## Recursos REST

- Health: `GET /api/health`.
- Auth: `POST /api/auth/login`, `GET /api/auth/me`.
- Users: `GET`, `POST`, `GET /:id`, `PATCH /:id`, `DELETE /:id`.
- Groups: CRUD completo.
- Group Members: listar, crear, actualizar y eliminar.
- Locations: CRUD, consulta por grupo y usuario.
- Location Sharing: iniciar, actualizar y detener ubicacion.
- Maps: status, geocode, reverse, routing, places e isoline.

La guia de ejecucion local esta en `../docs/guia-ejecucion-local-geokipu.md`. La coleccion importable esta en `../docs/GeoKipu.postman_collection.json`.

## Estructura tecnica

```text
src/config       Conexion MongoDB local
src/models       Modelos Mongoose
src/routes       Definicion de endpoints Express
src/controllers  Validacion HTTP y respuestas
src/services     Logica de negocio y persistencia
src/middlewares  Autenticacion
src/utils        Validaciones y errores
scripts          Seed local y smoke test
```
