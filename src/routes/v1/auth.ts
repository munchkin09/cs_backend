import express, { Request, Response, NextFunction, Router } from 'express';
const router = express.Router();

// Middleware that is specific to this router
const timeLog: express.RequestHandler = (req, res, next) => {
    console.log('Time: ', Date.now());
    next();
};
router.use(timeLog);

// Define the home page route
router.get('/', (req: Request, res: Response) => {
    //Validar si el usuario está autenticado y redirigir a la página de inicio
});

// Endpoint de login con steam
router.post('/', (req: Request, res: Response) => {
    res.send('Login with Steam');
});

export default router;
