# Investigacion de API aplicable al proyecto

Proyecto: `Quito Ubicacion Segura`

Fuente inicial solicitada por la docente: https://apilandscape.apiscene.io/

La pagina API Landscape muestra un panorama general de categorias del ecosistema API y fue revisada como punto de partida. Para una app de ubicacion de personas en Quito, la categoria aplicable es una plataforma de mapas/geolocalizacion. La API seleccionada para el analisis es Geoapify Location Platform.

## 1. API seleccionada

Nombre: Geoapify Location Platform

Empresa proveedora: Geoapify GmbH

Tipo de empresa: plataforma SaaS/API de mapas, geolocalizacion y servicios de ubicacion.

Sitios revisados:

- API Landscape: https://apilandscape.apiscene.io/
- Geoapify: https://www.geoapify.com/
- Documentacion oficial: https://apidocs.geoapify.com/docs/
- Precios: https://www.geoapify.com/pricing/
- Detalle de creditos: https://www.geoapify.com/pricing-details/

## 2. Servicios que ofrece

Geoapify ofrece servicios utiles para una futura version real de la app:

- Mapas y tiles para mostrar mapas reales.
- Geocoding: convertir una direccion o texto de busqueda en coordenadas.
- Reverse geocoding: convertir latitud/longitud en direccion legible.
- Routing: calcular rutas caminando, en carro, bicicleta o camion.
- Places API: buscar puntos de interes por categorias y zonas.
- Isoline API: calcular areas alcanzables por tiempo o distancia.
- Route Matrix: calcular tiempos/distancias entre varios puntos.
- Boundaries y geometria para limites administrativos o analisis espacial.

## 3. Costo de uso

Segun la pagina oficial de precios de Geoapify consultada el 24 de junio de 2026:

- Plan Free: 3,000 creditos por dia.
- No requiere tarjeta de credito para empezar.
- Planes pagados desde API 10 con 10,000 creditos por dia.
- El costo depende de creditos. En general, solicitudes simples como Geocoding, Reverse Geocoding, Places o Routing suelen contarse como 1 credito por request, con variaciones segun complejidad.

Nota: los precios pueden cambiar. Antes de entregar o integrar en produccion se debe validar nuevamente la pagina oficial de Geoapify.

## 4. Por que aplica a Quito Ubicacion Segura

La app actualmente usa ubicacion simulada. Geoapify permitiria evolucionar hacia una version real sin cambiar el enfoque principal del proyecto:

- Mostrar un mapa real de Quito.
- Convertir sectores como "La Carolina" o "Centro Historico" en coordenadas.
- Convertir coordenadas futuras del usuario en direcciones legibles.
- Calcular rutas entre integrantes de un grupo.
- Buscar lugares cercanos utiles, por ejemplo hospitales, UPC, estaciones o puntos seguros.
- Mantener la ubicacion bajo consentimiento: solo cuando el usuario active compartir ubicacion.

## 5. Endpoints implementados

El navegador consume el backend propio y nunca recibe la clave del proveedor:

```txt
http://localhost:4000/api/maps
```

Endpoints propuestos:

```txt
GET /api/maps/geocode
GET /api/maps/reverse
GET /api/maps/routing
GET /api/maps/places
GET /api/maps/isoline
```

## 6. Ejemplos de uso

Buscar coordenadas de un sector en Quito:

```txt
GET http://localhost:4000/api/maps/geocode?text=La%20Carolina%20Quito
```

Obtener direccion a partir de coordenadas:

```txt
GET http://localhost:4000/api/maps/reverse?lat=-0.1807&lon=-78.4678
```

Calcular ruta entre dos puntos:

```txt
GET http://localhost:4000/api/maps/routing?from=-0.1807,-78.4678&to=-0.2202,-78.5127
```

Buscar lugares cercanos:

```txt
GET http://localhost:4000/api/maps/places?lat=-0.1807&lon=-78.4678&category=healthcare
```

Calcular area alcanzable:

```txt
GET http://localhost:4000/api/maps/isoline?lat=-0.1807&lon=-78.4678&type=time&mode=walk&range=900
```

## 7. Variables de entorno necesarias

No se debe quemar ninguna API key en el codigo.

Backend:

```env
GEOAPIFY_API_KEY=tu_api_key_aqui
```

## 8. Riesgos y limites

- Costos: si el uso crece, se pueden consumir creditos y requerir plan pagado.
- Privacidad: una ubicacion real es dato sensible. Se debe pedir consentimiento claro.
- Seguridad: la API key debe ir en variables de entorno y limitarse por dominio si el proveedor lo permite.
- Internet: la app dependeria de conectividad y disponibilidad de Geoapify.
- Exactitud: direcciones y rutas pueden variar segun datos disponibles.
- Cumplimiento: se debe mostrar atribucion del proveedor si el plan lo requiere.

## 9. Recomendacion final

La primera integracion ya deja disponible reverse geocoding para coordenadas GPS consentidas y los cinco endpoints internos. Mientras no exista clave, la interfaz conserva el mapa simulado. Una siguiente version puede incorporar tiles reales:

1. Geocoding de sectores de Quito.
2. Reverse geocoding para coordenadas reales autorizadas.
3. Mapa real con marcadores.
4. Rutas entre integrantes de un grupo.
5. Lugares seguros cercanos.

La integracion debe hacerse siempre con consentimiento del usuario y sin rastreo oculto.
