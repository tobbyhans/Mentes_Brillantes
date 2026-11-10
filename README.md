# Mentes Brillantes — Full Stack (React + Node.js + TypeScript)

Monorepo con **npm workspaces**. Conserva el home, Tira Tira y Serpientes y Escaleras y añade Come Tartas, con rutas navegables sin iframes.


## Come Tartas (v3.2.0)

**Ruta React:** `http://localhost:5173/juegos/come-tartas` · **Categoría del home:** Ciencia.

- **Tres edades propuestas:** 4–6, 7–9 y 10–12 años (adaptables en `questions.ts`).
- **45 preguntas** (15 por grupo) de animales, naturaleza, colores, formas y objetos, cada una con **tres opciones** e ilustración SVG propia. Las explicaciones permanecen en el banco de preguntas, pero no se muestran durante el juego.
- **Sin límite de tiempo:** el jugador avanza a su ritmo. Cada acierto suma 100 puntos y retira una de las 6 porciones de la tarta; una tarta completada da 200 puntos extra, aumenta el nivel y puede desbloquear una recompensa. Al fallar no se pierden puntos.
- **Juego continuo:** tras recorrer las 15 preguntas del grupo de edad, vuelve a empezar el banco para poder seguir consiguiendo tartas.
- **Audio opcional:** campanillas originales generadas con Web Audio, sin archivos externos.
- **Progreso en React:** actualmente no hay cuentas de usuario ni guardado permanente; cambiar de edad o recargar reinicia la partida.

Archivos:

- `apps/web/src/games/cake/App.tsx`: pantalla de edades, preguntas, respuestas, progreso y audio.
- `apps/web/src/games/cake/questions.ts`: banco de preguntas editable.
- `apps/web/src/games/cake/game.ts`: reglas puras y tipadas (puntos, porciones, niveles, recompensas).
- `apps/web/src/games/cake/Picture.tsx`: ilustraciones SVG originales.
- `apps/web/src/games/cake/CakeVisual.tsx`: tarta vectorial interactiva de seis porciones.
- `apps/web/src/games/cake/CakeMascot.tsx`: personaje pastelero SVG animado con los aciertos.
- `apps/web/src/games/cake/Cake.css`: tema visual Mentes Brillantes aislado del resto de juegos.
- `apps/web/tests/cake-game.test.mjs`: pruebas de motor y conexión del catálogo.

## Serpientes y Escaleras en React + TypeScript (v3.1.3)

El juego se ejecuta **exclusivamente como componente React**, desde la ruta `/juegos/serpientes-y-escaleras` del frontend Vite. **No utiliza iframe ni una página HTML jugable externa**. Se ha eliminado la antigua copia `JUGAR_SERPIENTES_Y_ESCALERAS.html` y la versión de respaldo en `apps/web/public/juegos/`.

Archivos principales:

- `apps/web/src/games/snakes/App.tsx`: interfaz React, configuración, dado, preguntas, controles y audio.
- `apps/web/src/games/snakes/components/Board.tsx`: tablero SVG/CSS y fichas animadas.
- `apps/web/src/games/snakes/lib/game.ts`: reglas de serpientes, escaleras y operaciones matemáticas.
- `apps/web/src/games/snakes/lib/flow.ts`: estado y transiciones de turnos, preguntas, avance, retroceso y victoria.
- `apps/web/src/games/snakes/lib/audio.ts`: música y campanillas Web Audio API.

**Para abrirlo:** inicia ambos procesos con `npm install && npm run dev`, abre `http://localhost:5173`, selecciona Matemáticas y pulsa Serpientes y Escaleras. No abras `apps/web/index.html` directamente: es el punto de entrada de Vite, no una versión autónoma.

**Reglas:** cada equipo lanza un dado y responde una operación; acierto = avanza, error = retrocede sin bajar de la casilla 1. Las serpientes y escaleras se aplican cuando se acierta y la casilla de llegada tiene una de ellas. Gana el primero en llegar a la casilla 100.

