import path from 'path';
import { cwd } from 'process';
import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import { IConfiguration } from './types/index.js';
import database from './controllers/db/database.js';
import SwaggerUIDist from 'swagger-ui-dist';
import { buildUserRouter , buildGenerationRouter, buildAuthRouter } from './routes/v1/index.js';
import { initializeFFmpeg } from './config/ffmpeg.js';

// Puedes seguir importando más routers según crezcas
const env = process.env.NODE_ENV || 'development';
const app = express();
const PORT = process.env.PORT || 3000;
const configuration: IConfiguration = {
    llmProvider: process.env.LLM_PROVIDER || 'gemini',
    llmApiKey: process.env.LLM_API_KEY || '',
    dbConnectionString: process.env.AZURE_COSMOS_CONNECTIONSTRING as string || 'mongodb://localhost:27017',
    environment: process.env.NODE_ENV,
};

app.disable('x-powered-by');

app.use(helmet());

app.use(bodyParser.json());


if (env === 'development') {

    const swaggerUiPath = SwaggerUIDist.getAbsoluteFSPath();
    // 1. Sirve la spec OpenAPI
    app.get('/swagger.json', (_, res) => {
    res.sendFile(path.join(cwd(),'swagger', 'openapi.json'));
    });

    // 2. Sirve los assets de Swagger UI
    app.use('/docs-assets', express.static(swaggerUiPath));

    // 3. Sirve el HTML y JS de la carpeta public/docs
    app.use('/docs', express.static(path.join(cwd(), 'docs')));

    // Endpoint raíz
    app.use(express.static(path.join(cwd(), 'static')))

    app.get('/', (req, res) => {
        res.sendFile(path.join(cwd(), 'static', 'index.html'));
    });
}

// Servir archivos estáticos ANTES del middleware de autenticación
app.use(express.static(path.join(cwd(), 'static')))

// Endpoint raíz
app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(cwd(), 'static', 'index.html'));
    return;
});
const { router: authRouter, authMiddleware } = buildAuthRouter(app, configuration);

app.use('/api/v1/generation', buildGenerationRouter(app, configuration));
app.use(authMiddleware);

// Monta los routers por versión y responsabilidad
app.use('/auth', authRouter);

app.use('/api/v1/users', buildUserRouter());

app.use((req, res, next) => {
    // Middleware para manejar errores
    res.status(404).json({ error: 'Not Found' });
})

app.listen(PORT, async () => {
    // Inicializar FFmpeg
    await initializeFFmpeg();
    
    // Conectar a la base de datos
    await database.connect(configuration.dbConnectionString);
    
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🤖 LLM Provider: ${configuration.llmProvider}`);
    console.log(`🗄️  Database URL: ${configuration.dbConnectionString}`);
    console.log(`📊 Database Name: CSAnalyzer`);
    console.log(`🌍 Environment: ${configuration.environment || 'development'}`);
});