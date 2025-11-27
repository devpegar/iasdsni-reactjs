# Guía de Contribución

Este proyecto utiliza un flujo de trabajo simple basado en Git Flow adaptado, ideal para mantener un desarrollo ordenado y seguro.

## 🌿 Ramas Principales

### **main**

- Contiene el código estable y listo para producción.
- Solo recibe cambios desde la rama `dev`.

### **dev**

- Rama donde se integran todas las mejoras y desarrollos.
- Todo el trabajo nuevo pasa primero por esta rama.

---

## 🟢 Ramas Secundarias (Features)

Las nuevas funcionalidades o cambios grandes deben desarrollarse en ramas **feature** creadas desde `dev`.

### Crear una rama de feature

```bash
git checkout dev
git pull
git checkout -b feature/nombre-de-la-feature
```

### Finalizar una feature

```bash
git checkout dev
git pull
git merge feature/nombre-de-la-feature
git branch -d feature/nombre-de-la-feature
```

---

## 🟣 Flujo para Publicar Cambios en Producción (dev → main)

Cuando los cambios estén probados:

```bash
git checkout main
git pull
git merge dev
git push
git checkout dev
git pull origin main
```

---

## 📝 Reglas Generales

- Hacer commits claros y descriptivos.
- Mantener `dev` siempre actualizado antes de comenzar nuevas features.
- No trabajar directamente en `main`.

---

## 📦 Commits Recomendados

Usa prefijos para claridad:

- `feat:` nueva funcionalidad
- `fix:` corrección de errores
- `style:` cambios visuales
- `refactor:` mejora interna sin cambiar comportamiento
- `docs:` documentación
- `chore:` tareas menores no relacionadas al código de producción

---

## ✔️ Ejemplos

### Crear nueva sección

```bash
git checkout -b feature/nueva-galeria dev
```

### Fusionar una feature

```bash
git checkout dev
git merge feature/nueva-galeria
```

### Publicar en producción

```bash
git checkout main
git merge dev
git push
```

---

Para dudas o mejoras del flujo de trabajo, comunicarlo antes de realizar cambios significativos en la estructura del repositorio.
