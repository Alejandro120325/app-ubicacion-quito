# Mobile

App movil Expo/React Native para GeoKipu. La interfaz adapta el
frontend web existente a una experiencia responsive/mobile con tema oscuro,
tarjetas compactas, mapas simulados, navegacion por rol y conexion al backend
para autenticacion, registro, usuarios, ubicacion y grupos.

## Requisitos

- Node.js instalado.
- Backend del proyecto levantado si quieres usar datos reales:

```bash
cd ../backend
npm install
npm run dev
```

Por defecto el backend expone la API en `http://localhost:4000/api`.

## Instalacion

```bash
cd mobile
npm install
```

## Configurar URL del backend

Crea un archivo `.env` dentro de `/mobile` tomando como base `.env.example`:

```bash
EXPO_PUBLIC_API_URL=http://localhost:4000/api
EXPO_PUBLIC_APP_NAME=GeoKipu
```

Si no creas `.env`, la app usa automaticamente:

- Android emulator: `http://10.0.2.2:4000/api`
- Web/iOS simulator: `http://localhost:4000/api`

Si necesitas sobrescribir la URL, usa una de estas opciones:

- Web/local: `http://localhost:4000/api`
- Android emulator: `http://10.0.2.2:4000/api`
- Dispositivo fisico: `http://IP_DEL_PC:4000/api`

Reinicia Expo despues de cambiar variables de entorno.

## Ejecutar

```bash
npm start
```

Luego abre la app con Expo Go, Android emulator, iOS simulator o web:

```bash
npm run android
npm run ios
npm run web
```

## Verificar TypeScript

```bash
npm run typecheck
```

## Credenciales de prueba

- Admin: `admin@geokipu.com` / `Admin123`
- Persona: `persona@geokipu.com` / `Persona123`

Los correos anteriores `@quitoapp.com` siguen aceptados temporalmente por el backend.

## Pantallas implementadas

- Bienvenida / landing
- Login con credenciales demo y mostrar/ocultar contrasena
- Registro persona con validaciones
- Admin: Home, Personas, Grupos, Mapa, Alertas, API y Cerrar sesion
- Persona: Inicio, Mi ubicacion, Mi grupo, Alertas, Perfil y Cerrar sesion

## Backend y datos simulados

La app consume el backend real para:

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/users`
- `GET /api/users/me`
- `GET /api/location/:userId`
- `PATCH /api/location/share`
- `GET /api/groups`

Si el backend no esta disponible, las pantallas protegidas muestran datos
simulados equivalentes a los del proyecto web/backend para que el flujo visual
se pueda revisar sin bloquear la navegacion.
