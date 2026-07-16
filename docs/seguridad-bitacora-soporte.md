# GeoKipu - Seguridad, bitacora y soporte

## Objetivo

Extender GeoKipu con seguridad local, bitacora de actividad, alertas, soporte tecnico,
edicion de perfil y coherencia visual entre web y mobile.

## Mini tutorial

El tutorial explica bienvenida, ubicacion en tiempo real, bitacora, alertas,
seguridad de datos y contacto rapido. Web guarda el estado en `localStorage`; mobile
lo guarda con `expo-secure-store`.

## Bitacora y alertas

Los eventos incluyen `id`, `userId`, `userName`, `groupId`, `type`, `message`,
`priority`, `latitude`, `longitude`, `sector`, `read` y fecha/hora.

Alertas de prioridad alta usan `priority: "high"` y tipo como `disconnection`,
`gps_disabled` o `location_paused`.

## Proteccion en caso de robo

Web implementa bloqueo por inactividad con PIN local. Mobile implementa PIN con
`expo-secure-store`, bloqueo al volver de segundo plano y biometria con
`expo-local-authentication`.

## Edicion de perfil

Web y mobile usan:

```http
PATCH /api/users/:id
Authorization: Bearer token-simulado-1
```

Al actualizar perfil se crea un evento `profile_updated` en la bitacora.

## Soporte tecnico

- Instagram: `https://instagram.com/`
- GitHub: `https://github.com/Alejandro120325`
- LinkedIn: `https://www.linkedin.com/in/jairo-alejandro-ojeda-herrera-9466543a6/`

## Endpoints nuevos

Todos requieren `Authorization: Bearer token-simulado-1`.

```http
GET /api/activity
POST /api/activity
GET /api/activity/user/:userId
GET /api/activity/group/:groupId
PATCH /api/activity/:id/read
DELETE /api/activity/:id
```

Alias:

```http
GET /api/alerts
POST /api/alerts
```

## Como probar en web

```powershell
cd backend
Copy-Item .env.example .env -Force
npm install
npm run seed
npm run dev
```

```powershell
cd frontend
Copy-Item .env.example .env -Force
npm install
npm run dev
```

Abrir `http://localhost:5173` y probar login, tutorial, dashboard, bitacora,
crear evento, editar perfil, configurar PIN, bloqueo por inactividad y soporte.

## Como probar en mobile

```powershell
cd mobile
npm install
npx expo start
```

Probar login, tutorial, crear PIN, segundo plano/foreground, desbloqueo con PIN o
biometria, bitacora, contacto rapido, perfil y soporte.

## Evidencias sugeridas

- Tutorial.
- Evento `disconnection`.
- Postman creando evento.
- Bloqueo por PIN.
- Perfil actualizado.
- Soporte tecnico.

## Relacion conceptual con Life360

GeoKipu toma como referencia conceptual los circulos de confianza, alertas,
historial de actividad y contacto rapido. Mantiene identidad propia mediante
consentimiento explicito, privacidad, bloqueo local, PIN/biometria, bitacora
educativa y diseno propio.
