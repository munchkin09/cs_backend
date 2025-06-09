"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var body_parser_1 = require("body-parser");
var user_1 = require("./routes/v1/user");
var auth_1 = require("./routes/v1/auth");
// Importa los routers de cada versión y responsabilidad
// Puedes seguir importando más routers según crezcas
var app = (0, express_1.default)();
var PORT = process.env.PORT || 3000;
app.use(body_parser_1.default.json());
// Monta los routers por versión y responsabilidad
app.use('/api/v1/users', user_1.default);
app.use('/api/v1/auth', auth_1.default);
// Endpoint raíz
app.get('/', function (_req, res) {
    res.json({ message: 'API running' });
});
app.listen(PORT, function () {
    console.log("Server running on port ".concat(PORT));
});
