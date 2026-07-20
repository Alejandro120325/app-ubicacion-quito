# GeoKipu - GPS real en primer plano

## Fase implementada

Esta fase agrega ubicacion real solo mientras la app esta abierta y el usuario concede permiso foreground.
No se implementa todavia rastreo en segundo plano, WebSocket ni notificaciones push.

## GPS real vs Geoapify

- GPS real: lo entrega el dispositivo o navegador con latitud, longitud, precision, rumbo, velocidad y timestamp.
- Geoapify: se usa solo en backend para reverse geocoding si existe la variable privada `GEOAPIFY_API_KEY`.
- Si no existe `GEOAPIFY_API_KEY`, GeoKipu conserva las coordenadas reales y usa fallback de direccion sin exponer llaves al cliente.
- Frontend web y mobile nunca reciben ni almacenan claves; solo consumen endpoints locales del backend.

## Integracion Geoapify implementada

Cuando `POST /api/location/update` recibe una ubicacion real con `simulated: false`, el backend llama a Geoapify desde `src/services/geoapify.service.js` para convertir latitud/longitud en:

- `address`: direccion aproximada.
- `sector`: barrio, sector o distrito detectado.
- `city`: ciudad normalizada.
- `raw`: respuesta original normalizada para auditoria tecnica interna.

La respuesta de actualizacion incluye:

```json
{
  "ok": true,
  "message": "Ubicacion compartida",
  "location": {
    "latitude": -0.180653,
    "longitude": -78.467834,
    "address": "Direccion aproximada",
    "sector": "Sector detectado",
    "city": "Quito",
    "simulated": false
  },
  "geoapify": {
    "enabled": true,
    "resolved": true
  }
}
```

Si Geoapify no esta configurado o falla temporalmente, el backend responde igualmente con `ok: true`, conserva las coordenadas reales y devuelve `geoapify.resolved: false`.

## Activacion en mobile

1. Entrar con una cuenta tipo persona.
2. Ir a `Mi ubicacion`.
3. Presionar `Activar ubicacion real`.
4. Aceptar el permiso de ubicacion.
5. La app obtiene la posicion actual y abre un `watchPositionAsync` con:
   - `accuracy: High`
   - `timeInterval: 5000`
   - `distanceInterval: 10`
6. Usar `Actualizar ahora` para forzar un envio manual.
7. Usar `Pausar ubicacion` para detener el seguimiento consentido.

Si el permiso se niega, la pantalla muestra el estado denegado y conserva el mapa de demostracion.

## Endpoints usados

Todos requieren `Authorization: Bearer <token>`.

- `POST /api/location/share/start`: activa `sharingLocation` para la persona.
- `POST /api/location/update`: guarda coordenadas reales.
- `POST /api/location/share/stop`: pausa la ubicacion compartida.
- `GET /api/locations`: lista ubicaciones visibles para admin o usuario autorizado.
- `GET /api/location/user/:userId`: obtiene la ubicacion de una persona.
- `GET /api/location/group/:groupId`: obtiene ubicaciones visibles de un grupo.
- `GET /api/maps/reverse?lat=<lat>&lon=<lon>`: resuelve coordenadas a direccion desde backend.

Payload principal:

```json
{
  "userId": 2,
  "latitude": -0.180653,
  "longitude": -78.467834,
  "accuracy": 12,
  "heading": 90,
  "speed": 0,
  "sharing": true,
  "simulated": false,
  "timestamp": "2026-07-20T03:00:00.000Z"
}
```

## Persistencia MongoDB

La coleccion `locations` guarda:

- `userId`
- `groupId`
- `latitude`
- `longitude`
- `accuracy`
- `heading`
- `speed`
- `address`
- `sector`
- `sharing`
- `simulated: false`
- `lastUpdate`

Tambien se sincroniza el estado del usuario y de sus integrantes asociados en grupos.

## Bitacora y alertas

El backend registra:

- `location_started`: info, cuando el usuario activa compartir ubicacion.
- `location_updated`: info, con throttling para evitar spam.
- `location_resolved`: info, cuando Geoapify resolvio direccion real, con throttling ampliado para evitar spam.
- `location_paused`: warning, cuando el usuario pausa ubicacion.

Mobile y web registran:

- `gps_denied`: warning, si el permiso es rechazado.
- `gps_error`: warning, si falla la lectura o el envio.

## Frontend web React

La pantalla persona de ubicacion usa `navigator.geolocation` solo cuando el usuario presiona activar.
El administrador no pide GPS local; solo consulta ubicaciones ya guardadas por backend y refresca cada 5 segundos.

## Prueba con Postman

1. Login:
   `POST http://localhost:4000/api/auth/login`
2. Copiar el token.
3. Activar:
   `POST http://localhost:4000/api/location/share/start`
4. Enviar coordenadas:
   `POST http://localhost:4000/api/location/update`
5. Consultar:
   `GET http://localhost:4000/api/locations`
6. Pausar:
   `POST http://localhost:4000/api/location/share/stop`

Prueba de reverse geocoding:

`GET http://localhost:4000/api/maps/reverse?lat=-0.180653&lon=-78.467834`

Resultado esperado con proveedor disponible:

```json
{
  "ok": true,
  "provider": "Geoapify",
  "mode": "real",
  "address": "Direccion aproximada",
  "sector": "Sector detectado",
  "city": "Quito",
  "resolved": true
}
```

Resultado esperado sin proveedor configurado:

```json
{
  "ok": true,
  "provider": "Geoapify",
  "mode": "demo",
  "address": "Coordenadas GPS disponibles: -0.180653, -78.467834",
  "sector": "Ubicacion GPS",
  "city": "Quito",
  "resolved": false
}
```

En cada request protegido usar:

```http
Authorization: Bearer <token>
Content-Type: application/json
```

## Futuras fases

- Ubicacion en background con permisos especificos y aviso visible.
- WebSocket o SSE para mapa en tiempo real sin polling.
- Push notifications para desconexion o SOS.
- Politicas de retencion de historial de ubicacion.
- Controles avanzados por grupo y horarios de comparticion.
