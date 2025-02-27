"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth-controller");
const passport_1 = __importDefault(require("passport"));
const authRouter = express_1.default.Router();
authRouter.post('/register-user', auth_controller_1.register);
authRouter.post('/user-login', auth_controller_1.login);
//ALL GOOGLE STUFF
authRouter.get('/google-working', passport_1.default.authenticate('google', { scope: ['email', 'profile'] }));
authRouter.get('/google/callback', passport_1.default.authenticate('google', {
    failureRedirect: '/api/v1/auth/google-failure',
}), auth_controller_1.googleSuccess);
authRouter.get('/google-faiure', auth_controller_1.googleFailure);
authRouter.get('/logout', auth_controller_1.googleLogout);
exports.default = authRouter;
