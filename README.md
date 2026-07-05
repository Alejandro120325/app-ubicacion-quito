# Quito Ubicacion Segura

Aplicacion academica full-stack para compartir ubicacion con consentimiento entre grupos familiares o de confianza. Incluye frontend React, backend Express, GPS web, fallback simulado y proxy Geoapify.

## Funcionalidades

- Login y registro por roles `admin` y `persona`.
- Dashboards separados y responsive.
- Creacion de grupos y alta de usuarios registrados por correo.
- GPS web manual mediante `navigator.geolocation.watchPosition`.
- Activacion, actualizacion y pausa de ubicacion.
- Polling de ubicaciones de grupo cada cinco segundos.
- Mapa visual preparado para coordenadas reales, sin Google Maps, Leaflet ni Mapbox.
- Geoapify consumida exclusivamente desde endpoints propios del backend.
- Fallback completo sin Geoapify ni Supabase configurados.
- Temas claro/oscuro, selector visual e idiomas ES/EN.

La carpeta `/mobile` pertenece a otro equipo y no forma parte de estos cambios.

## Inicio local

Terminal 1:

```powershell
cd backend
Copy-Item .env.example .env
npm install
npm run dev
```

Terminal 2:

```powershell
cd frontend
npm install
npm run build
npm run dev
```

- Backend: `http://localhost:4000`
- Frontend: `http://localhost:5173`

## Credenciales

- Admin: `admin@quitoapp.com` / `Admin123`
- Persona: `persona@quitoapp.com` / `Persona123`
- Segunda persona: `camila.torres@example.com` / `Camila123`

## Variables

Backend:

```env
PORT=4000
FRONTEND_URL=http://localhost:5173
GEOAPIFY_API_KEY=tu_api_key_aqui
SUPABASE_URL=tu_supabase_url
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
SUPABASE_ANON_KEY=tu_anon_key
```

Frontend:

```env
VITE_API_URL=http://localhost:4000/api
```

## Endpoints nuevos

- Mapas: `/api/maps/status`, `/geocode`, `/reverse`, `/routing`, `/places`, `/isoline`.
- GPS: `/api/location/share/start`, `/share/stop`, `/update`, `/group/:groupId`, `/user/:userId`.
- Grupos: `DELETE /api/groups/:groupId/members/:userId` adicional a los endpoints existentes.

Detalles y ejemplos: `backend/README.md`.

## Persistencia y despliegue

El entorno local persiste en memoria para funcionar sin cuentas externas. `docs/supabase-schema.sql` prepara PostgreSQL y `docs/gps-real.md` explica privacidad, Supabase, Railway y Vercel.

No se incluyen claves reales en el repositorio.
