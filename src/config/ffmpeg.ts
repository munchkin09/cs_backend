/**
 * Configuración y dependencias para FFmpeg
 * 
 * FFmpeg es requerido para la funcionalidad de compresión de video.
 * 
 * INSTALACIÓN:
 * 
 * Windows:
 * 1. Descargar FFmpeg desde https://ffmpeg.org/download.html
 * 2. Extraer el archivo y añadir la carpeta bin al PATH del sistema
 * 3. Verificar instalación: ffmpeg -version
 * 
 * Linux (Ubuntu/Debian):
 * sudo apt update
 * sudo apt install ffmpeg
 * 
 * macOS:
 * brew install ffmpeg
 * 
 * Docker:
 * Si usas Docker, puedes usar una imagen base que incluya FFmpeg:
 * FROM node:18-alpine
 * RUN apk add --no-cache ffmpeg
 * 
 * VERIFICACIÓN:
 * Ejecuta este comando para verificar que FFmpeg está instalado:
 * ffmpeg -version
 * 
 * Si no está instalado, la aplicación fallará al intentar comprimir videos.
 */

import ffmpeg from 'fluent-ffmpeg';

export const FFMPEG_CONFIG = {
  // Configuraciones predeterminadas para compresión
  presets: {
    low: {
      videoBitrate: '500k',
      audioBitrate: '64k',
      size: '640x360',
      fps: 24
    },
    medium: {
      videoBitrate: '1000k',
      audioBitrate: '128k',
      size: '1280x720',
      fps: 30
    },
    high: {
      videoBitrate: '2000k',
      audioBitrate: '192k',
      size: '1920x1080',
      fps: 30
    }
  },
  
  // Límites por defecto
  limits: {
    maxSizeMB: 20,
    maxDurationSeconds: 300,
    maxUploadSizeMB: 100
  },
  
  // Formatos soportados
  supportedFormats: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'],
  
  // Códecs preferidos
  preferredCodecs: {
    video: 'libx264',
    audio: 'aac'
  }
};

/**
 * Verifica si FFmpeg está disponible en el sistema
 */
export async function checkFFmpegInstallation(): Promise<boolean> {
  return new Promise((resolve) => {
    ffmpeg.getAvailableFormats((err, formats) => {
      if (err) {
        console.error('❌ FFmpeg no está disponible:', err.message);
        console.error('Por favor, instala FFmpeg siguiendo las instrucciones en src/config/ffmpeg.ts');
        resolve(false);
      } else {
        console.log('✅ FFmpeg está disponible y funcionando');
        resolve(true);
      }
    });
  });
}

/**
 * Inicializa la configuración de FFmpeg al arrancar la aplicación
 */
export async function initializeFFmpeg(): Promise<void> {
  console.log('🔧 Inicializando FFmpeg...');
  
  const isAvailable = await checkFFmpegInstallation();
  
  if (!isAvailable) {
    console.warn('⚠️  La funcionalidad de compresión de video no estará disponible');
    console.warn('⚠️  Los videos grandes pueden fallar al ser procesados por Gemini');
  } else {
    console.log('🎬 Sistema de compresión de video listo');
  }
}
