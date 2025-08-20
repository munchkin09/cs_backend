import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs/promises';
import { cwd } from 'process';

export interface CompressionOptions {
  maxSizeMB?: number;
  outputFormat?: string;
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
    maxSizeMB: 19.9,
    outputFormat: 'mp4',
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

    return new Promise(async (resolve, reject) => {
      try {
        // Get video metadata to calculate optimal bitrate
        const metadata = await this.getVideoInfo(inputPath);
        const videoDuration = metadata.format.duration;
        const targetSizeBytes = opts.maxSizeMB * 1024 * 1024;
        
        // Calculate target bitrate (accounting for audio overhead)
        const audioBitrate = 64000; // 64kbps audio
        const targetVideoBitrate = Math.max(
          200000, // minimum 200kbps
          Math.floor((targetSizeBytes * 8) / videoDuration) - audioBitrate
        );
        
        const command = ffmpeg(inputPath)
          .videoCodec('libx264')
          .audioCodec('aac')
          .videoBitrate(targetVideoBitrate)
          .audioBitrate('64k')
          .fps(25)
          .format(opts.outputFormat);

        // Limitar duración si es necesario
        if (opts.maxDuration && videoDuration > opts.maxDuration) {
          command.duration(opts.maxDuration);
        }

        // Configuraciones para compresión óptima
        command
          .outputOptions([
            '-preset', 'medium',
            '-maxrate', `${Math.floor(targetVideoBitrate * 1.2)}`, // 20% buffer
            '-bufsize', `${Math.floor(targetVideoBitrate * 2)}`, // 2x bitrate buffer
            '-movflags', '+faststart'
          ])
          .on('start', (commandLine) => {
            console.log('Iniciando compresión con comando:', commandLine);
            console.log(`Target bitrate: ${Math.floor(targetVideoBitrate / 1000)}kbps para ${opts.maxSizeMB}MB`);
          })
          .on('progress', (progress) => {
            console.log(`Progreso de compresión: ${Math.round(progress.percent || 0)}%`);
          })
          .on('end', async () => {
            try {
              const compressedStats = await fs.stat(outputPath);
              const compressedSizeMB = compressedStats.size / (1024 * 1024);
              
              console.log(`Compresión completada. Tamaño original: ${originalSizeMB.toFixed(2)}MB, Comprimido: ${compressedSizeMB.toFixed(2)}MB`);
              
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
      } catch (error) {
        reject(new Error(`Error al obtener información del video: ${error}`));
      }
    });
  }

  /**
   * Verifica si ffmpeg está disponible en el sistema
   */
  static async checkFFmpegAvailable(): Promise<boolean> {
    return new Promise((resolve) => {
      ffmpeg.getAvailableFormats((err) => {
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
