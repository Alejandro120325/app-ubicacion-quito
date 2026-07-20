# GeoKipu - GPS real en primer plano

## Fase implementada

Esta fase agrega ubicacion real solo mientras la app esta abierta y el usuario concede permiso foreground.
No se implementa todavia rastreo en segundo plano, WebSocket ni notificaciones push.

## GPS real vs Geoapify

- GPS real: lo entrega el dispositivo o navegador con latitud, longitud, precision, rumbo, velocidad y timestamp.
- Geoapify: se usa solo en backend para reverse geocoding si existe `GEOAPIFY_API_KEY`.
- Si no existe `GEOAPIFY_API_KEY`, GeoKipu conserva las coordenadas reales y usa fallback de direccion sin exponer llaves al cliente.

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
