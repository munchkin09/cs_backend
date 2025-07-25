import path from "path";
import { cwd } from "process";
import type { Request, Response, RequestHandler, Application, Router, NextFunction } from "express";
import { IConfiguration } from "../../types";
import { buildGenerationController, buildUploadProcessor } from "../../controllers";

function buildGenerationRouter(app: Application, configuration: IConfiguration) {
    const router = app.router;
    const { upload, processUploadedVideo } = buildUploadProcessor();
    const { createGeneration } = buildGenerationController(configuration);

    router.post('/upload', upload.single('video'), (async (req, res): Promise<void> => {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        try {
            console.log('Archivo subido:', req.file.filename);
            
            // Procesar y comprimir el video si es necesario
            const processingResult = await processUploadedVideo(req.file.path, {
                maxSizeMB: 20,
                quality: 'medium',
                maxDuration: 300 // 5 minutos máximo
            });

            if (!processingResult.success) {
                res.status(500).json({ error: 'Error al procesar el video' });
                return;
            }

            // Extraer solo el nombre del archivo de la ruta procesada
            const processedFileName = path.basename(processingResult.processedPath);

            res.status(200).json({ 
                message: processedFileName,
                compressed: processingResult.compressed,
                originalSizeMB: processingResult.compressed ? processingResult.originalSizeMB : processingResult.sizeMB,
                finalSizeMB: processingResult.compressed ? processingResult.compressedSizeMB : processingResult.sizeMB,
                compressionRatio: processingResult.compressionRatio || 1
            });

        } catch (error) {
            console.error('Error procesando video:', error);
            res.status(500).json({ 
                error: 'Error al procesar el video',
                details: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }) as RequestHandler);

    router.post('/generate', async (req: Request, res: Response, next: NextFunction) => {
        let jobId;
        try {
            const { videoName } = req.body;
            
            /*if (!videoName) {
                res.status(400).json({ error: 'videoName is required' });
                return;
            }*/

            const videoPath = path.join(cwd(), 'uploads', 'subject_1.mp4');
            console.log('Procesando video desde:', videoPath);
            
            jobId = await createGeneration({ pathToVideo: videoPath });
            
            res.status(200).json({ message: 'Generation started', jobId });
        } catch (error) {
            console.error('Error in generation route:', error);
            res.status(500).json({ 
                error: 'Internal Server Error',
                details: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    });

    return router;
}

export default buildGenerationRouter;
