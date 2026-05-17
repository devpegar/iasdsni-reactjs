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
