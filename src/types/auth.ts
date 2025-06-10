import type express from "express";

export interface ISteamProfile {
    provider: string;
    _json: {
        steamid: string;
        communityvisibilitystate: number;
        profilestate: number;
        personaname: string;
        commentpermission: number;
        profileurl: string;
        avatar: string;
        avatarmedium: string;
        avatarfull: string;
        avatarhash: string;
        lastlogoff: number;
        personastate: number;
        realname: string;
        primaryclanid: string;
        timecreated: number;
        personastateflags: number;
        loccountrycode: string;
        locstatecode: string;
    };
    id: string;
    displayName: string;
    photos: Array<{ value: string }>;
}

export interface IAuthentication {
    login: (req: express.Request, res: express.Response) => void;
    steamCallback: (req: express.Request, res: express.Response) => void;
    isSuccessfulLogin: (identifier: string, profile: ISteamProfile, done: (err: any, profile?: ISteamProfile) => void) => void;
    isAuthenticated: (req: express.Request, res: express.Response, next: express.NextFunction) => void;
}
