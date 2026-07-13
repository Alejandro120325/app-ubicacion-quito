# Probar GeoKipu con Expo Go

La carpeta `/mobile` pertenece al cliente Expo existente y no fue redisenada.

## Preparacion

```powershell
cd mobile
npm install
Copy-Item .env.example .env
npx expo start
```

Instalar Expo Go en el telefono y escanear el codigo QR mostrado por Expo.

## URL del backend

En un dispositivo fisico, `localhost` apunta al telefono. Usar la IP local del computador:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.20:4000/api
EXPO_PUBLIC_APP_NAME=GeoKipu
```

El telefono y el computador deben estar en la misma red. Permitir el puerto 4000 en el firewall solo para la red privada.

Para backend desplegado usar su URL HTTPS.

## Pruebas

1. Abrir GeoKipu en Expo Go.
2. Probar login admin y persona.
3. Revisar grupos y ubicacion.
4. Confirmar mensajes de error si el backend no esta disponible.
5. Probar permisos GPS solo si la implementacion mobile actual los soporta.

Para generar APK se requiere configurar posteriormente EAS Build. Esa publicacion no forma parte de esta preparacion.
