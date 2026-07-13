# Pruebas HTTP de GeoKipu - Taller 3

Esta guia coincide con las rutas implementadas en `backend/src/routes`. La coleccion importable se encuentra en `docs/GeoKipu.postman_collection.json`.

## Preparacion

```powershell
cd backend
npm install
Copy-Item .env.example .env
npm run dev
```

Variables de Postman:

```text
baseUrl = http://localhost:4000/api
token = token devuelto por POST /auth/login
userId = ID creado en Users
groupId = ID creado en Groups
memberId = ID creado en Group Members
locationId = ID creado en Locations
```

Header para rutas protegidas:

```http
Authorization: Bearer {{token}}
Content-Type: application/json
```

## 1. Health

| Metodo | URL | Descripcion | Body | Respuesta esperada | Captura para PDF |
|---|---|---|---|---|---|
| GET | `{{baseUrl}}/health` | Estado de Express y almacenamiento | No | `200`, `ok: true`, `storage: mongodb`, `mongodb: connected` | Terminal con MongoDB conectado y respuesta completa |

Tambien existe `GET http://localhost:4000/`, que confirma el nombre y disponibilidad general de la API.

## 2. Auth

| Metodo | URL | Descripcion | Body | Respuesta esperada | Captura |
|---|---|---|---|---|---|
| POST | `{{baseUrl}}/auth/register` | Registra una persona | A1 | `201`, usuario sin password | Body y respuesta 201 |
| POST | `{{baseUrl}}/auth/login` | Inicia sesion | A2 | `200`, token y usuario | Token visible en respuesta |
| GET | `{{baseUrl}}/auth/me` | Obtiene usuario autenticado | No | `200`, usuario y almacenamiento | Header Authorization y respuesta |

Body A1:

```json
{
  "fullName": "Laura Morales",
  "email": "laura.morales@geokipu.com",
  "password": "Laura123",
  "confirmPassword": "Laura123",
  "language": "es",
  "cedula": "1712345600",
  "phone": "0999999999"
}
```

Body A2:

```json
{
  "email": "admin@geokipu.com",
  "password": "Admin123"
}
```

No existen rutas de logout o refresh porque la autenticacion actual usa tokens academicos sin sesion persistente.

## 3. Users

| Metodo | URL | Descripcion | Body | Respuesta esperada | Captura |
|---|---|---|---|---|---|
| GET | `{{baseUrl}}/users` | Lista usuarios visibles | No | `200`, arreglo `users` | Lista y `storage: mongodb` |
| POST | `{{baseUrl}}/users` | Crea usuario como administrador | U1 | `201`, usuario creado | Body, status 201 e ID |
| GET | `{{baseUrl}}/users/me` | Perfil del token | No | `200`, usuario actual | Respuesta sin password |
| GET | `{{baseUrl}}/users/{{userId}}` | Consulta usuario por ID | No | `200` o `404` | ID en URL y respuesta |
| PATCH | `{{baseUrl}}/users/{{userId}}` | Actualiza nombre, correo, telefono, rol o activo | U2 | `200`, usuario actualizado | Antes/despues |
| DELETE | `{{baseUrl}}/users/{{userId}}` | Elimina usuario; solo admin | No | `200`, usuario eliminado | Respuesta de eliminacion |

Body U1. Se aceptan nombres de campos en espanol o ingles:

```json
{
  "nombre": "Alejandro Ojeda",
  "email": "alejandro.taller3@geokipu.com",
  "password": "Alejandro1",
  "confirmPassword": "Alejandro1",
  "idioma": "es",
  "cedula": "1712345600",
  "telefono": "0999999999",
  "rol": "persona"
}
```

Body U2:

```json
{
  "active": true,
  "telefono": "0988888888"
}
```

## 4. Groups

