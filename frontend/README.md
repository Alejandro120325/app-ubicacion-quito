# Frontend - GeoKipu

Aplicacion React/Vite responsive con autenticacion por rol, grupos, GPS web consentido, polling y mapa visual con fallback simulado.

## Ejecutar

```powershell
npm install
npm run build
npm run dev
```

Variable opcional:

```env
VITE_API_URL=http://localhost:4000/api
VITE_APP_NAME=GeoKipu
```

Las claves Geoapify y Supabase no pertenecen al frontend. Para AWS Amplify usar root `frontend`, build `npm run build` y salida `dist`.

## GPS

- El permiso se solicita solo al pulsar **Activar ubicacion GPS**.
- `useLiveLocation` usa `watchPosition`, throttle de cinco segundos y limpieza al pausar/salir.
- Los grupos actualizan ubicaciones mediante polling cada cinco segundos.
- El mapa admite coordenadas reales y conserva marcadores simulados si no existen.
- En produccion se requiere HTTPS.

Consulta `docs/gps-real.md` para arquitectura y despliegue.
