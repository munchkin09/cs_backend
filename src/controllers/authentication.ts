import type { Request, Response, NextFunction } from "express";
import passport from "passport";
import type { IAuthentication, ISteamProfile } from "../types/index.js";
import database from "./db/database.js";


function buildAuthenticationController(): IAuthentication {
    // Endpoint de login con steam
    const login = async (req: Request, res: Response) => {
        passport.authenticate("steam", { failureRedirect: "/login" })(req, res);
    };

    // Callback de Steam después de la autenticación
    const steamCallback = async (req: Request, res: Response) => {
        passport.authenticate("steam", { failureRedirect: "/login" })(
        req,res,() => {
            console.log("User authenticated successfully:", req.user);
            res.redirect("/");
        });
    };

    // Middleware para verificar si el usuario está autenticado
    const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
        if (req.isAuthenticated()) {
            console.log("User method isAuthenticated:", req.session.id);
            return next();
        }
        res.redirect("auth/login");
    };

    // Método que se llama cuando la autenticación es exitosa
    const isSuccessfulLogin = async (_: string, profile:any, done: (err: any, profile?: ISteamProfile) => void) => {
        await database.createOrUpdateUser(profile);
        console.log("User authenticated:", profile.id);
        return done(null, profile);
    }

    return {
        login,
        steamCallback,
        isAuthenticated,
        isSuccessfulLogin
    };
};

export default buildAuthenticationController;
