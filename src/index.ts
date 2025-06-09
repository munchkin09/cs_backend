import express from 'express';
import bodyParser from 'body-parser';
import v1UserRouter from './routes/v1/user';
import v1AuthRouter from './routes/v1/auth';

// Importa los routers de cada versión y responsabilidad
// Puedes seguir importando más routers según crezcas

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Monta los routers por versión y responsabilidad
app.use('/api/v1/users', v1UserRouter);
app.use('/api/v1/auth', v1AuthRouter);

// Endpoint raíz
app.get('/', (_req, res) => {
    res.json({ message: 'API running' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});