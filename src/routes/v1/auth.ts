import type { Request, Response, RequestHandler, Application, Router } from "express";
import passport from "passport";
import session from "express-session";
import { buildAuthenticationController } from "../../controllers";
import SteamStrategy from "passport-steam";
import type { IConfiguration } from "../../types";

function buildAuthRouter(app: Application, configuration: IConfiguration) {
    const router = app.router;
    const secretSession = process.env.SESSION_SECRET;
    const realm = process.env.DOMAIN;
    const domain = process.env.STEAM_RETURN_URL;
    const steamApiKey = process.env.STEAM_API_KEY;
    const AuthenticationController = buildAuthenticationController();
    // Serialización y deserialización del usuario
    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((obj, done) => done(null, obj as Express.User));

    // Validación de variables de entorno
    if (!secretSession) {
        throw new Error("SESSION_SECRET environment variable is not set");
    }

    if (!realm) {
        throw new Error("DOMAIN environment variable is not set");
    }

    if (!domain) {
        throw new Error("STEAM_RETURN_URL environment variable is not set");
    }

    if (!steamApiKey) {
        throw new Error("STEAM_API_KEY environment variable is not set");
    }

    // Estrategia de Steam
    passport.use(new SteamStrategy(
        {
            returnURL: `${domain}steam/return`,
            realm,
            apiKey: steamApiKey,
        },
        AuthenticationController.isSuccessfulLogin
    ));

    // Middleware
    app.use(
        session({
            secret: secretSession,
            resave: false,
            saveUninitialized: false,
        })
    );

    app.use(passport.initialize());
    app.use(passport.session());

    
    router.get("/steam", AuthenticationController.login);

    router.get("/steam/return", AuthenticationController.steamCallback);

    router.get("/logout", (req: Request, res: Response) => {
        req.logout(() => {
            res.redirect("/");
        });
    });

    const authMiddleware: RequestHandler = (req, res, next) => {
        
        if (isPathAllowed(req.path) === true) {
            console.log("Auth middleware for every request:", req.path);
            next();
            return;
        }

        if (req.isAuthenticated()) {
            console.log("User method for every request isAuthenticated:", req.session);
            next();
            return;
        }

        next(new Error("User not authenticated"));
    };

    return { router, authMiddleware };

    function isPathAllowed(path: string): boolean {
    if (configuration.environment !== "production") {
        // En entornos de desarrollo, permite todas las rutas
        return true;
    }
    const allowedPaths = [
        "/api/v1/generate/upload",
        "/auth/steam",
        "/auth/steam/return",
        "/auth/logout",
        "/docs",
        "/swagger.json",
        "/static",
        "/main.js",
        "/favicon.ico"
    ];

    return allowedPaths.some(allowedPath => path.startsWith(allowedPath));
}
}

export default buildAuthRouter;
