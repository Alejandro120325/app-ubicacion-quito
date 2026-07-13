# Guia de ejecucion local de GeoKipu

Esta guia deja el proyecto en modo 100% local para revision grupal. No usa Render, MongoDB Atlas, Supabase ni backend en linea.

## Requisitos

- Node.js instalado.
- MongoDB local instalado y ejecutandose.
- Git instalado.
- Postman opcional para probar la coleccion.

## 1. Clonar repositorio

```powershell
git clone https://github.com/Alejandro120325/app-ubicacion-quito.git
cd app-ubicacion-quito
```

## 2. Verificar MongoDB local

MongoDB debe estar disponible en:

```text
mongodb://127.0.0.1:27017/geokipu
```

Si usas MongoDB Compass, crea o abre una conexion a `mongodb://127.0.0.1:27017`.

## 3. Backend local

```powershell
cd backend
copy .env.example .env
npm install
npm run seed
npm run dev
```

El backend debe quedar en:

```text
http://localhost:4000/api
```

Prueba rapida en navegador:

```text
http://localhost:4000/api/health
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

## 4. Frontend local

En otra terminal:

```powershell
cd frontend
copy .env.example .env
npm install
npm run dev
```

Abrir:

```text
http://localhost:5173
```

## 5. Variables necesarias

Backend `backend/.env`:

```env
PORT=4000
APP_NAME=GeoKipu
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/geokipu
GEOAPIFY_API_KEY=
```

Frontend `frontend/.env`:

```env
VITE_API_URL=http://localhost:4000/api
VITE_APP_NAME=GeoKipu
```

No subir archivos `.env` reales al repositorio.

Si `GEOAPIFY_API_KEY` queda vacia, los endpoints de mapas responden en modo simulado para que la revision local no dependa de internet ni claves reales.

## 6. Credenciales locales

Admin:

```text
admin@geokipu.com / Admin123
```

Persona:

```text
persona@geokipu.com / Persona123
```

Compatibilidad mantenida:

```text
admin@quitoapp.com / Admin123
persona@quitoapp.com / Persona123
```

## 7. Prueba automatica local

Con el backend encendido en una terminal:

```powershell
cd backend
npm run smoke:local
```

Debe imprimir:

```text
OK Health
OK Login
OK Users
OK Groups
OK Locations
OK Maps
Pruebas locales finalizadas
```

## 8. Postman local

Importar:

- `docs/GeoKipu.postman_collection.json`
- `docs/GeoKipu_Local.postman_environment.json`

Seleccionar ambiente `GeoKipu Local`.

Variable principal:

```text
baseUrl = http://localhost:4000/api
```

Orden recomendado:

1. `GET Health`
2. `POST Login Admin`
3. `GET Auth Me`
4. `POST Crear usuario`
5. `GET Listar usuarios`
6. `POST Crear grupo`
7. `GET Listar grupos`
8. `POST Agregar miembro`
9. `GET Listar miembros`
10. `POST Crear ubicacion`
11. `GET Listar ubicaciones`
12. `GET Maps Status`

El request `POST Login Admin` guarda automaticamente `authToken`. Las rutas protegidas usan:

```text
Authorization: Bearer {{authToken}}
```

## 9. Panel web de revision

Despues de iniciar sesion en el frontend, abrir desde el menu:

```text
Endpoints locales
```

Ese panel muestra:

- estado del backend
- usuario logueado
- usuarios registrados
- grupos
- miembros
- ubicaciones
- estado de mapas

## 10. Problemas comunes

- MongoDB no esta encendido: iniciar el servicio local o abrir MongoDB Compass.
- `.env` no existe: copiar `.env.example` como `.env` en backend y frontend.
- `VITE_API_URL` incorrecta: debe ser `http://localhost:4000/api`.
- Backend en otro puerto: liberar el puerto 4000 o corregir `PORT=4000`.
- Frontend en otro puerto: usar `http://localhost:5173`.
- Token no guardado: ejecutar de nuevo `POST Login Admin` en Postman.
- Email duplicado: usar el seed o la coleccion actual, que genera correos dinamicos.

## 11. Endpoints locales principales

Health:

- `GET /api/health`

Auth:

- `POST /api/auth/login`
- `GET /api/auth/me`

Users:

- `GET /api/users`
- `POST /api/users`
- `GET /api/users/:id`
- `PATCH /api/users/:id`
- `DELETE /api/users/:id`

Groups:

- `GET /api/groups`
- `POST /api/groups`
- `GET /api/groups/:groupId`
- `PATCH /api/groups/:groupId`
- `DELETE /api/groups/:groupId`

Group Members:

- `GET /api/groups/:groupId/members`
- `POST /api/groups/:groupId/members`
- `PATCH /api/groups/:groupId/members/:memberId`
- `DELETE /api/groups/:groupId/members/:memberId`

Locations:

- `GET /api/locations`
- `POST /api/locations`
- `GET /api/locations/:id`
- `PATCH /api/locations/:id`
- `DELETE /api/locations/:id`
- `GET /api/locations/group/:groupId`
- `GET /api/locations/user/:userId`

Location Sharing:

- `POST /api/location/share/start`
- `POST /api/location/update`
- `POST /api/location/share/stop`
- `GET /api/location/group/:groupId`
- `GET /api/location/user/:userId`

Maps:

- `GET /api/maps/status`
- `GET /api/maps/geocode`
- `GET /api/maps/reverse`
- `GET /api/maps/routing`
- `GET /api/maps/places`
- `GET /api/maps/isoline`
