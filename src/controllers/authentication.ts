import type { Request, Response, NextFunction } from "express";
import passport from "passport";
import type { IAuthentication, ISteamProfile } from "../types";
import database from "./database";


const AuthenticationController: IAuthentication = {
    // Endpoint de login con steam
    login: async (req: Request, res: Response) => {
        passport.authenticate("steam", { failureRedirect: "/login" })(req, res);
    },

  // Callback de Steam después de la autenticación
    steamCallback: async (req: Request, res: Response) => {
        passport.authenticate("steam", { failureRedirect: "/login" })(
        req,res,() => {
            res.redirect("/");
        });
    },

    isAuthenticated: (req: Request, res: Response, next: NextFunction) => {
        if (req.isAuthenticated()) {
            console.log("User authenticated:", req.session.id);
            return next();
        }
        res.redirect("api/v1/auth/login");
    },
    isSuccessfulLogin: async (_: string, profile:any, done: (err: any, profile?: ISteamProfile) => void) => {
        await database.createOrUpdateUser(profile);
        console.log("User authenticated:", profile.id);
        return done(null, profile);
    }
    
};

export default AuthenticationController;
