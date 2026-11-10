# Informe de auditoría, refactorización y seguridad

**Proyecto:** Mentes Brillantes Full Stack — versión auditada 3.2.6  
**Fecha:** 29 de octubre de 2026  
**Alcance:** ZIP `Mentes_Brillantes_Come_Tartas_Panel_Compacto_v3.2.5.zip` (versión recibida más reciente) y correcciones incluidas en esta entrega.  
**Referencia:** [OWASP Top 10:2025](https://top10.owasp.org/2025/).

## 1. Exploración previa (antes de modificar)

Se examinó todo el árbol de archivos del monorepo, el código fuente y los tests originales. Se verificaron los accesos directos, importaciones y dependencias existentes; el repositorio no contiene mecanismos detectados de carga arbitraria de módulos remotos ni tareas programadas en el servidor.

- **Frontend:** `apps/web` — React 19, React Router 7, Vite 7 y TypeScript 5.8; entrada `index.html → src/main.tsx → src/App.tsx`; rutas React `/`, `/juegos/tira-tira`, `/juegos/tira-y-afloja` (redirección), `/juegos/serpientes-y-escaleras`, `/juegos/come-tartas`. Recursos SVG/PNG y animaciones/Web Audio locales; estilos de los juegos separados por carpetas. `HomePage.tsx` solicita el catálogo a `/api/games`.
- **Backend:** `apps/api` — Node.js 20.19+ y Express 4 (`^4.21.2`); entrada `src/server.ts → createApp()`; `presentation/routes/gamesRoutes.ts` y `GamesController.ts` → casos `GetGames` y `GetGameById` → interfaz `GameRepository` → `JsonGameRepository` con archivo `data/games.json`. `GET /api/health`, `GET /api/games`, `GET /api/games?category=...`, `GET /api/games/:id`. Sirve `apps/web/dist` en producción.
- **Persistencia y terceros:** catálogo JSON editable por despliegue; sin PostgreSQL, SQL, subida de archivos, correo, servicios de pago, autenticación, cookies ni almacenamiento de partidas en el servidor. El audio usa la Web Audio API del navegador. No hay procesos de fondo de negocio; Vite/`tsx watch` se usan solo en desarrollo.
- **Scripts disponibles:** `npm run dev`, `npm run build`, `npm run typecheck`, `npm test`, `npm start`. Las pruebas antiguas incluyen lógica de los tres juegos, vistas estáticas y un test HTTP de la API.
- **Dependencias directas:** React `^19.0.0`, React DOM `^19.0.0`, React Router `^7.6.0`, Vite `^7.0.0`, Express `^4.21.2`, TypeScript `^5.8.3`, `tsx` `^4.19.2`, `concurrently` `^9.2.0`, y sus paquetes de tipos/plugin. Los rangos `^` pueden resolver versiones distintas; el ZIP no contiene `package-lock.json`.

### Mapa de datos y límites de confianza

1. El home realiza `fetch('/api/games')` sobre el mismo origen; antes se trataba el JSON como `Game[]` solo por aserción de tipos.
2. La API recibe parámetros HTTP, pasa por controladores/casos de uso y obtiene registros de un JSON **local**. No se recibe una ruta de archivo desde peticiones HTTP.
3. Los títulos y descripciones del catálogo los muestra React como **texto**, con escape automático. El icono procedía de un diccionario de cadenas SVG de la aplicación y se insertaba con `dangerouslySetInnerHTML`. Su procedencia era estática, no texto del usuario, pero el patrón era innecesariamente arriesgado si se extendía en el futuro.
4. Las preguntas, puntuaciones y resultados de los tres juegos se calculan en el navegador. No se envían resultados al backend.

## 2. Diagnóstico de riesgos y estado

| ID | Hallazgo y ubicación original | Severidad | Riesgo | Estado |
|---|---|---|---|---|
| SEC-01 | HTML dinámico para iconos del home (`src/pages/HomePage.tsx`, `dangerouslySetInnerHTML`) | **Media (preventiva)** | Si la fuente de iconos se cambiara a contenido no fiable, podría facilitar XSS DOM; los iconos actuales eran locales y no se confirmó XSS explotable. | **Corregido**: SVG estático cargado como imagen. |
| SEC-02 | Rutas y campos del catálogo aceptados sin validación estricta en el cliente (`src/api/games.ts`) | **Media** | Datos manipulados o un backend comprometido podrían provocar navegación imprevista o errores del frontend. | **Corregido**: análisis y validación en tiempo de ejecución. |
| SEC-03 | Validación laxa del archivo JSON en el backend (`JsonGameRepository.ts`) | **Media** | Podían aceptarse rutas externas, IDs inválidos, órdenes no enteras o IDs repetidos tras una edición errónea o maliciosa del archivo. | **Corregido**: esquema y unicidad validados. |
| SEC-04 | Cabeceras de seguridad ausentes en respuestas de Express (`src/app.ts`) | **Media** | Falta de defensa adicional contra inyección de scripts, clickjacking y lectura de tipos MIME. | **Mitigación implementada**, prueba HTTP pendiente de ejecución. |
| SEC-05 | Sin lockfile ni auditoría npm ejecutable | **Media / riesgo abierto** | Versiones resueltas no reproducibles; CVE reales no verificables sin dependencias instaladas. | **Pendiente**: generar y versionar lockfile y hacer `npm audit`. |
| SEC-06 | Middleware genérico de errores no distinguía `headersSent` | **Baja** | Posible segunda escritura de respuesta tras un fallo parcial. | **Corregido**. |
| SEC-07 | `@ts-nocheck` y varias capas CSS heredadas, sobre todo en Tira Tira | **Baja / deuda técnica** | Menor cobertura estática y mayor coste de mantenimiento. | **Pendiente**: no se eliminó por existir usos y dependencias visuales reales. |
| SEC-08 | Vite de desarrollo enlazado a `0.0.0.0` | **Baja a media según despliegue** | Exposición a la red local si se usa sin cortafuegos. | **Sin cambios** para no romper uso en pizarras/tables; restringir al desarrollar en redes no confiables. |

La clasificación refleja el alcance realmente comprobado y evita afirmar una explotación no demostrada.

## 3. Correcciones aplicadas y código eliminado

- `apps/web/src/pages/HomePage.tsx`: eliminado el **punto de inyección HTML** `dangerouslySetInnerHTML`, sustituido por `<img>` con fuente de un catálogo de recursos estáticos; React sigue mostrando títulos y descripciones como texto seguro.
- `apps/web/src/assets/illustrations.ts` y `apps/web/src/assets/catalog-illustrations/*.svg`: **no se han eliminado dibujos**. Se han trasladado intactas las diez ilustraciones a SVG independientes (se añadió solo `xmlns`), manteniendo los iconos, el fallback `art` y su uso desde el home.
- `apps/web/src/api/games.ts`: validador de respuesta y de cada `Game`, comprobación de ruta interna `/juegos/slug`, ID, icono, categoría, estado, título, descripción y orden. Rechaza duplicados. `getGameById` valida su ID.
- `apps/api/src/infrastructure/repositories/JsonGameRepository.ts`: el adaptador JSON conserva lectura actualizable, pero rechaza campos fuera de rango, rutas inseguras y catálogos con IDs duplicados. No se ha introducido caché ni cambiado el filtrado.
- `apps/api/src/presentation/controllers/GamesController.ts`: validación del parámetro `:id` con respuesta `400` para formato inválido.
- `apps/api/src/app.ts`: CSP de producción en Express, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, `Cache-Control: no-store` para la API. Conserva el error genérico `500` y maneja respuestas parcialmente emitidas.
- `apps/web/tests/security-boundaries.test.mjs` y `apps/api/tests/security.test.ts`: pruebas de regresión y seguridad nuevas.

**No se eliminó ningún componente de juego, archivo de estilo, asset antiguo ni dependencia** cuyo uso fuera incierto. `hero-mentes.svg` y estilos heredados son posibles candidatos a limpieza futura, pero se conservaron para evitar romper integraciones dinámicas o visuales no validadas. Se mantuvieron los mismos endpoints, títulos de juegos, rutas y reglas.

## 4. OWASP Top 10:2025 — revisión por categoría

| Categoría | Evaluación / medidas |
|---|---|
| **A01 — Broken Access Control** | Catálogo y juegos públicos de solo lectura. No hay roles ni endpoints privados; no hay autorización por implementar actualmente. Si se añaden cuentas o edición, exigirá control de acceso en el servidor. |
| **A02 — Security Misconfiguration** | Se añadieron cabeceras HTTP y CSP a Express. La CSP bloquea scripts inline y objetos, pero **permite estilos inline** requeridos por animaciones React; debe probarse con el frontend compilado. |
| **A03 — Software Supply Chain Failures** | Dependencias con rangos amplios y sin lockfile. No se pudo determinar CVE instaladas ni ejecutar una auditoría válida. **Pendiente prioritario**. |
| **A04 — Cryptographic Failures** | No se encontraron secretos, contraseñas ni datos personales persistentes que requieran cifrado por la aplicación. TLS/HTTPS depende del hosting; pendiente para publicación. |
| **A05 — Injection** | Se eliminó la inserción directa de SVG como HTML y se validan rutas del catálogo. No hay consultas SQL/NoSQL, shell ni comandos basados en peticiones. Los títulos se representan como texto React. |
| **A06 — Insecure Design** | Validaciones tanto en el cliente como en el repositorio, y fallos explícitos ante catálogos corruptos. Las puntuaciones siguen siendo solo locales, por diseño, y no deben tratarse como datos antifraude. |
| **A07 — Authentication Failures** | No hay login ni sesiones. Cookies `HttpOnly/Secure/SameSite` y tokens no aplican al estado actual; deberán implementarse si aparecen usuarios. |
| **A08 — Software or Data Integrity Failures** | Lectura y validación de la integridad estructural del JSON; la integridad del código/dependencias queda pendiente de lockfile, CI y proceso de publicación. |
| **A09 — Security Logging & Alerting Failures** | Respuesta HTTP genérica 500; los fallos se registran en el servidor, no en el cliente. No hay monitorización, alertas ni correlación de peticiones: riesgo operativo pendiente para producción. |
| **A10 — Mishandling of Exceptional Conditions** | API devuelve errores controlados; se mejora el manejo de `headersSent`. El home muestra un error manejado cuando la API no está disponible. |

**CSRF:** sin cambios porque la API actual solo expone lecturas GET y no maneja cookies/sesiones. **SSRF:** no se han encontrado llamadas HTTP desde el backend controladas por parámetros de usuario. **SQLi/NoSQLi:** no existe base de datos. **XSS reflejado/almacenado:** no se hallaron puntos de reflexión HTML o almacenamiento de contenido proporcionado por usuarios; se redujo preventivamente el riesgo DOM.

## 5. Comprobaciones y evidencia

| Verificación | Resultado |
|---|---|
| Baseline frontend **antes de cambios** | **47/47** pruebas correctas (`node --experimental-strip-types --test apps/web/tests/*.test.mjs`). |
| Frontend **después** + pruebas de rutas inválidas, JSON inválido y no inserción HTML | **51/51** pruebas correctas con Node 22.16. |
| Runtime aislado del repositorio JSON, compilando módulos TypeScript puros | **Correcto**: 9 juegos, recuperación por ID, rechazo de rutas externas y duplicados. |
| Análisis sintáctico con parser TypeScript 5.8.3 | **38 archivos TS/TSX**, 0 errores de sintaxis. **No equivale a `tsc --noEmit`.** |
| Validación XML de los diez SVG generados | **10/10 válidos**. |
| Pruebas HTTP nuevas del servidor (CSP, 400/404, cabeceras) | **Añadidas pero NO ejecutadas**: Express/tsx no pudieron instalarse en este entorno. |
| `npm install` / build Vite / `npm run typecheck` / `npm test` completos | **No verificados**: instalación de npm agotó el tiempo, faltan dependencias en `node_modules`. |
| `npm audit --offline` | **No ejecutable**: `ENOLOCK` por ausencia de `package-lock.json`. No se puede afirmar que las dependencias estén libres de vulnerabilidades. |
| Prueba visual y de CSP sobre el build en un navegador real | **Pendiente**. |

### Cómo repetir las verificaciones con las dependencias disponibles

```bash
npm install
npm run typecheck
npm test
npm run build
npm audit --audit-level=moderate
```

Si se genera `package-lock.json`, consérvalo en el repositorio y usa `npm ci` en CI/producción. Verifica con un navegador las rutas `/`, `/juegos/tira-tira`, `/juegos/serpientes-y-escaleras` y `/juegos/come-tartas`, en desarrollo y sobre el `dist` servido por Express. Comprueba específicamente la consola CSP y las cabeceras de respuesta.

## 6. Riesgos pendientes y límites

1. **Prioridad alta operativa:** instalar paquetes y realizar `npm audit` con lockfile; revisar las versiones fijadas y vulnerabilidades transitorias antes de publicar. No se inventaron resultados de CVE.
2. **Prioridad media:** desplegar tras HTTPS, cabeceras del proveedor CDN/proxy coherentes, controles de peticiones y métricas/alertas. La CSP de Express no gobierna por sí sola el HTML servido por Vite en desarrollo.
3. **Prioridad media:** revisar, en un navegador real, si el CSP `style-src 'unsafe-inline'` puede restringirse después de migrar las animaciones a clases/variables adecuadas. No se forzó una CSP más estricta porque rompería el juego.
4. **Prioridad baja:** migración tipada gradual de componentes `@ts-nocheck`; consolidación de capas CSS solo después de pruebas de regresión visual. No se eliminaron por intuición.
5. **Si crece el alcance:** implementar autenticación, autorización, cookies seguras, protección CSRF para mutaciones y política de protección de datos. No se justifican mientras no existan cuentas ni operaciones de escritura.
6. **Protección del JSON:** mantener los permisos de escritura sobre `games.json` limitados a quienes despliegan; la validación evita esquemas inválidos, pero no sustituye el control de acceso al sistema de archivos.

## 7. Conclusión

Se ha reducido la superficie de ataque comprobable **sin modificar las reglas ni los contenidos jugables** de Tira Tira, Serpientes y Escaleras y Come Tartas. La revisión **no constituye una certificación de ausencia de vulnerabilidades**: los tests HTTP, las dependencias instaladas, la compilación Vite y el comportamiento de CSP en producción requieren comprobación en un entorno con npm y navegador.
