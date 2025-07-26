import express from 'express';
import SwaggerUIDist from 'swagger-ui-dist';
import path from 'path';
import { cwd } from 'process';

function buildDocsRouter(app: express.Application) {
    const docsRouter = app.router;
    const swaggerUiPath = SwaggerUIDist.getAbsoluteFSPath();
    // 1. Sirve la spec OpenAPI
    docsRouter.get('/swagger.json', (_, res) => {
    res.sendFile(path.join(cwd(),'swagger', 'openapi.json'));
    });

    // 2. Sirve los assets de Swagger UI
    docsRouter.use('/docs-assets', express.static(swaggerUiPath));

    // 3. Sirve el HTML y JS de la carpeta public/docs
    docsRouter.use('/docs', express.static(path.join(cwd(), 'docs')));

    // Endpoint raíz
    docsRouter.use(express.static(path.join(cwd(), 'static')));

    docsRouter.get('/', (req, res) => {
        res.sendFile(path.join(cwd(), 'static', 'index.html'));
    });

    return docsRouter;
}

export default buildDocsRouter;