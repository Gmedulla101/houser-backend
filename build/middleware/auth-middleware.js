"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_1 = require("../errors");
const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new errors_1.UnauthenticatedError('Authentication invalid');
    }
    const token = authHeader.split(' ')[1];
    try {
        const authSecret = process.env.JWT_SECRET;
        if (!authSecret) {
            throw new Error('Problems in the env file, type: jsonwebtoken');
        }
        const payload = jsonwebtoken_1.default.verify(token, authSecret);
        req.user = {
            username: payload.username,
            email: payload.email,
            userId: payload.userId,
        };
        next();
    }
    catch (error) {
        throw new errors_1.UnauthenticatedError('Authentication invalid');
    }
};
exports.auth = auth;
