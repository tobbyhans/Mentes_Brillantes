# Desplegar Mentes Brillantes en Render

Esta configuración publica **el frontend React y la API Express en un solo servicio web**. Render construye ambos paquetes desde la raíz del monorepositorio mediante npm workspaces; Express sirve los archivos compilados de `apps/web/dist` y expone la API en `/api`.

## Despliegue con Blueprint (recomendado)

1. Ve a [Render](https://dashboard.render.com/) e inicia sesión.
2. Pulsa **New > Blueprint** y conecta el repositorio de GitHub `tobbyhans/Mentes_Brillantes`.
3. Selecciona la rama `main` y el archivo `render.yaml` de la raíz.
4. Revisa la configuración del servicio `mentes-brillantes-fullstack` y aprueba el despliegue.

La configuración versionada en `render.yaml` define:

| Ajuste | Valor |
| --- | --- |
| Tipo y entorno | Web Service / Node.js |
| Plan inicial | Free (si tu cuenta permite utilizarlo) |
| Directorio raíz | Raíz del repositorio (no establecer subcarpeta) |
| Comando de compilación | `npm ci --include=dev && npm run build` |
| Comando de inicio | `npm start` |
| Comprobación de salud | `/api/health` |
| Rama | `main` |
| Node.js | Versión fijada en `.node-version` |

`--include=dev` es importante porque TypeScript y Vite se necesitan durante la compilación. Render configura `NODE_ENV=production` automáticamente **en tiempo de ejecución**. No es necesario establecer `PORT` ni crear un servidor adicional: Express utiliza `process.env.PORT`.

## Comprobación

Cuando Render indique que el despliegue está disponible, abre la URL que te asigne y comprueba:

- `/`: debe mostrar la aplicación React.
- `/api/health`: debe responder `{"status":"ok"}`.
- `/api/games`: debe devolver el catálogo de juegos.
- `/juegos/come-tartas` o cualquier ruta interna: debe abrir directamente, sin error 404.

El proxy `/api` del archivo `apps/web/vite.config.ts` solo se utiliza en desarrollo local; en producción el navegador y la API comparten el mismo dominio gracias a Express.

## Prueba local

Desde la raíz del repositorio:

```sh
npm ci
npm run build
npm start
```

Abre `http://localhost:3001/` y `http://localhost:3001/api/health`.

## Actualizaciones y notas

- Una vez vinculado el Blueprint, los cambios enviados a `main` pueden iniciar despliegues automáticos.
- El plan gratuito puede suspender la aplicación tras un periodo sin actividad; la siguiente solicitud puede tardar en responder.
- Este Blueprint **no crea bases de datos ni servicios externos**; el catálogo actual se lee desde el JSON incluido en `apps/api/data/games.json`.
- No subas claves, contraseñas o archivos `.env` al repositorio. Si el proyecto llega a necesitar secretos, configúralos en Render.
- Si ya tienes un Worker en Cloudflare, es independiente de este servicio. Puedes dejarlo sin usar; no se elimina automáticamente.
- El repositorio contiene archivos `node_modules` previamente versionados. El archivo `.gitignore` impide incorporar otros nuevos, pero no elimina los ya registrados. Conviene limpiarlos en un cambio separado para reducir el peso del repositorio.

Documentación: [Blueprints de Render](https://render.com/docs/infrastructure-as-code) y [Express en Render](https://render.com/docs/deploy-node-express-app).
