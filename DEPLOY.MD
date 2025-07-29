# 🚀 Guía de Despliegue Automático en Azure App Service Plans para cs-backend 💙

## 📝 Resumen
Este documento te guía para desplegar tu backend y dependencias en Azure App Service usando CI/CD con GitHub Actions y Azure Developer CLI (azd). ¡Prepárate para una experiencia cloud llena de emojis! 😎🌩️

---

## 1️⃣ Requisitos previos
- Cuenta de Azure activa 🪪
- Azure CLI y Azure Developer CLI (`azd`) instalados 🛠️
- Acceso a Azure Portal y permisos para crear recursos 🧑‍💻
- Secrets configurados en GitHub: `AZURE_CREDENTIALS`, `LLM_API_KEY` 🔑

---

## 2️⃣ Estructura de archivos generados
- `infra/main.bicep` ➡️ Infraestructura principal (App Service, CosmosDB, Insights...)
- `infra/main.parameters.json` ➡️ Parámetros de despliegue
- `azure.yaml` ➡️ Configuración de azd
- `.github/workflows/deploy.yml` ➡️ Pipeline de CI/CD

---

## 3️⃣ Pasos para el despliegue automático

### 🏗️ 1. Infraestructura como código (IaC)
- El archivo `main.bicep` define todos los recursos necesarios en Azure.
- Los parámetros personalizables están en `main.parameters.json`.

### 🤖 2. Configuración de azd
- El archivo `azure.yaml` conecta tu proyecto con la infraestructura y servicios.

### 🔄 3. CI/CD con GitHub Actions
- El workflow `deploy.yml` construye, valida y despliega automáticamente en Azure cada push a `main`.

### 🧪 4. Validación y logs
- Revisa los logs de despliegue en Azure Portal y con `azd logs`.

---

## 4️⃣ Comandos útiles
```sh
azd auth login # Inicia sesión en Azure
azd init      # Inicializa el proyecto azd
azd provision # Previsualiza y provisiona recursos
azd up        # Despliega la app y recursos
azd logs      # Consulta logs de la app
```

---

## 5️⃣ ¡Despliega como un pro! 🦸‍♂️
1. Haz push a tu repo en GitHub 🚀
2. El workflow CI/CD se encarga del resto 🤖
3. ¡Tu backend estará corriendo en Azure App Service! 🌐

---

## 6️⃣ Recursos útiles
- [Documentación Azure App Service](https://learn.microsoft.com/es-es/azure/app-service/)
- [Documentación Dagger.io](https://dagger.io/docs)
- [Documentación azd](https://learn.microsoft.com/es-es/azure/developer/cli/)

---

## 7️⃣ Emojis para tu despliegue
🎉🚀💙🦾🧑‍💻🌩️🛠️🔑🤖🦸‍♂️🌐

---

## 8️⃣ ¿Dudas?
¡Pregunta en el canal de soporte o revisa los logs! 😅

---

## 9️⃣ Estructura generada
- `/infra/main.bicep`
- `/infra/main.parameters.json`
- `/azure.yaml`
- `/.github/workflows/deploy.yml`
- `/DEPLOY.MD`

¡Listo para la nube! ☁️
