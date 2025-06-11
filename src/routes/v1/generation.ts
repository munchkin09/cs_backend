import type { Request, Response, RequestHandler, Application, Router, NextFunction } from "express";
import { IConfiguration } from "../../types";
import { buildGenerationController } from "../../controllers/generation";
import buildUploadProcessor from "../../controllers/upload";

function buildGenerationRouter(app: Application, configuration: IConfiguration) {
    const router = app.router;
    const { upload } = buildUploadProcessor();
    const { createGeneration } = buildGenerationController(configuration);


    router.post('/upload', upload.single('video'), ((req, res): void => {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        // Aquí puedes procesar el archivo subido
        console.log('File uploaded:', req.file);

        res.status(200).json({ message: req.file });
    }) as RequestHandler);

    router.post('/generate', async (req: Request, res: Response, next: NextFunction) => {
        let jobId;
        try {
            jobId = await createGeneration({ pathToVideo: req.body.file,  });
        } catch (error) {
            console.error('Error in generation route:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(200).json({ message: 'Generation started', jobId});
    });

    return router;
}

export default buildGenerationRouter;
