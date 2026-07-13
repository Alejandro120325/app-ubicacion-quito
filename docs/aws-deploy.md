# Preparacion AWS de GeoKipu

No se realiza ningun despliegue automaticamente. Esta guia describe la arquitectura objetivo.

```txt
React/Vite -> AWS Amplify
Express/Node.js -> AWS Elastic Beanstalk
PostgreSQL -> Supabase
Mapas/geocodificacion -> Geoapify mediante backend
```

## Backend en Elastic Beanstalk

Directorio de aplicacion: `/backend`.

`package.json` ya contiene:

```json
{
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js"
  }
}
```

`server.js` usa `process.env.PORT || 4000`, requerido por Elastic Beanstalk.

Variables a configurar en el entorno:

```env
APP_NAME=GeoKipu
FRONTEND_URL=https://rama.dominio.amplifyapp.com
SUPABASE_URL=https://proyecto.supabase.co
SUPABASE_ANON_KEY=valor_anon
SUPABASE_SERVICE_ROLE_KEY=valor_service_role
GEOAPIFY_API_KEY=valor_geoapify
```

No incluir `.env`, `node_modules` ni claves en el ZIP. Tras desplegar, verificar `/`, `/api/maps/status` y un login.

## Frontend en Amplify

- Conectar el repositorio.
- App root: `frontend`.
- Build command: `npm run build`.
- Output directory: `dist`.
- Variable de entorno:

```env
VITE_API_URL=https://backend.elasticbeanstalk.com/api
VITE_APP_NAME=GeoKipu
```

Despues de obtener el dominio Amplify, actualizar `FRONTEND_URL` en Elastic Beanstalk. Para varias ramas, separar origenes con comas.

## Verificacion HTTPS

La Geolocation API requiere HTTPS fuera de localhost. Amplify proporciona HTTPS; el backend tambien debe exponerse por HTTPS para evitar contenido mixto.

## Pendientes manuales

1. Crear ambientes AWS.
2. Configurar dominios, variables y certificados.
3. Ejecutar el esquema Supabase.
4. Configurar una clave Geoapify real en backend.
5. Probar CORS, logs y flujo GPS con dos cuentas.