## Requisitos

- Node.js 20.19+ (recomendado Node 22) y npm.

## Desarrollo

```bash
npm install
npm run dev
```

- Frontend: **http://localhost:5173/** (Vite + React Router)
- Backend: **http://localhost:3001/** (Node + Express)
- El frontend usa el proxy de Vite para `/api`. Ambos procesos deben estar iniciados.

## Producción

```bash
npm run build
npm start
```

El backend sirve la aplicación ya compilada y la API desde **http://localhost:3001**. Para cambiar el puerto: `PORT=8080 npm start` (Linux/macOS) o variable `PORT` equivalente en Windows.

## Arquitectura

```text
Mentes_Brillantes_Fullstack_TS/
├── apps/
│   ├── web/                           React + TypeScript + Vite
│   │   ├── src/
│   │   │   ├── api/games.ts            Cliente de API tipado
│   │   │   ├── pages/HomePage.tsx      Catálogo y filtros
│   │   │   ├── games/tug/              Tira Tira
│   │   │   ├── games/snakes/           Serpientes y Escaleras
│   │   │   ├── games/cake/             Come Tartas (React + TypeScript)
│   │   │   └── App.tsx                 React Router
│   │   └── vite.config.ts              Proxy /api
│   └── api/                           Node.js + TypeScript + Express
│       ├── src/
│       │   ├── presentation/           HTTP: rutas y controladores
│       │   ├── application/use-cases/  GetGames, GetGameById
│       │   ├── domain/                 Entidad Game e interfaz GameRepository
│       │   └── infrastructure/         JsonGameRepository
│       ├── data/games.json             Catálogo editable
│       └── tests/
├── package.json                        Workspaces
└── README.md
```

### API

- `GET /api/health` → `{ "status": "ok" }`
- `GET /api/games` → `{ "data": Game[], "count": number }`
- `GET /api/games?category=Matem%C3%A1ticas` → filtra por categoría
- `GET /api/games/:id` → `{ "data": Game }` o `404`

### Añadir un juego

1. Crea la página/componentes del juego en `apps/web/src/games`.
2. Añade la ruta a `apps/web/src/App.tsx`.
3. Añade una entrada en `apps/api/data/games.json` con `status: "available"` y `route` igual a la ruta del frontend.
4. Asigna un icono de `apps/web/src/assets/illustrations.ts` (o crea uno).

### JSON o PostgreSQL

**JSON es la opción inicial** porque el catálogo contiene nueve juegos, no hay autenticación ni edición concurrente y los resultados de las partidas se mantienen localmente en React. No se guardan datos del alumnado en el servidor.

Para utilizar PostgreSQL, implementa `GameRepository` en `apps/api/src/infrastructure/repositories/PostgresGameRepository.ts`, configura la conexión y sustituye la dependencia del repositorio en `createApp()`. Los casos de uso, controladores y rutas no tienen que cambiar. **PostgreSQL no está implementado ni es necesario para esta versión.**

### Tests y revisión

```bash
npm run typecheck
npm test
```

Los motores matemáticos están en archivos `.ts` con tipos explícitos. La pantalla y el tablero de Serpientes y Escaleras están tipados en `.tsx`; su lógica y transiciones están en `.ts`. El motor Web Audio y algunos componentes heredados de Tira y Afloja siguen pendientes de una migración completa de tipos. El catálogo, cliente HTTP y backend sí utilizan tipos TypeScript estrictos.

Los SVG originales del home se conservan y los dibujos específicos de los juegos están incluidos localmente. Los archivos no dependen de servicios de terceros para funcionar.


## Ajuste visual de Tira y Afloja (v3.1.2)

