import mongoose from "mongoose";
import express from "express";
import passport from "passport";
import type { IAuthentication } from "../types";


const AuthenticationController: IAuthentication = {

    // Endpoint de login con steam
    login: async (req: express.Request, res: express.Response) => {
        passport.authenticate("steam", { failureRedirect: "/login" })(req, res);
    },

  // Callback de Steam después de la autenticación
    steamCallback: async (req: express.Request, res: express.Response) => {
        passport.authenticate("steam", { failureRedirect: "/login" })(
        req,
        res,
        () => {
            res.redirect("/home");
        }
        );
    },

    isAuthenticated: (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect("/login");
    }
    
};

export default AuthenticationController;
