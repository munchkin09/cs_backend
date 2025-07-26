# 🐳 Azure Container Registry Integration

Este documento explica cómo trabajar con las imágenes Docker publicadas en Azure Container Registry.

## 📦 Registry Information

- **Registry URL:** `csanalyzer.azurecr.io`
- **Image Name:** `cs-backend`
- **Resource Group:** `cs_analyzer_dev`

## 🚀 GitHub Actions Workflow

### **Workflow Principal: Build & Push**
El workflow `generation_controller_cs-analyzer-back.yml` ahora:

1. ✅ **Construye** la imagen Docker automáticamente
2. ✅ **Publica** a `csanalyzer.azurecr.io/cs-backend`
3. ✅ **Genera tags** automáticos:
   - `latest` (para branch principal)
   - `Generation_Controller-<sha>` (para commits)
   - `pr-<number>` (para pull requests)

### **Workflow Opcional: Deploy**
El workflow `deploy-from-registry.yml` permite:

- 🎯 **Deploy manual** desde el registry
- 🔧 **Selección de tag** específico
- 🌍 **Deploy a Azure Container Instances**

## 🔧 Uso Local

### **1. Login al Registry**
```bash
# Login a Azure
az login

# Login al Container Registry
az acr login --name csanalyzer
```

### **2. Pull de la Imagen**
```bash
# Imagen más reciente
docker pull csanalyzer.azurecr.io/cs-backend:latest

# Tag específico
docker pull csanalyzer.azurecr.io/cs-backend:Generation_Controller-abc123
```

### **3. Ejecutar Localmente**
```bash
# Con variables de entorno básicas
docker run -d \
  --name cs-backend-local \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e LLM_API_KEY="tu_api_key" \
  -e MONGODB_URI="tu_mongodb_uri" \
  csanalyzer.azurecr.io/cs-backend:latest

# Ver logs
docker logs -f cs-backend-local
```

## ☁️ Deployment a Azure

### **Opción 1: Azure Container Instances (Recomendado)**
```bash
az container create \
  --resource-group cs_analyzer_dev \
  --name cs-backend-prod \
  --image csanalyzer.azurecr.io/cs-backend:latest \
  --registry-login-server csanalyzer.azurecr.io \
  --dns-name-label cs-backend-prod \
  --ports 3000 \
  --cpu 1 --memory 2 \
  --environment-variables NODE_ENV=production \
  --secure-environment-variables LLM_API_KEY="tu_api_key"
```

### **Opción 2: Azure Web App**
```bash
# Configurar Web App para usar contenedor
az webapp config container set \
  --name cs-analyzer-back \
  --resource-group cs_analyzer_dev \
  --docker-custom-image-name csanalyzer.azurecr.io/cs-backend:latest \
  --docker-registry-server-url https://csanalyzer.azurecr.io
```

### **Opción 3: GitHub Actions (Manual)**
1. Ve a **Actions** en GitHub
2. Selecciona **Deploy from Container Registry**
3. Elige el tag a desplegar
4. Ejecuta el workflow

## 🔍 Comandos Útiles

### **Registry Management**
```bash
# Listar todas las imágenes
az acr repository list --name csanalyzer

# Ver tags de cs-backend
az acr repository show-tags --name csanalyzer --repository cs-backend

# Eliminar tag específico
az acr repository delete --name csanalyzer --image cs-backend:tag-viejo
```

### **Monitoring**
```bash
# Estado del Container Instance
az container show \
  --resource-group cs_analyzer_dev \
  --name cs-backend-prod \
  --query "{State:instanceView.state,IP:ipAddress.ip,FQDN:ipAddress.fqdn}"

# Logs del contenedor
az container logs \
  --resource-group cs_analyzer_dev \
  --name cs-backend-prod
```

## 🌍 URLs de Acceso

Después del deployment, tu aplicación estará disponible en:

- **Container Instance:** `http://cs-backend-prod.swedencentral.azurecontainer.io:3000`
- **Web App:** `https://cs-analyzer-back.azurewebsites.net`

### **Endpoints Principales:**
- `GET /` → Página principal
- `POST /api/v1/generation/upload` → Subir video
- `POST /api/v1/generation/` → Generar contenido  
- `GET /docs` → Documentación Swagger

## 🔐 Seguridad

- ✅ **Registry privado** - requiere autenticación
- ✅ **Variables de entorno secretas** en GitHub
- ✅ **Imagen Alpine** - superficie de ataque reducida
- ✅ **Usuario no-root** en el contenedor

## 📊 Tags Automáticos

| Branch/Event | Tag Generado | Ejemplo |
|--------------|--------------|---------|
| main/master | `latest` | `latest` |
| Generation_Controller | `Generation_Controller-<sha>` | `Generation_Controller-a1b2c3d` |
| Pull Request | `pr-<number>` | `pr-123` |
| Manual | `<branch>-<sha>` | `feature-abc123` |

## 🚨 Troubleshooting

### **Error: Login Failed**
```bash
# Verificar permisos
az acr check-health --name csanalyzer

# Re-login
az acr login --name csanalyzer
```

### **Error: Image Not Found**
```bash
# Verificar que existe
az acr repository show-tags --name csanalyzer --repository cs-backend

# Pull específico
docker pull csanalyzer.azurecr.io/cs-backend:latest
```

### **Error: Deployment Failed**
```bash
# Ver logs detallados
az container logs --resource-group cs_analyzer_dev --name cs-backend-prod --follow
```

---

¡Tu aplicación ahora está completamente containerizada y lista para deployment automático! 🎮🚀
