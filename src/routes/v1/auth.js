"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var router = express_1.default.Router();
// Middleware that is specific to this router
var timeLog = function (req, res, next) {
    console.log('Time: ', Date.now());
    next();
};
router.use(timeLog);
// Define the home page route
router.get('/', function (req, res) {
    //Validar si el usuario está autenticado y redirigir a la página de inicio
});
// Endpoint de login con steam
router.post('/', function (req, res) {
    res.send('Login with Steam');
});
exports.default = router;
