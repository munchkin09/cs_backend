import express, { Request, Response, RequestHandler } from "express";
import passport from "passport";
import session from "express-session";
import AuthenticationController from "../../controllers/auth";
import SteamStrategy from "passport-steam";
const router = express.Router();
const secretSession = process.env.SESSION_SECRET;
const realm = process.env.DOMAIN || "http://localhost:3000";
const domain = process.env.STEAM_RETURN_URL;
const steamApiKey = process.env.STEAM_API_KEY;

if (!secretSession) {
    throw new Error("SESSION_SECRET environment variable is not set");
}

if (!realm) {
    throw new Error("STEAM_API_KEY environment variable is not set");
}

if (!domain) {
    throw new Error("DOMAIN environment variable is not set");
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
    function (identifier, profile, done) {
        profile.identifier = identifier;
        return done(null, profile);
    }
));
// Middleware
router.use(
    session({
        secret: secretSession,
        resave: false,
        saveUninitialized: false,
    })
);

router.use(passport.initialize());
router.use(passport.session());

// Middleware that is specific to this router
const timeLog: RequestHandler = (req, res, next) => {
    console.log("Time: ", Date.now());
    console.log("Data: ", domain);
    next();
};
router.use(timeLog);

router.get("/steam", AuthenticationController.login);

router.get("/steam/return", AuthenticationController.steamCallback);

router.get("/logout", (req, res) => {
    req.logout(() => {
        res.redirect("/");
    });
});

export default router;
