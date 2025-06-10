import express, { Request, Response } from 'express';

function buildUserRouter() {
    // Middleware that is specific to this router
    const router = express.Router();
    const timeLog: express.RequestHandler = (req, res, next) => {
        console.log('Time: ', Date.now());
        next();
    };
    router.use(timeLog);

    // Define the home page route
    router.get('/', (req: Request, res: Response) => {
        //Validar si el usuario está autenticado y redirigir a la página de inicio
        res.send('Login with Steam');
    });

    // Endpoint de login con steam
    router.post('/', (req: Request, res: Response) => {
        
        res.send('Login with Steam');
    });

    return router;
}

export default buildUserRouter;
/**
 * Processes the video at
    throw new Error('Function not implemented.');
*/

