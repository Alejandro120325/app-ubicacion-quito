# Frontend - App Ubicacion Quito

Interfaz React con Vite y Tailwind CSS para probar login, registro, rutas protegidas, panel admin y panel persona.

## Instalacion

```bash
npm install
```

## Ejecucion

```bash
npm run dev
```

El frontend usa por defecto `http://localhost:5173`.

## Variables de entorno

Copia `.env.example` a `.env` si necesitas cambiar la URL del backend.

```txt
VITE_API_URL=http://localhost:4000/api
```

## Rutas

- `/`
- `/login`
- `/register`
- `/admin/dashboard`
- `/persona/dashboard`
- `/unauthorized`

## Nota

El mapa es visual y simulado. No usa API externa todavia.
