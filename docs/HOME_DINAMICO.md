# Home dinámico

## Aplicar la migración

1. Abrir la base de datos en phpMyAdmin.
2. Ejecutar el archivo:

```text
../iasdsni-api/database/migrations/2026_05_17_create_home_sections_table.sql
```

La migración crea la tabla `home_sections` y trae inserts iniciales para reproducir el orden actual del Home.

## Qué es `section_key`

`section_key` no crea componentes React desde la base. Es una clave que apunta a un componente ya soportado por el frontend.

Claves actuales:

```text
hero_carousel
verse_daily
mission_vision_service
adventists_world
gallery
contact_map
latest_news
```

## Administrar el Home

Desde **Sitio Web → Home** se puede:

- activar o desactivar secciones
- cambiar su orden con `sort_order`
- editar título, subtítulo y `config_json`
- agregar una sección disponible desde el selector de `section_key`

No hay drag-and-drop ni editor visual todavía.

## Agregar `latest_news`

Crear una sección con:

```text
section_key = latest_news
```

La sección consulta las últimas 3 noticias publicadas y enlaza a `/pagina/{slug}` y `/noticias`.

## Agregar futuras secciones

Se necesitan dos pasos, siempre:

A) React:
- crear el componente
- registrarlo en `SECTION_COMPONENTS`

B) Backend/admin:
- agregar el `section_key` a la lista permitida
- definir configuración si corresponde

Esto mantiene una frontera sana: el backend administra secciones disponibles, pero no intenta fabricar código React.

## Fallback seguro

Si `home_sections` todavía no existe, si el endpoint falla o si devuelve vacío, el Home usa un fallback local con el orden histórico actual para seguir funcionando.
