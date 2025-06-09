import express, { Request, Response, NextFunction, Router } from 'express';
import { GeminiImplementationController } from '../../controllers/gemini_implementation'; // Adjust the import path as necessary
const router = express.Router();

const { generateText } = new GeminiImplementationController();
// Middleware that is specific to this router
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

router.post('/dame-tu-demo/:demo-code', (req: Request, res: Response) => {
    // processDemo(req.params['demo-code']);
    generateText(req.body.pathToVideo, req.body.options);
    res.send('Login with Steam');
});

export default router;
/**
 * Processes the video at
    throw new Error('Function not implemented.');
*/

