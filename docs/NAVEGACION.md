# Navegación pública administrable

## Aplicar la migración

1. Abrir la base de datos del sitio en phpMyAdmin.
2. Ir a la pestaña **SQL**.
3. Ejecutar el contenido de:

```text
../iasdsni-api/database/migrations/2026_05_17_create_navigation_items_table.sql
```

La migración es manual; la aplicación no la ejecuta automáticamente.

## Carga inicial sugerida

```sql
INSERT INTO navigation_items (label, url, sort_order, is_active) VALUES
('Inicio', '/', 1, 1),
('Historia', '/pagina/historia', 2, 1),
('Noticias', '/noticias', 3, 1),
('Contacto', '/pagina/contacto', 4, 1);
```

## Crear enlaces desde el admin

Desde **Sitio Web → Menú** se pueden crear enlaces simples escribiendo la URL manualmente. Ejemplos válidos:

```text
/
/pagina/historia
/pagina/quienes-somos
/noticias
/pagina/contacto
```

Las rutas que comienzan con `/` se tratan como internas en React; las URLs externas usan un enlace normal. `target` puede ser `_self` o `_blank`.

## Probar

Backend público:

```text
/public/navigation/list.php
```

Frontend:

1. Crear o activar al menos un ítem desde el admin o con SQL.
2. Abrir el Home.
3. Verificar que el menú aparece entre el header y el hero.
4. Desactivar todos los ítems y confirmar que el Home sigue funcionando sin barra visible.
