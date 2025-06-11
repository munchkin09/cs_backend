import helmet from 'helmet';
import express from 'express';
import bodyParser from 'body-parser';
import { IConfiguration } from './types';
import database from './controllers/db/database';
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

const {router: authRouter, authMiddleware } = buildAuthRouter(app);
app.use(authMiddleware);

// Monta los routers por versión y responsabilidad
app.use('/auth', authRouter);

app.use('/api/v1/users', buildUserRouter());
app.use('/api/v1/generation', buildGenerationRouter(app, configuration));

app.use((req, res, next) => {
    // Middleware para manejar errores
    res.status(404).json({ error: 'Not Found' });
})

// Endpoint raíz
app.get('/', (_req, res) => {
    res.json({ message: 'API running' });
});

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`LLM Provider: ${configuration.llmProvider}`);
    console.log(`Database URL: ${configuration.databaseUrl}`);
    console.log(`Database Name: ${configuration.databaseName}`);
    await database.connect(configuration.databaseUrl, configuration.databaseName);
});