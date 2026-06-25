# Quito Ubicacion Segura

Aplicacion full-stack academica para compartir ubicacion simulada de forma segura en Quito y alrededores.

La app esta pensada como base profesional para evolucionar hacia ubicacion en tiempo real, manteniendo una regla central: la ubicacion solo se comparte con consentimiento del usuario. No hay rastreo oculto.

## Funcionalidades

- Landing page premium con fondo animado tipo mapa urbano.
- Login por rol: admin y persona.
- Registro de cuenta tipo persona.
- Dashboard admin con personas, mapa simulado, alertas y grupos.
- Dashboard persona con control de compartir/pausar ubicacion.
- Grupos familiares/amigos simulados en memoria.
- Integrantes con relacion, telefono, cedula, estado de ubicacion y ultimo punto simulado.
- Selector de tema visual.
- Modo claro/oscuro.
- Internacionalizacion inicial: Espanol Latino e Ingles Americano.
- Investigacion de API aplicable al proyecto: Geoapify Location Platform.

## Tecnologias

- Frontend: React, Vite, Tailwind CSS, React Router DOM, Framer Motion, Axios y Lucide React.
- Backend: Node.js, Express, CORS y dotenv.
- Datos: arreglos en memoria, sin base de datos real.
- Autenticacion: token simulado para pruebas academicas.

## Estructura

```txt
app-ubicacion-quito/
  frontend/
  backend/
  docs/
  README.md
```

## Credenciales de prueba

Admin:

- Email: `admin@quitoapp.com`
- Password: `Admin123`
- Rol: `admin`

Persona:

- Email: `persona@quitoapp.com`
- Password: `Persona123`
- Rol: `persona`

## Ejecutar backend

```bash
cd backend
npm install
npm run dev
```

URL por defecto:

```txt
http://localhost:4000
```

## Ejecutar frontend

```bash
cd frontend
npm install
npm run dev
```

URL por defecto:

```txt
http://localhost:5173
```

## Variables de entorno

Backend:

```env
PORT=4000
FRONTEND_URL=http://localhost:5173
```

Frontend:

```env
VITE_API_URL=http://localhost:4000/api
VITE_MAP_API_KEY=tu_api_key_aqui
VITE_MAP_PROVIDER=geoapify
```

No se debe subir una API key real al repositorio.

## Rutas frontend

- `/`: pagina principal.
- `/login`: inicio de sesion.
- `/register`: registro.
- `/admin/dashboard`: dashboard admin.
- `/admin/api`: investigacion visual de API.
- `/persona/dashboard`: dashboard persona.
- `/unauthorized`: acceso no autorizado.

## Endpoints backend

Autenticacion:

- `POST /api/auth/login`
- `POST /api/auth/register`

Usuarios:

- `GET /api/users`
- `GET /api/users/me`

Ubicacion:

- `GET /api/location/:userId`
- `PATCH /api/location/share`

Grupos simulados:

- `GET /api/groups`
- `POST /api/groups`
- `GET /api/groups/:groupId`
- `POST /api/groups/:groupId/members`
- `PATCH /api/groups/:groupId/members/:memberId/location-status`

Las rutas protegidas usan:

```txt
Authorization: Bearer token-simulado-1
```

## Grupos familiares/amigos

Los grupos se guardan en memoria dentro del backend. Sirven para simular circulos de confianza:

- Familia.
- Amigos seguros.
- Contactos de emergencia.

Cada integrante puede tener:

- nombres completos
- correo
- telefono ecuatoriano
- cedula ecuatoriana
- relacion dentro del grupo
- estado: compartiendo, pausado o sin conexion
- ultima ubicacion simulada

## API investigada

API seleccionada: Geoapify Location Platform.

Sirve para una futura integracion con:

- mapas reales
- geocoding
- reverse geocoding
- rutas
- lugares cercanos
- isolineas

Documento completo:

```txt
docs/api-investigacion.md
```

Seccion visual:

```txt
/admin/api
```

## Verificacion

```bash
cd frontend
npm run build
```

El proyecto no usa Firebase, no usa base de datos real y no solicita permisos reales de GPS en esta version.