| Metodo | URL | Descripcion | Body | Respuesta esperada | Captura |
|---|---|---|---|---|---|
| GET | `{{baseUrl}}/groups` | Lista grupos accesibles | No | `200`, arreglo `groups` | Lista de grupos |
| POST | `{{baseUrl}}/groups` | Crea grupo y agrega al creador | G1 | `201`, grupo con ID | Body y grupo creado |
| GET | `{{baseUrl}}/groups/{{groupId}}` | Obtiene grupo con miembros | No | `200` | Grupo e integrantes |
| PATCH | `{{baseUrl}}/groups/{{groupId}}` | Actualiza nombre/descripcion | G2 | `200` | Descripcion actualizada |
| DELETE | `{{baseUrl}}/groups/{{groupId}}` | Elimina grupo y datos relacionados | No | `200` | Confirmacion de eliminacion |

Body G1:

```json
{
  "nombre": "Familia Ojeda",
  "descripcion": "Grupo para compartir ubicacion familiar"
}
```

Body G2:

```json
{
  "descripcion": "Grupo actualizado desde Postman"
}
```

## 5. Group Members

| Metodo | URL | Descripcion | Body | Respuesta esperada | Captura |
|---|---|---|---|---|---|
| GET | `{{baseUrl}}/groups/{{groupId}}/members` | Lista integrantes | No | `200`, arreglo `members` | Miembros del grupo |
| POST | `{{baseUrl}}/groups/{{groupId}}/members` | Agrega usuario registrado o contacto | M1 o M2 | `201`, miembro creado | Miembro e ID |
| PATCH | `{{baseUrl}}/groups/{{groupId}}/members/{{memberId}}` | Actualiza relacion/estado | M3 | `200` | Estado actualizado |
| PATCH | `{{baseUrl}}/groups/{{groupId}}/members/{{memberId}}/location-status` | Cambia solo estado de ubicacion | M4 | `200` | Estado sharing/paused/offline |
| DELETE | `{{baseUrl}}/groups/{{groupId}}/members/{{memberId}}` | Elimina integrante no creador | No | `200` | Confirmacion |

Body M1 para usuario registrado:

```json
{
  "email": "alejandro.taller3@geokipu.com",
  "relacion": "Hermano"
}
```

Body M2 para contacto no registrado:

```json
{
  "nombre": "Camila Torres",
  "email": "camila.contacto@example.com",
  "telefono": "0991112222",
  "cedula": "1710000017",
  "relacion": "Hermana"
}
```

Body M3 y M4:

```json
{
  "relation": "Contacto de confianza",
  "locationStatus": "paused"
}
```

```json
{
  "locationStatus": "sharing"
}
```

## 6. Locations

| Metodo | URL | Descripcion | Body | Respuesta esperada | Captura |
|---|---|---|---|---|---|
| GET | `{{baseUrl}}/locations` | Lista ubicaciones visibles | No | `200`, contador y ubicaciones | Lista desde MongoDB |
| POST | `{{baseUrl}}/locations` | Guarda ubicacion de usuario/grupo | L1 | `201`, ubicacion con ID | Coordenadas e ID |
| GET | `{{baseUrl}}/locations/{{locationId}}` | Consulta ubicacion por ID | No | `200` | Ubicacion individual |
| PATCH | `{{baseUrl}}/locations/{{locationId}}` | Actualiza coordenadas/estado | L2 | `200` | Coordenadas actualizadas |
| DELETE | `{{baseUrl}}/locations/{{locationId}}` | Elimina ubicacion | No | `200` | Confirmacion |
| GET | `{{baseUrl}}/locations/group/{{groupId}}` | Ultimas ubicaciones del grupo | No | `200`, arreglo | Marcadores del grupo |
| GET | `{{baseUrl}}/locations/user/{{userId}}` | Ultima ubicacion del usuario | No | `200` | Ubicacion del usuario |
| PATCH | `{{baseUrl}}/locations/user/{{userId}}/status` | Activa/pausa por usuario | L3 | `200` | Estado actualizado |

Body L1:

```json
{
  "usuarioId": 5,
  "grupoId": 2,
  "latitud": -0.1807,
  "longitud": -78.4678,
  "precision": 15,
  "direccion": "Quito, Ecuador",
  "sector": "La Carolina",
  "compartiendo": true
}
```

Body L2 y L3:

