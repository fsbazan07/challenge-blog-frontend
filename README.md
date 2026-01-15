# Challenge Blog – Frontend

Frontend de una aplicación de blog desarrollada como challenge técnico. El proyecto incluye autenticación, gestión de posts, perfil de usuario, tests unitarios y configuración productiva con Docker.

---

## 🚀 Stack tecnológico

- React + TypeScript
- Vite
- Tailwind CSS
- Vitest (tests unitarios)
- Docker + Docker Compose
- Nginx (servir build de producción)

---

## 📁 Estructura del proyecto

```
src/
 ├─ services/        # Servicios de API (posts, auth, users)
 ├─ features/        # Features por dominio
 ├─ pages/           # Páginas principales
 ├─ components/      # Componentes reutilizables
 ├─ hooks/           # Custom hooks
 └─ test/            # Setup de testing
```

---

## ⚙️ Requisitos

- Node.js 18+
- pnpm
- Docker + Docker Compose (opcional, para producción)

---

## 🛠️ Setup local (desarrollo)

1. Clonar el repositorio

```bash
git clone <repo-url>
cd challenge-blog-frontend
```

2. Instalar dependencias

```bash
pnpm install
```

3. Variables de entorno

Crear un archivo `.env` basado en `.env.example`:


4. Levantar el proyecto

```bash
pnpm dev
```

La aplicación quedará disponible en:

👉 [http://localhost:5173](http://localhost:5173)

---

## 🧪 Testing

El proyecto cuenta con una suite de tests unitarios enfocada en la lógica crítica.

### Tests incluidos

- PostsService (CRUD completo)
- AuthService (login, register, refresh, logout, sesión)
- UsersService / Profile
- Mapper de posts (normalización de fechas)
- Smoke test de la aplicación

### Ejecutar tests

```bash
pnpm test:run
```

---

## 🐳 Docker (producción)

El proyecto incluye configuración para build y ejecución productiva usando Docker y Nginx.

### Build y run con Docker Compose

```bash
docker compose up --build
```

La aplicación quedará disponible en:

👉 [http://localhost:5173](http://localhost:5173)

### Qué hace Docker

- Construye el frontend con `pnpm build`
- Sirve los archivos estáticos con Nginx
- Incluye fallback SPA (`try_files /index.html`)

---

## 🔐 Autenticación y sesión

- Manejo de sesión con `localStorage`
- Tokens de acceso y refresh
- Servicios desacoplados y completamente testeados

---

## 🧠 Decisiones técnicas

- Separación clara entre modelos de API (`PostApi`) y modelos de frontend (`Post`)
- Normalización de fechas en la capa de servicios
- Tests enfocados en servicios y lógica pura, evitando tests frágiles de UI
- Docker configurado para un entorno productivo real

---

## ☁️ Deploy (AWS)

El frontend está preparado para deploy en AWS usando cualquiera de las siguientes opciones:

### Opción recomendada

- S3 + CloudFront

  - Build estático
  - CDN + HTTPS
  - Bajo costo y alta performance

### Alternativa

- AWS Amplify

  - Deploy automático desde Git
  - Ideal para demos rápidas

---

## 📌 Scripts útiles

```bash
pnpm dev        # desarrollo
pnpm build      # build productivo
pnpm preview    # preview del build
pnpm test:run   # tests
```

---

## ✨ Estado del proyecto

- Tests pasando
- Build productivo funcionando
- Docker operativo
- Listo para deploy

---

## 👩‍💻 Autora

Florencia Samanta Bazan
Frontend / Fullstack Developer
