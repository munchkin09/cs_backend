# =======================================================
# 🐳 Azure Container Registry - Deployment Scripts
# =======================================================

# Estas son las instrucciones para trabajar con la imagen Docker 
# publicada en Azure Container Registry

# Variables de configuración
$REGISTRY = "csanalyzer.azurecr.io"
$IMAGE_NAME = "cs-backend"
$RESOURCE_GROUP = "cs_analyzer_dev"

# =======================================================
# 1. 🔐 LOGIN AL REGISTRY
# =======================================================

# Login a Azure (requerido)
az login

# Login al Container Registry
az acr login --name csanalyzer

# =======================================================
# 2. 📥 PULL DE LA IMAGEN
# =======================================================

# Descargar la imagen más reciente
docker pull $REGISTRY/$IMAGE_NAME`:latest

# Descargar una versión específica
# docker pull $REGISTRY/$IMAGE_NAME`:Generation_Controller-abc123

# =======================================================
# 3. 🏃‍♂️ EJECUTAR LOCALMENTE
# =======================================================

# Ejecutar la imagen con variables de entorno
docker run -d `
  --name cs-backend-local `
  -p 3000:3000 `
  -e NODE_ENV=production `
  -e LLM_API_KEY="tu_api_key_aqui" `
  -e MONGODB_URI="tu_mongodb_uri" `
  $REGISTRY/$IMAGE_NAME`:latest

# Ver logs
docker logs -f cs-backend-local

# Parar el contenedor
docker stop cs-backend-local
docker rm cs-backend-local

# =======================================================
# 4. ☁️ DEPLOY A AZURE CONTAINER INSTANCES
# =======================================================

# Crear Container Instance
az container create `
  --resource-group $RESOURCE_GROUP `
  --name cs-backend-prod `
  --image $REGISTRY/$IMAGE_NAME`:latest `
  --registry-login-server $REGISTRY `
  --registry-username csanalyzer `
  --registry-password $(az acr credential show --name csanalyzer --query "passwords[0].value" -o tsv) `
  --dns-name-label cs-backend-prod `
  --ports 3000 `
  --cpu 1 `
  --memory 2 `
  --environment-variables NODE_ENV=production PORT=3000 LLM_PROVIDER=gemini `
  --secure-environment-variables LLM_API_KEY="tu_api_key"

# Ver estado del deployment
az container show `
  --resource-group $RESOURCE_GROUP `
  --name cs-backend-prod `
  --query "{State:instanceView.state,IP:ipAddress.ip,FQDN:ipAddress.fqdn}" `
  --output table

# Ver logs del contenedor
az container logs `
  --resource-group $RESOURCE_GROUP `
  --name cs-backend-prod

# =======================================================
# 5. 🔍 COMANDOS ÚTILES
# =======================================================

# Listar todas las imágenes en el registry
az acr repository list --name csanalyzer --output table

# Ver tags de una imagen específica
az acr repository show-tags --name csanalyzer --repository $IMAGE_NAME --output table

# Eliminar una imagen específica
# az acr repository delete --name csanalyzer --image $IMAGE_NAME`:tag_a_eliminar

# =======================================================
# 6. 📊 MONITOREO
# =======================================================

# Ver métricas del Container Instance
az monitor metrics list `
  --resource "/subscriptions/tu-subscription-id/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.ContainerInstance/containerGroups/cs-backend-prod" `
  --metric "CpuUsage,MemoryUsage" `
  --interval PT1M

# =======================================================
# 💡 NOTAS IMPORTANTES
# =======================================================

# 1. Asegúrate de tener configuradas las variables de entorno secretas
# 2. El Container Registry debe estar accesible desde tu IP
# 3. Para producción, considera usar Azure Container Apps o AKS
# 4. Los Container Instances son ideales para cargas de trabajo simples
# 5. Para alta disponibilidad, usa múltiples instancias con Load Balancer

# =======================================================
# 🌐 URLS DE ACCESO
# =======================================================

# Después del deployment, tu aplicación estará disponible en:
# http://cs-backend-prod.swedencentral.azurecontainer.io:3000

# API Endpoints:
# - GET  /                          → Página principal
# - POST /api/v1/generation/upload  → Subir video
# - POST /api/v1/generation/        → Generar contenido
# - GET  /docs                      → Documentación Swagger
