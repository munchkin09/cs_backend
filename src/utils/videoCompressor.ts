import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs/promises';
import { cwd } from 'process';

export interface CompressionOptions {
  maxSizeMB?: number;
  outputFormat?: string;
  quality?: 'low' | 'medium' | 'high';
  maxDuration?: number; // segundos
}

export interface CompressionResult {
  originalPath: string;
  compressedPath: string;
  originalSizeMB: number;
  compressedSizeMB: number;
  compressionRatio: number;
}

export class VideoCompressor {
  private static readonly DEFAULT_OPTIONS: Required<CompressionOptions> = {
    maxSizeMB: 20,
    outputFormat: 'mp4',
    quality: 'low',
    maxDuration: 300 // 5 minutos
  };

  /**
   * Comprime un video para reducir su tamaño
   */
  static async compressVideo(
    inputPath: string,
    options: CompressionOptions = {}
  ): Promise<CompressionResult> {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    
    // Verificar que el archivo de entrada existe
    try {
      await fs.access(inputPath);
    } catch (error) {
      throw new Error(`El archivo de entrada no existe: ${inputPath}`);
    }

    // Generar ruta de salida
    const inputDir = path.dirname(inputPath);
    const inputName = path.basename(inputPath, path.extname(inputPath));
    const outputPath = path.join(inputDir, `${inputName}_compressed.${opts.outputFormat}`);

    // Obtener tamaño original
    const originalStats = await fs.stat(inputPath);
    const originalSizeMB = originalStats.size / (1024 * 1024);

    return new Promise((resolve, reject) => {
      const command = ffmpeg(inputPath);

      // Configurar calidad según la opción
      switch (opts.quality) {
        case 'low':
          command
            .videoCodec('libx264')
            .audioCodec('aac')
            .videoBitrate('500k')
            .audioBitrate('64k')
            .size('640x360');
          break;
        case 'medium':
          command
            .videoCodec('libx264')
            .audioCodec('aac')
            .videoBitrate('1000k')
            .audioBitrate('128k')
            .size('1280x720');
          break;
        case 'high':
          command
            .videoCodec('libx264')
            .audioCodec('aac')
            .videoBitrate('2000k')
            .audioBitrate('192k')
            .size('1920x1080');
          break;
      }

      // Limitar duración si es necesario
      if (opts.maxDuration) {
        command.duration(opts.maxDuration);
      }

      // Configuraciones adicionales para optimizar compresión
      command
        .fps(30)
        .format(opts.outputFormat)
        .outputOptions([
          '-preset', 'medium',
          '-crf', '28', // Factor de calidad constante (0-51, menor = mejor calidad)
          '-movflags', '+faststart' // Optimización para streaming
        ])
        .on('start', (commandLine) => {
          console.log('Iniciando compresión con comando:', commandLine);
        })
        .on('progress', (progress) => {
          console.log(`Progreso de compresión: ${Math.round(progress.percent || 0)}%`);
        })
        .on('end', async () => {
          try {
            // Verificar el tamaño del archivo comprimido
            const compressedStats = await fs.stat(outputPath);
            const compressedSizeMB = compressedStats.size / (1024 * 1024);
            
            console.log(`Compresión completada. Tamaño original: ${originalSizeMB.toFixed(2)}MB, Comprimido: ${compressedSizeMB.toFixed(2)}MB`);
            
            // Si el archivo comprimido sigue siendo muy grande, intentar con calidad más baja
            if (compressedSizeMB > opts.maxSizeMB && opts.quality !== 'low') {
              console.log('El archivo comprimido sigue siendo muy grande, intentando con calidad más baja...');
              
              // Eliminar el archivo temporal
              await fs.unlink(outputPath);
              
              // Reintentar con calidad más baja
              const lowerQualityOptions = { ...opts, quality: 'low' as const };
              const result = await this.compressVideo(inputPath, lowerQualityOptions);
              resolve(result);
              return;
            }

            const result: CompressionResult = {
              originalPath: inputPath,
              compressedPath: outputPath,
              originalSizeMB,
              compressedSizeMB,
              compressionRatio: originalSizeMB / compressedSizeMB
            };

            resolve(result);
          } catch (error) {
            reject(new Error(`Error al verificar el archivo comprimido: ${error}`));
          }
        })
        .on('error', (error) => {
          console.error('Error durante la compresión:', error);
          reject(new Error(`Error de compresión: ${error.message}`));
        })
        .save(outputPath);
    });
  }

  /**
   * Verifica si ffmpeg está disponible en el sistema
   */
  static async checkFFmpegAvailable(): Promise<boolean> {
    return new Promise((resolve) => {
      ffmpeg.getAvailableFormats((err, formats) => {
        if (err) {
          console.error('FFmpeg no está disponible:', err.message);
          resolve(false);
        } else {
          console.log('FFmpeg está disponible');
          resolve(true);
        }
      });
    });
  }

  /**
   * Obtiene información del video
   */
  static async getVideoInfo(videoPath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(videoPath, (err, metadata) => {
        if (err) {
          reject(new Error(`Error al obtener información del video: ${err.message}`));
        } else {
          resolve(metadata);
        }
      });
    });
  }
}
