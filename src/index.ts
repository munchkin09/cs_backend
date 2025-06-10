import helmet from 'helmet';
import express from 'express';
import bodyParser from 'body-parser';
import buildUserRouter from './routes/v1/user';
import buildAuthRouter from './routes/v1/auth';
import database from './controllers/database';
// Importa los routers de cada versión y responsabilidad
// Puedes seguir importando más routers según crezcas

const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by')

app.use(helmet())

app.use(bodyParser.json());

// Monta los routers por versión y responsabilidad
app.use('/api/v1/auth', buildAuthRouter(app));
app.use('/api/v1/users', buildUserRouter());

// Endpoint raíz
app.get('/', (_req, res) => {
    res.json({ message: 'API running' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    database.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/CS_ANALYZER');
});