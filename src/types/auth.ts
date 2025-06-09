import type express from "express";

export interface IAuthentication {
    login: (req: express.Request, res: express.Response) => void;
    steamCallback: (req: express.Request, res: express.Response) => void;
    isAuthenticated: (req: express.Request, res: express.Response, next: express.NextFunction) => void;
}
