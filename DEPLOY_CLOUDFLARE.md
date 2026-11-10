# Desplegar React + Express juntos en Cloudflare Workers

**Arquitectura:** un único Cloudflare Worker llamado `mentes-brillantes` con Express para `/api/*` y los archivos estáticos compilados de React/Vite para el resto de rutas. No es necesario un segundo servicio de alojamiento.

La API se sigue desarrollando en `apps/api/src/app.ts`, al igual que la versión local de Node. El archivo `apps/api/worker.ts` es solo la entrada para el runtime Cloudflare; incorpora el catálogo `apps/api/data/games.json` en el bundle porque el sistema de archivos local no se utiliza igual en Workers.

## Desplegar desde GitHub en Cloudflare

1. Abre Cloudflare > Workers & Pages > `mentes-brillantes` > Settings/Configuración > Builds/Compilaciones.
2. Comprueba que apunta a `tobbyhans/Mentes_Brillantes` y a la rama `main`.
3. Configura los campos:
   - **Directorio raíz:** raíz del repositorio (vacío o `/`; nunca `apps/web`).
   - **Comando de compilación:** `npm ci && npm run build`
   - **Comando de despliegue:** `npx --yes wrangler@latest deploy --config wrangler.jsonc`
4. Guarda y ejecuta **Retry deployment** / volver a desplegar el último commit.

El problema anterior, “application detection logic has been run in the root of a workspace”, se evita seleccionando explícitamente el Worker de `wrangler.jsonc`, que contiene `main` y `assets.directory`. `nodejs_compat` permite utilizar Express y `httpServerHandler` conecta su servidor al runtime Workers.

**Corrección del error 10021 (iconv-lite):** el ciclo `postbuild` del `package.json` ejecuta automáticamente `scripts/fix-iconv-lite-workers.mjs`. El script retira únicamente los mapas de navegador incompatibles con los streams de Node.js en la copia **instalada** de `iconv-lite`, antes de que Wrangler empaquete el Worker. Mantén en Cloudflare los comandos existentes `npm ci && npm run build` y `npx --yes wrangler@latest deploy --config wrangler.jsonc`. No es necesario modificar el código de los juegos. La causa y el workaround están documentados en https://github.com/cloudflare/workers-sdk/issues/9309. Si vuelve a fallar, revisa que los registros incluyan `[Cloudflare] iconv-lite encontrado` y comparte el nuevo error.

Si Cloudflare solicita la versión de Node.js para la compilación, utiliza Node 22 o posterior compatible con las dependencias de Vite. El comando de compilación debe instalar las dependencias de desarrollo de TypeScript y Vite.

## Pruebas

Visita la URL pública asignada por Cloudflare y comprueba:

- `/` para la página React.
- `/juegos/come-tartas` para confirmar que la navegación SPA funciona.
- `/api/health` para obtener `{"status":"ok"}`.
- `/api/games` para comprobar el catálogo.
- Una ruta desconocida en `/api/*` debe devolver un 404 JSON, **no** el HTML de React.

Para probar localmente de forma tradicional: `npm ci && npm run build && npm start` y abre `http://localhost:3001/`. Para probar con el runtime de Cloudflare, una vez compilado, ejecuta `npx --yes wrangler@latest dev --config wrangler.jsonc`.

## Notas

- No utilizar en Cloudflare el comando `npm start`: ese es el servidor Node para entornos tradicionales.
- La configuración `render.yaml` anterior puede seguir en el repositorio, pero no participa en el despliegue de Cloudflare.
- No compartas archivos `.env` ni credenciales en GitHub; utiliza secretos y variables de entorno de Cloudflare cuando los necesites.
- Estos cambios preparan el código. **El primer despliegue debe verificarse en los registros de Cloudflare**; no hay confirmación de un despliegue en producción desde GitHub.
- El archivo `.gitignore` excluye `node_modules`, pero en el repositorio hay dependencias antiguas ya versionadas que convendría limpiar por separado.

Documentación oficial: https://developers.cloudflare.com/workers/tutorials/deploy-an-express-app/ y https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/
