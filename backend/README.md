# Backend - Quito Ubicacion Segura

API Express para autenticacion academica, grupos, GPS consentido y proxy seguro de Geoapify. Funciona en memoria sin servicios externos.

## Configuracion

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

Variables:

```env
PORT=4000
FRONTEND_URL=http://localhost:5173
GEOAPIFY_API_KEY=tu_api_key_aqui
SUPABASE_URL=tu_supabase_url
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
SUPABASE_ANON_KEY=tu_anon_key
```

No se debe enviar `GEOAPIFY_API_KEY` ni `SUPABASE_SERVICE_ROLE_KEY` al frontend.

## Endpoints

Auth y usuarios:

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/users`
- `GET /api/users/me`

Grupos:

- `POST /api/groups`
- `GET /api/groups`
- `GET /api/groups/:groupId`
- `POST /api/groups/:groupId/members`
- `DELETE /api/groups/:groupId/members/:userId`
- `PATCH /api/groups/:groupId/members/:memberId/location-status`

Ubicacion:

- `POST /api/location/share/start`
- `POST /api/location/share/stop`
- `POST /api/location/update`
- `GET /api/location/group/:groupId`
- `GET /api/location/user/:userId`
- Compatibilidad: `GET /api/location/:userId` y `PATCH /api/location/share`

Mapas:

- `GET /api/maps/status` (publico)
- `GET /api/maps/geocode?text=La Carolina Quito`
- `GET /api/maps/reverse?lat=-0.1807&lon=-78.4678`
- `GET /api/maps/routing?from=-0.1807,-78.4678&to=-0.2299,-78.5249`
- `GET /api/maps/places?lat=-0.1807&lon=-78.4678&category=healthcare`
- `GET /api/maps/isoline?lat=-0.1807&lon=-78.4678&type=time&mode=walk&range=600`

Las rutas protegidas requieren `Authorization: Bearer token-simulado-<id>`. Sin clave Geoapify, los endpoints del proveedor responden `503` con `GEOAPIFY_NOT_CONFIGURED`; el resto de la API sigue disponible.
