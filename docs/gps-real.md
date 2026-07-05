# GPS real en la web

## Flujo implementado

1. La persona abre `/persona/ubicacion`.
2. El navegador no solicita permisos automaticamente.
3. Al pulsar **Activar ubicacion GPS**, `useLiveLocation` inicia `watchPosition`.
4. Tras conceder permiso, el frontend activa el estado en el backend y envia coordenadas como maximo cada cinco segundos.
5. Los integrantes consultan `GET /api/location/group/:groupId` cada cinco segundos.
6. Al pausar o abandonar la vista se limpia el `watchId` y se detiene el estado compartido.

Opciones del navegador:

```js
{
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 5000
}
```

El frontend maneja permiso denegado, GPS no disponible, timeout y errores de red. Si Geoapify no esta configurada, conserva las coordenadas sin direccion y el mapa visual usa fallback simulado.

## Privacidad

- No existe solicitud ni seguimiento automatico.
- Solo una cuenta `persona` puede publicar su propia ubicacion.
- Las ubicaciones de grupo se entregan a administradores, creadores e integrantes del grupo.
- La clave de servicio de Supabase y la clave de Geoapify pertenecen al backend.
- La geolocalizacion web requiere `localhost` o HTTPS.

## Persistencia actual y Supabase

La version local usa memoria para ser ejecutable sin servicios externos. Los datos se reinician al reiniciar Node. El contrato SQL de producción esta en `docs/supabase-schema.sql`.

Para conectar Supabase:

1. Crear un proyecto y ejecutar `docs/supabase-schema.sql` en SQL Editor.
2. Configurar `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` y `SUPABASE_ANON_KEY` solo en Railway.
3. Sustituir el repositorio en memoria de `backend/src/data/mockData.js` por un repositorio Supabase que mantenga los mismos contratos de controladores.
4. Migrar la autenticacion simulada a Supabase Auth antes de habilitar politicas RLS para clientes.

## Despliegue

### Railway

- Root directory: `backend`
- Start command: `npm start`
- Variables: `PORT`, `FRONTEND_URL`, `GEOAPIFY_API_KEY` y las tres variables de Supabase.

### Vercel

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Variable: `VITE_API_URL=https://tu-backend.railway.app/api`

Vercel y Railway entregan HTTPS, requisito para `navigator.geolocation` fuera de localhost.

## Diferencia con `/mobile`

Esta implementación solo afecta al navegador web en `/frontend`. La carpeta `/mobile` no se modifica y requerira su propio manejo de permisos y seguimiento en segundo plano.
