import path from 'path';
import { cwd } from 'process';
import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import type { Request, Response } from 'express';
import { IConfiguration } from './types';
import database from './controllers/db/database';
import SwaggerUIDist from 'swagger-ui-dist';
import { buildUserRouter , buildGenerationRouter, buildAuthRouter } from './routes/v1/';



// Importa los routers de cada versión y responsabilidad
// Puedes seguir importando más routers según crezcas
const app = express();
const PORT = process.env.PORT || 3000;
const configuration: IConfiguration = {
    llmProvider: process.env.LLM_PROVIDER || 'gemini',
    llmApiKey: process.env.LLM_API_KEY || '',
    databaseUrl: process.env.MONGODB_URI as string || 'mongodb://localhost:27017',
    databaseName: process.env.MONGODB_NAME || 'csainalyzer'
};

app.disable('x-powered-by');

app.use(helmet());

app.use(bodyParser.json());

const swaggerUiAssetPath = SwaggerUIDist.getAbsoluteFSPath();
const { router: authRouter, authMiddleware } = buildAuthRouter(app);

app.use('/docs', express.static(swaggerUiAssetPath));

app.get('/swagger.json', (req: Request, res: Response) => {
    res.sendFile(path.join(cwd(), 'swagger', 'openapi.json'));
});
app.use(authMiddleware);

// Endpoint raíz
app.use(express.static(path.join(cwd(), 'static')))

app.get('/', (req, res) => {
    res.sendFile(path.join(cwd(), 'static', 'index.html'));
});

// Monta los routers por versión y responsabilidad
app.use('/auth', authRouter);

app.use('/api/v1/users', buildUserRouter());
app.use('/api/v1/generation', buildGenerationRouter(app, configuration));

app.use((req, res, next) => {
    // Middleware para manejar errores
    res.status(404).json({ error: 'Not Found' });
})

app.listen(PORT, async () => {
    await database.connect(configuration.databaseUrl, configuration.databaseName);
    console.log(`Server running on port ${PORT}`);
    console.log(`LLM Provider: ${configuration.llmProvider}`);
    console.log(`Database URL: ${configuration.databaseUrl}`);
    console.log(`Database Name: ${configuration.databaseName}`);
});