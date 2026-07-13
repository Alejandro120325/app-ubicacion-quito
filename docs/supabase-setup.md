# Configurar Supabase para GeoKipu

## 1. Crear el proyecto

1. Crear un proyecto en Supabase.
2. Esperar a que PostgreSQL quede disponible.
3. Abrir **SQL Editor**.
4. Ejecutar todo el contenido de `docs/supabase-schema.sql`.

El script crea `profiles`, `groups`, `group_members`, `locations`, indices y datos academicos de demostracion.

## 2. Obtener variables

En **Project Settings > API** copiar:

- Project URL como `SUPABASE_URL`.
- `anon` key como `SUPABASE_ANON_KEY`.
- `service_role` key como `SUPABASE_SERVICE_ROLE_KEY`.

Configurar exclusivamente en el backend:

```env
SUPABASE_URL=https://proyecto.supabase.co
SUPABASE_ANON_KEY=valor_anon
SUPABASE_SERVICE_ROLE_KEY=valor_service_role
```

La service role nunca debe colocarse en React, Amplify, Expo ni una coleccion Postman compartida.

## 3. Verificar

Reiniciar el backend:

```powershell
cd backend
npm start
```

Con variables validas debe mostrar `Supabase conectado`. Sin variables muestra `Supabase no configurado. Usando almacenamiento en memoria.`

Probar registro, grupos y ubicaciones con `docs/postman-pruebas.md` y confirmar los registros desde **Table Editor**.

## Seguridad pendiente

El login actual conserva contrasenas y tokens simulados por compatibilidad academica. Antes de produccion publica se debe migrar autenticacion a Supabase Auth y definir politicas RLS para usuarios finales.
