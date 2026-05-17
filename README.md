# IASDSNI local

## Estructura

- `../iasdsni-api`: API PHP compatible con hosting compartido/cPanel.
- `.`: frontend React + Vite.

## Backend PHP local

1. Crear `../iasdsni-api/.env` a partir de `../iasdsni-api/.env.example`.
2. Completar las credenciales de la única base MySQL/MariaDB local.
3. Desde `../iasdsni-api`, iniciar PHP:

```bash
php -S localhost:8000
```

Variables esperadas del backend:

```env
APP_ENV=development
APP_URL=http://localhost:8000
DB_HOST=localhost
DB_NAME=iasdsni
DB_USER=root
DB_PASS=
JWT_SECRET=change-me
```

## Frontend Vite local

1. Usar `.env.development` o crear un `.env.local`.
2. Configurar la API:

```env
VITE_API_URL=http://localhost:8000
VITE_APP_ENV=development
```

3. Instalar dependencias si hace falta y levantar Vite:

```bash
npm install
npm run dev
```

Para validar build de producción:

```bash
npm run build
```

## Compatibilidad con cPanel

La API sigue siendo PHP plano, sin Docker ni dependencias de servidor adicionales. En hosting compartido, mantener las variables reales en `.env`, apuntar `APP_URL` al dominio público y configurar `VITE_API_URL` con la URL pública de la API antes de compilar el frontend.
