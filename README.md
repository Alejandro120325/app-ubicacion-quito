# GeoKipu

GeoKipu es una aplicacion academica para compartir ubicacion de forma consentida entre familiares, amigos y contactos de confianza.

## Arquitectura

```txt
Frontend React/Vite -> AWS Amplify
Backend Express/Node.js -> AWS Elastic Beanstalk
Base PostgreSQL -> Supabase
Servicios de mapas -> Geoapify mediante /api/maps/*
Mobile Expo/React Native -> Expo Go o APK
```

El proyecto no usa Firebase. Sin Supabase funciona en memoria y sin Geoapify conserva mapa y datos simulados.

## Modulos

- `/frontend`: Home, Login, Register, dashboards admin/persona, grupos, mapas, alertas, API, privacidad y GPS web.
- `/backend`: autenticacion academica, CRUD de grupos, integrantes, ubicaciones y proxy Geoapify.
- `/mobile`: cliente Expo existente, mantenido por otro integrante.
- `/docs`: esquema, Postman y preparacion de servicios externos.

## Seguridad, bitacora y soporte

- Backend: endpoints `/api/activity` y alias `/api/alerts`.
- Web React: mini tutorial, bitacora, alertas, soporte, perfil editable y bloqueo por PIN.
- Mobile Expo: mini tutorial, PIN seguro, biometria, bloqueo al volver de segundo plano, bitacora, soporte y perfil.
- Guia de pruebas: `docs/seguridad-bitacora-soporte.md`.

## Privacidad

- Tu ubicacion solo se comparte cuando tu la activas.
- Puedes pausar el seguimiento en cualquier momento.
- GeoKipu no rastrea tu ubicacion sin consentimiento.
- Solo los integrantes de tu grupo pueden ver tu ultima ubicacion compartida.

## Ejecutar localmente

Backend:

```powershell
cd backend
if (!(Test-Path .env)) { Copy-Item .env.example .env }
npm install
npm run dev
```

Frontend:

```powershell
cd frontend
if (!(Test-Path .env)) { Copy-Item .env.example .env }
npm install
npm run build
npm run dev
```

- Backend: `http://localhost:4000`
- Frontend: `http://localhost:5173`

## Variables

Frontend:

```env
VITE_API_URL=http://localhost:4000/api
VITE_APP_NAME=GeoKipu
```

Backend:

```env
PORT=4000
APP_NAME=GeoKipu
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=tu_supabase_url
SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_supabase_service_role_key
GEOAPIFY_API_KEY=tu_geoapify_api_key
```

Mobile:

```env
EXPO_PUBLIC_API_URL=http://IP_DEL_PC:4000/api
EXPO_PUBLIC_APP_NAME=GeoKipu
```

## Credenciales principales

- Admin: `admin@geokipu.com` / `Admin123`
- Persona 1: `persona@geokipu.com` / `Persona123`
- Persona 2: `camila.torres@example.com` / `Camila123`

Los correos antiguos `@quitoapp.com` siguen aceptados temporalmente por el backend.

## Endpoints

- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`.
- Groups: CRUD `/api/groups` y `/api/groups/:groupId`.
- Members: CRUD `/api/groups/:groupId/members`.
- Locations: `GET/POST /api/locations` y rutas `/api/location/*` para GPS web.
- Maps: `/api/maps/status`, `geocode`, `reverse`, `routing`, `places`, `isoline` y `mock-route`.

## Documentacion

- Postman: `docs/postman-pruebas.md`.
- Supabase: `docs/supabase-setup.md` y `docs/supabase-schema.sql`.
- AWS: `docs/aws-deploy.md`.
- Expo Go: `docs/expo-go.md`.
- GPS y privacidad: `docs/gps-real.md`.

No se incluyen claves reales ni se realiza despliegue automatico.
