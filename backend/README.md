# Backend - Quito Ubicacion Segura

API basica con Node.js y Express para probar login, registro, roles, ubicacion simulada y grupos familiares/amigos sin base de datos real.

## Instalacion

```bash
npm install
```

## Ejecucion

```bash
npm run dev
```

URL por defecto:

```txt
http://localhost:4000
```

## Credenciales de prueba

- Admin: `admin@quitoapp.com` / `Admin123`
- Persona: `persona@quitoapp.com` / `Persona123`

## Endpoints

Autenticacion:

- `POST /api/auth/login`
- `POST /api/auth/register`

Usuarios:

- `GET /api/users`
- `GET /api/users/me`

Ubicacion:

- `GET /api/location/:userId`
- `PATCH /api/location/share`

Grupos simulados:

- `GET /api/groups`
- `POST /api/groups`
- `GET /api/groups/:groupId`
- `POST /api/groups/:groupId/members`
- `PATCH /api/groups/:groupId/members/:memberId/location-status`

## Datos

Los datos viven en `src/data/mockData.js`.

No se devuelven contrasenas desde los controladores. Los grupos, integrantes y ubicaciones son simulados y se reinician al reiniciar el servidor.

## Autenticacion

Las rutas protegidas esperan:

```txt
Authorization: Bearer token-simulado-1
```

El token se recibe al iniciar sesion.
