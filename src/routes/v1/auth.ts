import type { Request, Response, RequestHandler, Application, Router } from "express";
import passport from "passport";
import session from "express-session";
import AuthenticationController from "../../controllers/authentication";
import SteamStrategy from "passport-steam";

function buildAuthRouter(app: Application) {
    const router = app.router;
    const secretSession = process.env.SESSION_SECRET;
    const realm = process.env.DOMAIN;
    const domain = process.env.STEAM_RETURN_URL;
    const steamApiKey = process.env.STEAM_API_KEY;
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
            returnURL: `${domain}api/v1/auth/steam/return`,
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

    // Middleware that is specific to this router
    const timeLog: RequestHandler = (req, res, next) => {
        next();
    };
    router.use(timeLog);

    router.get("/steam", AuthenticationController.login);

    router.get("/steam/return", AuthenticationController.steamCallback);

    router.get("/logout", (req: Request, res: Response) => {
        req.logout(() => {
            res.redirect("/");
        });
    });
    return router;
}

export default buildAuthRouter;
