// Asegúrate de que el directorio "uploads" existe
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { cwd } from 'process';
import { Request } from 'express';
import { FileFilterCallback } from 'multer';
import { VideoCompressor, CompressionOptions } from '../utils/videoCompressor';

export default function buildUploadProcessor() {
    const uploadDir = path.join(cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

    // Configuración del almacenamiento con multer
    const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
    });

    // Filtro para asegurarse de que solo se suban vídeos
    const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        if (file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de vídeo'));
        }
    };

    // Configuración de multer con límite de tamaño más alto (para video sin comprimir)
    const upload = multer({ 
        storage, 
        fileFilter,
        limits: {
            fileSize: 100 * 1024 * 1024 // 100MB límite inicial antes de comprimir
        }
    });

    /**
     * Procesa y comprime un video subido
     */
    const processUploadedVideo = async (filePath: string, options?: CompressionOptions) => {
        try {
            console.log('Iniciando procesamiento de video:', filePath);
            
            // Verificar que ffmpeg esté disponible
            const ffmpegAvailable = await VideoCompressor.checkFFmpegAvailable();
            if (!ffmpegAvailable) {
                throw new Error('FFmpeg no está instalado o no está disponible en el PATH del sistema');
            }

            // Obtener información del video
            const videoInfo = await VideoCompressor.getVideoInfo(filePath);
            console.log('Información del video:', {
                duration: videoInfo.format?.duration,
                size: videoInfo.format?.size,
                bitrate: videoInfo.format?.bit_rate
            });

            // Verificar si el video necesita compresión
            const fileSizeBytes = fs.statSync(filePath).size;
            const fileSizeMB = fileSizeBytes / (1024 * 1024);
            
            console.log(`Tamaño del archivo: ${fileSizeMB.toFixed(2)}MB`);

            // Si el archivo es menor a 20MB, no comprimir
            if (fileSizeMB <= 20) {
                console.log('El archivo ya es suficientemente pequeño, no se requiere compresión');
                return {
                    success: true,
                    originalPath: filePath,
                    processedPath: filePath,
                    compressed: false,
                    sizeMB: fileSizeMB
                };
            }

            // Comprimir el video
            console.log('Iniciando compresión del video...');
            const compressionResult = await VideoCompressor.compressVideo(filePath, options);

            // Eliminar el archivo original si la compresión fue exitosa
            fs.unlinkSync(filePath);
            console.log('Archivo original eliminado después de la compresión exitosa');

            return {
                success: true,
                originalPath: filePath,
                processedPath: compressionResult.compressedPath,
                compressed: true,
                originalSizeMB: compressionResult.originalSizeMB,
                compressedSizeMB: compressionResult.compressedSizeMB,
                compressionRatio: compressionResult.compressionRatio
            };

        } catch (error) {
            console.error('Error procesando video:', error);
            throw new Error(`Error al procesar el video: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    };

    return { upload, fileFilter, processUploadedVideo };
}

