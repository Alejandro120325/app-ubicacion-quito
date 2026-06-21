# App Ubicacion Quito

Aplicacion web inicial para visibilizar la ubicacion simulada de una persona en Quito y alrededores. Esta version esta pensada como una primera entrega universitaria: profesional, entendible y lista para crecer sin usar todavia base de datos, Firebase ni autenticacion compleja.

## Objetivo

Construir una base full-stack separada en frontend y backend para probar registro, login, roles y estados de ubicacion simulada.

## Descripcion general

El sistema tiene dos perfiles:

- `admin`: visualiza personas registradas, estados activos/inactivos, alertas simuladas y una tarjeta tipo mapa.
- `persona`: entra a su panel, revisa sus datos y activa o desactiva el uso compartido de ubicacion.

Toda la informacion se guarda en arreglos en memoria dentro del backend. Al reiniciar el servidor, los registros nuevos se pierden porque todavia no existe base de datos.

## Tecnologias usadas

- Frontend: React, Vite, Tailwind CSS, React Router DOM, Framer Motion, Axios y Lucide React.
- Backend: Node.js, Express, CORS, dotenv y nodemon.
- Datos: arreglos en memoria, sin base de datos.
- Autenticacion: token simulado preparado para reemplazarse despues por JWT.

## Estructura del repositorio

```txt
app-ubicacion-quito/
├── frontend/
├── backend/
├── docs/
├── scrum/
├── .gitignore
└── README.md
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

## Rutas principales del frontend

- `/`: pagina principal.
- `/login`: inicio de sesion.
- `/register`: registro de cuenta tipo persona.
- `/admin/dashboard`: panel del administrador.
- `/persona/dashboard`: panel de persona.
- `/unauthorized`: acceso no autorizado.
- `*`: pagina 404.

## Rutas principales del backend

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/users`
- `GET /api/users/me`
- `GET /api/location/:userId`
- `PATCH /api/location/share`

Las rutas protegidas usan el header:

```txt
Authorization: Bearer token-simulado-1
```

El token se recibe al iniciar sesion. Tambien se acepta `Bearer token-simulado` para pruebas simples.

## Reglas para trabajar en equipo con GitHub

- No subir `node_modules`, `.env` ni archivos generados como `dist`.
- Antes de empezar una tarea, hacer `git pull` desde la rama base.
- Trabajar en ramas pequeñas y con nombres claros.
- Hacer commits con mensajes descriptivos.
- Abrir pull request hacia `dev` antes de unir cambios a `main`.
- Revisar que frontend y backend sigan separados.
- No modificar archivos de `.idea` si no es estrictamente necesario.

## Ramas recomendadas

- `main`: version estable del proyecto.
- `dev`: integracion de avances del equipo.
- `feature/frontend`: cambios de interfaz, componentes y rutas React.
- `feature/backend`: endpoints, controladores, validaciones y datos del servidor.
