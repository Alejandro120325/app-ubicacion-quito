# GeoKipu - Grupos, Alertas y Bitacora

Este documento resume los ajustes usados antes de generar una nueva APK. La app mantiene el backend local en `http://localhost:4000/api`, React en `/frontend` y Expo en `/mobile`.

## 1. Diferencia entre Alertas y Bitacora

- **Bitacora**: historial cronologico completo. Incluye login, logout, perfil actualizado, ubicacion actualizada, ubicacion pausada, GPS desactivado, desconexion, persona eliminada, grupo creado, grupo editado, grupo eliminado, integrante agregado, integrante editado, integrante eliminado y salida de grupo.
- **Alertas**: solo eventos que requieren atencion. Incluye prioridad `warning` o `high`, o tipos `gps_disabled`, `disconnection`, `emergency`, `location_paused`, `device_offline`, `sos` y `group_deleted`.

## 2. Endpoints usados

Todos los endpoints protegidos usan:

```http
Authorization: Bearer token-simulado-1
```

### Grupos

- `GET /api/groups`
- `POST /api/groups`
- `GET /api/groups/:groupId`
- `PATCH /api/groups/:groupId`
- `DELETE /api/groups/:groupId`

### Personas

- `GET /api/users`
- `GET /api/users/:id`
- `DELETE /api/users/:id`

Reglas:

- Solo un administrador puede eliminar personas registradas.
- Un administrador no puede eliminar su propia cuenta.
- Si existen cuentas administradoras visibles en la base, no se debe eliminar el ultimo administrador.
- Al eliminar una persona, se limpian sus membresias y ubicaciones asociadas.

### Integrantes

- `GET /api/groups/:groupId/members`
- `POST /api/groups/:groupId/members`
- `PATCH /api/groups/:groupId/members/:memberId`
- `DELETE /api/groups/:groupId/members/:memberId`
- `DELETE /api/groups/:groupId/members/me`
- `PATCH /api/groups/:groupId/members/:memberId/location-status`

Reglas:

- Un administrador puede eliminar cualquier integrante de cualquier grupo.
- Una persona solo puede eliminar integrantes si creo el grupo.
- Una persona integrante puede salir del grupo con `/members/me` si no es la creadora.
- Quitar un integrante no elimina la cuenta global.

### Bitacora

- `GET /api/activity`
- `POST /api/activity`
- `PATCH /api/activity/:id/read`
- `DELETE /api/activity/:id`

### Alertas

- `GET /api/alerts`
- `POST /api/alerts`
- `PATCH /api/alerts/:id/read`
- `DELETE /api/alerts/:id`

## 3. Gestion de grupos

En web y mobile se agregaron acciones para:

- Ver detalles del grupo.
- Editar nombre y descripcion.
- Eliminar grupo con confirmacion.
- Agregar integrante.
- Editar integrante.
- Eliminar integrante con confirmacion.
- Salir de un grupo cuando el usuario pertenece al grupo y no es la persona creadora.

Al quitar un integrante, solo se desvincula del grupo. No se elimina el usuario global.

## 4. Eventos automaticos

El backend registra eventos automaticos en `ActivityEvent` para:

- `login` con prioridad `info`.
- `logout` desde frontend/mobile con prioridad `info`.
- `group_created` con prioridad `info`.
- `group_updated` con prioridad `info`.
- `group_deleted` con prioridad `warning`.
- `member_added` con prioridad `info`.
- `member_updated` con prioridad `info`.
- `group_member_removed` con prioridad `info`.
- `group_left` con prioridad `info`.
- `user_deleted` con prioridad `info`.

Los eventos `warning` y `high` aparecen en Bitacora y tambien en Alertas.

## 5. Prueba en web

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

Flujo:

1. Entrar a `http://localhost:5173/login`.
2. Login admin: `admin@geokipu.com` / `Admin123`.
3. Ir a `/admin/grupos`.
4. Crear, editar y eliminar un grupo de prueba.
5. Agregar, editar y eliminar un integrante.
6. Ir a `/admin/bitacora` y confirmar eventos de grupos/integrantes.
7. Ir a `/admin/alertas` y confirmar que solo hay eventos `warning`/`high` o tipos criticos.
8. Crear una alerta `gps_disabled` y probar botones `Llamar` y `Contactar`.
9. Ir a `/admin/personas`, eliminar una persona de prueba y confirmar que desaparece de la lista.

## 6. Prueba en mobile

```powershell
cd mobile
npm install
npx expo start
```

Flujo:

1. Login con el mismo usuario.
2. Abrir Grupos.
3. Ver detalles, editar grupo, agregar/editar/eliminar integrante y eliminar grupo.
4. Con una cuenta persona integrante no creadora, probar `Salir del grupo`.
5. Abrir Alertas y confirmar que solo aparecen eventos importantes.
6. Abrir Bitacora y confirmar que aparece el historial completo.
7. En Alertas, probar `Llamar`, `Contactar`, `Leido` y `Eliminar`.

Si se prueba en emulador Android, usar `EXPO_PUBLIC_API_URL=http://10.0.2.2:4000/api` si Expo no resuelve `localhost`.

## 7. Prueba en Postman

1. Importar `docs/GeoKipu.postman_collection.json` o `docs/GeoKipu_Taller3_FIX.postman_collection.json`.
2. Importar ambiente local si aplica.
3. Ejecutar Login Admin para guardar `authToken`.
4. Ejecutar requests de:
   - `PATCH Editar grupo`.
   - `GET Listar integrantes`.
   - `PATCH Editar integrante`.
   - `DELETE Eliminar integrante`.
   - `DELETE Salir del grupo`.
   - `DELETE Eliminar persona`.
   - `DELETE Eliminar grupo`.
   - `GET Bitacora`.
   - `GET Alertas`.
   - `POST Crear alerta GPS`.
