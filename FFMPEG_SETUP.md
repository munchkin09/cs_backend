# Instalación de FFmpeg

Este proyecto requiere **FFmpeg** para la funcionalidad de compresión de video. Sin FFmpeg, los videos grandes no podrán ser procesados.

## ¿Por qué necesitamos FFmpeg?

- Los videos grandes (>20MB) no pueden ser procesados directamente por Gemini
- FFmpeg comprime automáticamente los videos para que cumplan con los límites de tamaño
- Mantiene la calidad visual mientras reduce significativamente el tamaño del archivo

## Instalación por Sistema Operativo

### 🪟 Windows

1. **Descargar FFmpeg:**
   - Ve a https://ffmpeg.org/download.html
   - Selecciona "Windows" → "Windows builds by BtbN"
   - Descarga la versión "release" más reciente

2. **Instalar:**
   - Extrae el archivo ZIP a `C:\ffmpeg\`
   - Añade `C:\ffmpeg\bin` al PATH del sistema:
     - Abre "Variables de entorno del sistema"
     - Edita la variable "Path"
     - Añade la ruta `C:\ffmpeg\bin`

3. **Verificar:**
   ```cmd
   ffmpeg -version
   ```

### 🐧 Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install ffmpeg
ffmpeg -version
```

### 🍎 macOS

```bash
# Con Homebrew
brew install ffmpeg
ffmpeg -version

# O con MacPorts
sudo port install ffmpeg
```

### 🐳 Docker

Si usas Docker, añade esto a tu Dockerfile:

```dockerfile
FROM node:18-alpine
RUN apk add --no-cache ffmpeg
# ... resto de tu configuración
```

## Verificación de Instalación

Una vez instalado, verifica que funciona:

```bash
ffmpeg -version
```

Deberías ver información sobre la versión de FFmpeg instalada.

## Configuración en el Proyecto

El proyecto verificará automáticamente que FFmpeg esté disponible al iniciar:

- ✅ **FFmpeg disponible**: Compresión automática de videos grandes
- ❌ **FFmpeg no disponible**: Solo videos pequeños (<20MB) funcionarán

## Resolución de Problemas

### Error: "ffmpeg: command not found"
- FFmpeg no está instalado o no está en el PATH
- Sigue las instrucciones de instalación para tu sistema operativo

### Error: "FFmpeg no está disponible"
- Reinicia tu terminal/consola después de instalar
- Verifica que FFmpeg esté en el PATH con `ffmpeg -version`

### Videos muy grandes siguen fallando
- El límite máximo es 100MB para upload inicial
- Después de compresión, debe ser <20MB para Gemini
- Considera reducir la duración del video original

## Límites Actuales

- **Upload máximo**: 100MB
- **Después de compresión**: 20MB
- **Duración máxima**: 5 minutos
- **Formatos soportados**: MP4, AVI, MOV, WMV, FLV, WebM

## Calidades de Compresión

- **Low**: 640x360, 500k video bitrate, 64k audio bitrate
- **Medium**: 1280x720, 1000k video bitrate, 128k audio bitrate  
- **High**: 1920x1080, 2000k video bitrate, 192k audio bitrate

La aplicación automáticamente selecciona la calidad necesaria para cumplir con el límite de 20MB.
