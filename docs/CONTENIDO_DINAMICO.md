# Contenido dinámico público

## Crear la tabla `pages` en phpMyAdmin

1. Abrir la base de datos del sitio en phpMyAdmin.
2. Ir a la pestaña **SQL**.
3. Copiar y ejecutar el contenido de:

```text
../iasdsni-api/database/migrations/2026_05_17_create_pages_table.sql
```

La migración es manual a propósito; no se ejecuta automáticamente desde la aplicación.

## Insertar una página de ejemplo

```sql
INSERT INTO pages (slug, title, meta_description, content, is_active)
VALUES (
  'historia',
  'Historia',
  'Breve historia de la iglesia IASDSNI.',
  'Aquí puede comenzar el contenido institucional de la página Historia.',
  1
);
```

## Probar

Backend:

```text
/public/pages/get.php?slug=historia
```

Frontend:

```text
/pagina/historia
```

## Nota sobre HTML

En esta fase, `content` se renderiza como texto simple para evitar inyectar HTML sin una política de sanitización clara. Si más adelante se habilita contenido HTML administrable desde dashboard, debe quedar restringido a usuarios autorizados y sanitizado antes de renderizarse.

## Compatibilidad de endpoints públicos existentes

- `maintenance/get.php` ya usa el formato uniforme con `success`.
- `public/hero/slides.php` conserva por ahora su respuesta exitosa como array plano.
- `public/verses/random.php` conserva por ahora su respuesta exitosa como objeto plano.

Los dos últimos ya usan helpers para método HTTP y errores sanitizados, pero no se envolvieron en `json_success()` para no romper a los componentes públicos que hoy consumen esos contratos directamente.

## Administrar páginas desde el dashboard

1. Ingresar como administrador.
2. Abrir **Sitio Web → Páginas**.
3. Crear una página completando `slug`, `título`, `meta descripción`, `contenido` y estado.
4. Usar el enlace de vista pública para abrir `/pagina/{slug}`.
5. La acción de desactivar conserva el registro y oculta la página pública; no hace borrado físico.

Por ahora `content` sigue mostrándose como texto simple. Un pendiente futuro razonable es incorporar un editor enriquecido seguro, acompañado de sanitización explícita antes de permitir HTML renderizado.

## Tipos de contenido

La tabla `pages` ahora puede clasificar registros con `page_type`:

- `page`: página institucional común.
- `news`: noticia.
- `announcement`: anuncio.
- `event`: evento.

La migración manual que agrega estos campos es:

```text
../iasdsni-api/database/migrations/2026_05_17_extend_pages_for_content_types.sql
```

## Ejemplo de noticia

```sql
INSERT INTO pages (
  slug, title, page_type, meta_description, excerpt, content,
  featured_image, is_active, published_at
)
VALUES (
  'semana-de-oracion-2026',
  'Semana de oración 2026',
  'news',
  'Comienza una nueva semana de oración.',
  'La iglesia inicia una semana especial de encuentros y reflexión.',
  'Contenido completo de la noticia.',
  NULL,
  1,
  '2026-05-17 10:00:00'
);
```

## Administrar noticias

Desde **Sitio Web → Páginas**, elegir el tipo **Noticia**, completar resumen, imagen destacada opcional y fecha de publicación. Las noticias activas y ya publicadas aparecen en:

```text
/noticias
```

Cada noticia enlaza al detalle reutilizando:

```text
/pagina/{slug}
```

`content` sigue mostrándose como texto simple; el editor enriquecido seguro continúa como pendiente futuro.

## Orden recomendado de despliegue

Aplicar primero la migración de extensión de `pages` y luego publicar el backend/admin nuevo. El endpoint `/pagina/:slug` se mantiene compatible con la estructura anterior para no interrumpir páginas públicas durante esa transición; `/noticias` y los nuevos campos del admin requieren que la migración extendida ya exista.
