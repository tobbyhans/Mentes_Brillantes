## 3.2.6 — Auditoría y refuerzo de seguridad (29/10/2026)

- Ilustraciones SVG del home movidas a archivos estáticos; eliminado el renderizado mediante `dangerouslySetInnerHTML`.
- Catálogo validado en frontend y backend: campos tipados en tiempo de ejecución, límites, rutas locales seguras e IDs únicos.
- Protección HTTP en Express: CSP, `nosniff`, antiframe, política de referencias, permisos y respuesta API sin caché.
- Se mejora el manejo de errores si los encabezados de respuesta ya se han enviado.
- Cuatro nuevas pruebas de seguridad de frontend y tres pruebas API integradas pendientes de ejecutar con dependencias.
- Sin cambios en puntos, turnos, preguntas, animaciones, sonido ni rutas de los juegos.
- Informe completo en `AUDITORIA_SEGURIDAD.md`.

## 3.2.5 — Come Tartas, panel compacto

- Reducido el tamaño vertical del panel de preguntas y sus ilustraciones.
- Unificados los botones de respuesta y ajustado el botón «Siguiente pregunta».
- Eliminados los mensajes de acierto/error y las explicaciones después de responder.
- Una respuesta incorrecta ya no revela cuál era la opción correcta.
- Conservadas las puntuaciones, las tartas y las recompensas.
- Ajustes responsive para ordenador, tableta y móvil.

## 3.2.4

- Home: integrada sin modificaciones la imagen de las dos mascotas proporcionada por el usuario.
- Ajustado su tamaño y comportamiento responsive en la sección «Elige tu aventura».
- Eliminado el recurso de cabecera anterior, ya sin uso.

## 3.2.2 — Come Tartas con preguntas a la derecha

- Reorganizada la pantalla de juego para mostrar la tarta, el pastelero, el marcador y las recompensas a la izquierda.
- Colocadas las preguntas ilustradas y sus tres opciones a la derecha, con el estilo de tarjetas de Tira Tira.
- En móvil las preguntas aparecen primero para conservar la accesibilidad.
- Sin cambios en edad, puntuación, premios ni reglas.

## 3.2.1 — Home sin espacios vacíos

- Eliminado el margen superior del home sobre la cabecera de Mentes Brillantes.
- Reducida la separación entre la bienvenida y los filtros de categoría, sin quitar contenido.
- Ajustes equivalentes en tablet y móvil.
- Añadidas pruebas de regresión para la maquetación del home.
- Se conservan Come Tartas, Tira Tira, Serpientes y Escaleras y el backend.

## 3.2.0 — Come Tartas

- Nuevo juego de preguntas visuales en React + TypeScript, integrado con la ruta `/juegos/come-tartas`.
- Tres grupos de edad (4–6, 7–9 y 10–12), cada uno con 15 preguntas originales de tres opciones.
- Progreso sin límite de tiempo, seis porciones por tarta, puntos y recompensas desbloqueables.
- Disponible desde el catálogo de la API y el home, conservando los otros juegos.

## 3.1.5 — Tira Tira

- Cambio de nombre a **Tira Tira** en el juego y el catálogo.
- Cabecera, tarjetas y configuración rediseñadas con la estética de Serpientes y Escaleras.
- Pantalla de preparación de dos columnas: escena ilustrada y 4 pasos.
- Nueva ruta `/juegos/tira-tira`; la URL anterior redirige automáticamente.
- Conservadas las reglas, los controles de audio y los teclados de los equipos.

# Historial de cambios

## 3.1.3 — Serpientes y Escaleras nativo en React + TypeScript

- Retiradas las dos copias del juego en HTML autónomo y el enlace de respaldo.
- La ruta `/juegos/serpientes-y-escaleras` renderiza únicamente el componente React.
- `App.tsx` y `Board.tsx` tienen interfaces y propiedades TypeScript explícitas, sin `@ts-nocheck`.
- Separado el flujo puro de la partida en `lib/flow.ts`.
- Protegidas las respuestas dobles y animaciones interrumpidas al salir de la partida.
- Añadidas pruebas de flujo de turnos, dado, aciertos, errores, escaleras y victoria.
- No se cambian el backend, el home, el juego Tira y Afloja ni sus rutas.

## 3.1.6
- Tira Tira: el equipo rosa adopta una paleta rosa consistente en cabecera, panel lateral, marcador, teclado, barra de progreso y elementos de configuración.
- Unificación visual de los dos equipos en azul y rosa, alineada con Serpientes y Escaleras.

## 3.1.7
- Serpientes y Escaleras: el equipo 2 / equipo rosa ahora usa color rosa en ficha del tablero, marcador lateral, turno activo, dado y leyenda inferior.
- Se corrige la inconsistencia visual donde algunos elementos del equipo rosa seguían viéndose en naranja.

## 3.2.3
- Home: sustituida la ilustración principal por una nueva imagen inspirada en el ejemplo aportado, integrada en el mismo diseño visual de Mentes Brillantes.
- Ajustado el tamaño de la imagen del hero para mantener la composición del home.