- Eliminada la cabecera decorativa superior y la introducción ilustrada de preparación.
- Conservados los controles de sonido, volver al inicio, configuración y pausa en una barra compacta.
- Los cuatro pasos (Tiempo, Operaciones, Números, Equipos) aparecen inmediatamente.
- Se mantiene la estética Mentes Brillantes, el escenario de los seis niños, las preguntas y los efectos.
- El ajuste visual está aislado en `apps/web/src/games/tug/compact-layout.css`.

Para ejecutar: `npm install`, `npm run dev`. La página abre en http://localhost:5173 y Tira y Afloja en `/juegos/tira-y-afloja`.

### v3.1.4 · Controles de audio homogéneos

Tira y Afloja usa ahora los mismos dos controles directos que Serpientes y Escaleras: **Música** y **Sonidos**, independientes y con estado pulsado accesible. Se ha eliminado el menú antiguo de sonido, sin cambiar el audio barroco ni las campanillas de acierto. Se ha reforzado la liberación de Web Audio en React StrictMode.

## Tira Tira: diseño unificado (v3.1.5)

El juego conserva sus reglas matemáticas y ambos equipos simultáneos, pero comparte la cabecera, la paleta, las tarjetas de papel y los controles con **Serpientes y Escaleras**. La preparación muestra una ilustración de la cuerda a la izquierda y los cuatro pasos de configuración a la derecha. El tema de paridad se encuentra en `apps/web/src/games/tug/snakes-parity.css` y se carga al final de la cascada.

Acceso: `/juegos/tira-tira`. La antigua ruta `/juegos/tira-y-afloja` redirige a la nueva; el ID del catálogo `tira-y-afloja` se mantiene estable para compatibilidad con la API.


### Diseño Come Tartas (v3.2.2)

- **Escritorio:** panel de tarta, pastelero, puntos y recompensas a la izquierda; preguntas ilustradas y tres respuestas a la derecha.
- **Móvil:** preguntas primero, seguimiento de tarta y premios debajo.
- Interfaz visual consistente con Tira Tira y el home de Mentes Brillantes.
- Reglas, banco de preguntas, edades y ausencia de cronómetro sin cambios.

### Come Tartas — panel compacto (v3.2.5)

- El panel de preguntas se ha compactado para encajar mejor en la ventana de juego, con ilustración más pequeña y botones de respuesta uniformes.
- Al responder solo se marca la opción escogida con un símbolo de acierto o error. No se muestran explicaciones, consejos ni respuestas correctas no elegidas.
- El botón **Siguiente pregunta** aparece tras responder. La tarta, los puntos y las recompensas siguen funcionando como antes.


## Auditoría y seguridad (v3.2.6)

Consulta [`AUDITORIA_SEGURIDAD.md`](AUDITORIA_SEGURIDAD.md) para el inventario, la matriz OWASP Top 10:2025, las correcciones y los riesgos abiertos.

Las imágenes del catálogo son recursos SVG estáticos en `apps/web/src/assets/catalog-illustrations/`. Las rutas y los campos de juego recibidos desde la API se validan antes de mostrarse. Express publica cabeceras de seguridad en las respuestas que sirve: **en desarrollo Vite sirve el HTML**, así que las cabeceras del documento deben configurarse también en el servidor de despliegue final.

**Antes de publicar:** instala las dependencias en un entorno con acceso a npm, conserva y versiona el `package-lock.json` generado, ejecuta `npm ci`, `npm audit`, `npm run typecheck`, `npm test` y `npm run build`. Configura HTTPS y los límites de peticiones en el proxy/hosting de producción. No hay autenticación, cookies, sesiones ni datos persistentes del alumnado en esta versión.

Pruebas de lógica del frontend sin instalar npm (requiere Node.js 22 con soporte de borrado de tipos):

```bash
node --experimental-strip-types --test apps/web/tests/*.test.mjs
```

**Nota:** la CSP del proyecto permite estilos inline porque las posiciones y animaciones actuales de React los usan; el JavaScript inline, en cambio, queda bloqueado. Es una medida pragmática, no una CSP de máxima restricción.
