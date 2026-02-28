import path from 'path';
import { cwd } from 'process';
import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import { IConfiguration } from './types/index.js';
import database from './controllers/db/database.js';
import { buildUserRouter , buildGenerationRouter, buildAuthRouter, buildTeamRouter } from './routes/v1/index.js';
import buildDocsRouter from './routes/v1/docs.js';
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
    const docsRouter = buildDocsRouter(app);
    app.use('/api/v1/docs', docsRouter);
    
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

// US-002: Team management endpoints (create team, list teams)
app.use('/api/v1/teams', buildTeamRouter());

app.use((req, res, next) => {
    // Middleware para manejar errores
    res.status(404).json({ error: 'Not Found' });
})

app.listen(PORT, async () => {
    console.log(`🌍 Environment: ${configuration.environment || 'fault'}`);
    // Inicializar FFmpeg
    await initializeFFmpeg();
    
    // Conectar a la base de datos
    await database.connect(configuration.dbConnectionString);
    
    
    console.log(`🤖 LLM Provider: ${configuration.llmProvider}`);
    console.log(`🗄️  Database URL: ${configuration.dbConnectionString}`);
    console.log(`📊 Database Name: CSAnalyzer`);

    console.log(`🚀 Server running on port ${PORT}`);
});
