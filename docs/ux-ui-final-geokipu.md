# GeoKipu - Ajuste UX/UI final web y mobile

## Navegación limpia

Se ocultaron de la navegación visible para usuarios finales:

- API.
- Endpoints locales.
- Accesos a información técnica de integración.

Las rutas y archivos técnicos pueden seguir existiendo para revisión, Postman o documentación, pero ya no aparecen en sidebar web ni en tabs mobile.

## Mejoras UX/UI aplicadas

- Sidebar web orientado a usuario: Inicio, Panel, Personas, Grupos, Mapa, Alertas, Bitácora, Perfil, Soporte y Acerca de nosotros.
- Bottom navigation mobile con labels más cortos: Home, Pers., Grupos, Mapa, Alertas, Bita., Perfil, Sop. y Salir.
- Mayor padding inferior en mobile para evitar que la barra inferior tape contenido.
- Formularios de Login y Register con inputs de altura uniforme, botones alineados, cards centradas y mejor balance responsive.
- Registro web reorganizado con columna informativa y formulario proporcional; los botones `Volver al login`, `Volver al inicio` y `Crear cuenta` quedan alineados.
- Registro mobile con acciones superiores simétricas, formulario en card premium e indicador de seguridad de contraseña más claro.
- Textos técnicos reemplazados por lenguaje de producto:
  - "Modo demostración activo".
  - "Mapa de ubicación".
  - "Vista de referencia".
  - "Seguimiento con consentimiento".
- Login mobile sin mostrar URL de API ni variables técnicas cuando falla.
- Soporte simplificado para ayuda operativa, reporte de problemas y contacto rápido.
- Acerca de nosotros concentra equipo, contacto institucional, redes sociales y oficinas.

## Footer y contacto

Se agregó un footer profesional en frontend web con:

- Integrantes: Alejandro Ojeda, Juan Figueroa, Josue Vele y Christian Carrion.
- Empresa: GeoKipu.
- Correo: `contacto@geokipu.com`.
- Teléfono: `+593 99 845 6721`.
- Dirección: Av. República E7-123 y Eloy Alfaro, Quito, Ecuador.
- Horario: lunes a viernes, 09h00 - 18h00.
- Redes sociales: GitHub, LinkedIn e Instagram.
- Tarjeta de oficinas con botón `Ver en Google Maps`.

El footer aparece solo en el inicio público:

- `/`.

El footer ya no aparece en login, register, dashboards ni pantallas autenticadas.

Para usuarios autenticados se creó la sección:

- `/admin/acerca`.
- `/persona/acerca`.

Esa pantalla muestra equipo, empresa, contacto, redes sociales y oficinas.

En mobile no se agregó una pestaña nueva para no saturar el bottom navigation. La pantalla Soporte se dividió en dos bloques:

- Soporte técnico: tutorial, reporte de problemas, correo y llamada.
- Acerca de nosotros: equipo, empresa, redes sociales y oficinas con Google Maps usando `Linking.openURL()`.

Backend y Angular no fueron modificados para este ajuste.

## Guías por sección

Cada pantalla principal tiene una tarjeta integrada con el título `Qué puedes hacer aquí?`, una descripción corta, hasta tres puntos de acción y el botón `Entendido`.

Cuando el usuario pulsa `Entendido`, la preferencia queda guardada y la tarjeta se reemplaza por un botón discreto `Ver ayuda` para abrirla nuevamente.

Web guarda estado en `localStorage` con claves:

- `geokipu_guide_home_seen`
- `geokipu_guide_admin_seen`
- `geokipu_guide_persona_seen`
- `geokipu_guide_people_seen`
- `geokipu_guide_groups_seen`
- `geokipu_guide_map_seen`
- `geokipu_guide_alerts_seen`
- `geokipu_guide_activity_seen`
- `geokipu_guide_profile_seen`
- `geokipu_guide_privacy_seen`
- `geokipu_guide_support_seen`
- `geokipu_guide_about_seen`

Mobile guarda el mismo concepto en SecureStore, o en localStorage cuando corre en web, usando claves `geokipu_guide_<seccion>_seen`.

Secciones con guía:

- Inicio.
- Panel administrador.
- Panel persona.
- Personas.
- Grupos.
- Mapa / Mi ubicación.
- Alertas.
- Bitácora.
- Perfil.
- Privacidad en web.
- Soporte.
- Acerca de nosotros en web.

La guía general inicial sigue existiendo como onboarding. Las guías por sección son ayudas breves dentro de cada pantalla para explicar acciones puntuales sin lenguaje técnico.

## Alertas vs Bitácora

- Alertas: solo eventos importantes que requieren atención, como GPS desactivado, desconexión, SOS o ubicación pausada.
- Bitácora: historial completo de acciones, login, perfil, ubicación, grupos, integrantes y sistema.

## Prueba web

```powershell
cd frontend
npm install
npm run build
npm run dev
```

Verificar:

1. No aparece `API` en sidebar.
2. No aparece `Endpoints locales`.
3. Home y paneles muestran ayudas compactas.
4. Grupos, Mapa, Alertas, Bitácora, Perfil y Soporte mantienen navegación normal.
5. Los textos principales no muestran información técnica.
6. El footer solo aparece en `/` cuando no hay sesión activa.
7. `/login` y `/register` no muestran footer.
8. Los dashboards no muestran footer.
9. Admin y Persona tienen ruta `Acerca de nosotros`.

## Prueba mobile

```powershell
cd mobile
npm install
npx expo-doctor
npm run typecheck
npx expo start
```

Verificar:

1. No aparece `API` en tabs.
2. Labels inferiores no se cortan.
3. La barra inferior no tapa el final del contenido.
4. Cada sección muestra ayuda compacta la primera vez.
5. Alertas y Bitácora se mantienen separadas.
6. Login no muestra URL técnica de API ante errores.
7. Soporte muestra los bloques Soporte técnico y Acerca de nosotros.