```json
{
  "latitude": -0.181,
  "longitude": -78.468,
  "address": "La Carolina, Quito"
}
```

```json
{
  "sharing": false
}
```

## 7. Location Sharing

Estas rutas son las utilizadas por frontend/mobile y se mantienen separadas del CRUD administrativo.

| Metodo | URL | Descripcion | Body | Respuesta esperada | Captura |
|---|---|---|---|---|---|
| POST | `{{baseUrl}}/location/share/start` | Activa ubicacion del usuario del token | `{}` | `200`, `sharing: true` | Activacion exitosa |
| POST | `{{baseUrl}}/location/update` | Envia GPS del usuario del token | S1 | `200`, ubicacion | Coordenadas GPS |
| POST | `{{baseUrl}}/location/share/stop` | Pausa ubicacion | `{}` | `200`, `sharing: false` | Pausa exitosa |
| GET | `{{baseUrl}}/location/group/{{groupId}}` | Consulta ubicaciones de grupo | No | `200` | Ubicaciones compartidas |
| GET | `{{baseUrl}}/location/user/{{userId}}` | Consulta ubicacion de usuario | No | `200` | Ultima ubicacion |
| PATCH | `{{baseUrl}}/location/user/{{userId}}/status` | Cambia estado por ID | L3 | `200` | Estado actualizado |
| GET | `{{baseUrl}}/location/{{userId}}` | Alias compatible de consulta | No | `200` | Respuesta compatible |
| PATCH | `{{baseUrl}}/location/share` | Alias compatible para activar/pausar | L3 | `200` | Respuesta compatible |

Para estas tres primeras pruebas iniciar sesion como `persona@geokipu.com`.

Body S1:

```json
{
  "groupId": 1,
  "latitude": -0.1807,
  "longitude": -78.4678,
  "accuracy": 15,
  "heading": null,
  "speed": null,
  "address": "Quito, Ecuador",
  "sector": "La Carolina"
}
```

## 8. Maps / Geoapify

| Metodo | URL | Descripcion | Body | Respuesta esperada | Captura |
|---|---|---|---|---|---|
| GET | `{{baseUrl}}/maps/status` | Estado de Geoapify | No | `200`, `configured` y `mode` | Estado del proveedor |
| GET | `{{baseUrl}}/maps/geocode?text=Quito` | Direccion a coordenadas | No | `200` con clave; `503` controlado sin clave | Resultado o fallback controlado |
| GET | `{{baseUrl}}/maps/reverse?lat=-0.1807&lon=-78.4678` | Coordenadas a direccion | No | `200` o `503` controlado | Respuesta Geoapify |
| GET | `{{baseUrl}}/maps/routing?from=-0.1807,-78.4678&to=-0.2299,-78.5249` | Calcula ruta | No | `200` o `503` | Ruta devuelta |
| GET | `{{baseUrl}}/maps/places?lat=-0.1807&lon=-78.4678&category=commercial` | Lugares cercanos | No | `200` o `503` | Lugares encontrados |
| GET | `{{baseUrl}}/maps/isoline?lat=-0.1807&lon=-78.4678&type=time&mode=walk&range=600` | Zona alcanzable | No | `200` o `503` | Isolinea devuelta |
| POST | `{{baseUrl}}/maps/mock-route` | Genera ruta local simulada | MAP1 | `201`, tres puntos y distancia | Ruta simulada |

Body MAP1:

```json
{
  "from": { "latitude": -0.1807, "longitude": -78.4678 },
  "to": { "latitude": -0.2299, "longitude": -78.5249 }
}
```

## Orden recomendado para evidencias

1. Health con `storage: mongodb`.
2. Login admin y token.
3. Crear/listar usuario.
4. Crear/listar grupo.
5. Agregar/listar integrante.
6. Crear/listar ubicacion.
7. Login persona, iniciar, actualizar y detener ubicacion.
8. Estado Geoapify y geocode.
9. `mongosh` mostrando las cuatro colecciones.

No reutilizar cédulas, correos o telefonos existentes al repetir las pruebas. Ejecutar la carpeta `Limpieza opcional` de la coleccion para poder repetir el flujo.
