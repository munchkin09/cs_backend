# 🐳 Docker Setup - CS Backend

Este documento explica cómo usar Docker para ejecutar el CS Backend con todas sus dependencias.

## 🚀 Inicio Rápido

### 1. **Preparar el entorno**

```bash
# Copiar las variables de entorno
cp docker.env.example .env

# Editar las variables (especialmente LLM_API_KEY)
notepad .env  # Windows
# nano .env   # Linux/Mac
```

### 2. **Ejecutar con Docker Compose (Recomendado)**

```bash
# Desarrollo (con recarga automática)
npm run docker:dev

# Producción (en background)
npm run docker:prod

# Ver logs
npm run docker:logs

# Parar todos los servicios
npm run docker:stop
```

### 3. **Ejecutar solo el backend**

```bash
# Construir la imagen
npm run docker:build

# Ejecutar el contenedor
npm run docker:run
```

## 📦 Servicios Incluidos

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| **cs-backend** | 3000 | API principal |
| **mongodb** | 27017 | Base de datos |
| **mongo-express** | 8081 | UI de MongoDB (solo debug) |

## 🔧 Configuración

### **Variables de Entorno Importantes:**

```env
# Requeridas
LLM_API_KEY=tu_api_key_de_gemini
MONGODB_URI=mongodb://admin:password@mongodb:27017

# Opcionales
NODE_ENV=production
PORT=3000
MONGODB_NAME=csainalyzer
```

### **Activar MongoDB Express (opcional):**

```bash
# Para debugging de la base de datos
docker-compose --profile debug up -d
```

## 🎬 Características Docker

### ✅ **Lo que incluye:**
- **FFmpeg** preinstalado para compresión de video
- **MongoDB** como base de datos
- **Volumes persistentes** para uploads y datos
- **Health checks** automáticos
- **Usuario no-root** para seguridad
- **Imagen optimizada** (Alpine Linux)

### 📁 **Estructura de volúmenes:**

```
./uploads/     → /app/uploads     (Videos subidos)
./logs/        → /app/logs        (Logs de aplicación)
mongodb_data   → /data/db         (Datos de MongoDB)
```

## 🛠️ Comandos de Desarrollo

```bash
# Ver todos los contenedores
docker-compose ps

# Entrar al contenedor del backend
docker-compose exec cs-backend sh

# Ver logs en tiempo real
docker-compose logs -f cs-backend

# Reiniciar solo el backend
docker-compose restart cs-backend

# Limpiar todo (cuidado: borra los datos)
npm run docker:clean
```

## 🔍 Debugging

### **Problemas comunes:**

1. **Puerto ocupado:**
   ```bash
   # Cambiar puerto en docker-compose.yml
   ports:
     - "3001:3000"  # Usar puerto 3001
   ```

2. **FFmpeg no funciona:**
   ```bash
   # Verificar que FFmpeg está instalado
   docker-compose exec cs-backend ffmpeg -version
   ```

3. **MongoDB no conecta:**
   ```bash
   # Verificar que MongoDB está corriendo
   docker-compose ps
   docker-compose logs mongodb
   ```

### **Acceder a los servicios:**

- **API Backend:** http://localhost:3000
- **Swagger Docs:** http://localhost:3000/docs
- **MongoDB Express:** http://localhost:8081 (si está habilitado)

## 🚀 Deployment en Producción

### **Azure Container Instances:**

```bash
# Ejemplo de deployment
az container create \
  --resource-group cs_analyzer_dev \
  --name cs-backend-prod \
  --image your-registry/cs-backend:latest \
  --ports 3000 \
  --environment-variables \
    NODE_ENV=production \
    LLM_API_KEY=tu_api_key \
    MONGODB_URI=tu_mongodb_uri
```

### **Docker Hub:**

```bash
# Tagear y subir imagen
docker tag cs-backend your-username/cs-backend:latest
docker push your-username/cs-backend:latest
```

## 📊 Monitoreo

### **Health Check:**

```bash
# Verificar salud del contenedor
docker-compose exec cs-backend curl -f http://localhost:3000/ || exit 1
```

### **Recursos:**

```bash
# Ver uso de recursos
docker stats cs-backend_cs-backend_1
```

## 🔐 Seguridad

- ✅ Usuario no-root (nextjs:nodejs)
- ✅ Imagen Alpine (superficie de ataque reducida)
- ✅ Variables de entorno para secretos
- ✅ Health checks para disponibilidad
- ✅ .dockerignore para excluir archivos sensibles

---

**¡Tu aplicación de análisis de CS está lista para ejecutarse en cualquier lugar! 🎮**
