"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth-controller");
const auth_middleware_1 = require("../middleware/auth-middleware");
const authRouter = express_1.default.Router();
authRouter.post('/register-user', auth_controller_1.register);
authRouter.post('/user-login', auth_controller_1.login);
authRouter.get('/getUser', auth_middleware_1.auth, auth_controller_1.getUser);
authRouter.get('/checkUser', auth_controller_1.checkUser);
exports.default = authRouter;
