# Backend - App Ubicacion Quito

API basica con Node.js y Express para probar login, registro, roles y ubicacion simulada sin base de datos.

## Instalacion

```bash
npm install
```

## Ejecucion

```bash
npm run dev
```

El servidor usa por defecto `http://localhost:4000`.

## Credenciales de prueba

- Admin: `admin@quitoapp.com` / `Admin123`
- Persona: `persona@quitoapp.com` / `Persona123`

## Endpoints principales

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/users`
- `GET /api/users/me`
- `GET /api/location/:userId`
- `PATCH /api/location/share`

Las rutas protegidas esperan un header `Authorization` con un token simulado recibido al iniciar sesion.
