"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user-controller");
const auth_middleware_1 = require("../middleware/auth-middleware");
const userRouter = (0, express_1.Router)();
userRouter.get('/getUser', auth_middleware_1.auth, user_controller_1.getUser);
userRouter.get('/checkUser', user_controller_1.checkUser);
exports.default = userRouter;
