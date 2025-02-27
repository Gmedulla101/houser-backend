"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleLogout = exports.googleSuccess = exports.googleFailure = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_status_codes_1 = require("http-status-codes");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const User_model_1 = __importDefault(require("../models/User-model"));
const errors_1 = require("../errors");
dotenv_1.default.config();
//ENSURING PRESENCE OF JWT SECRET
const authSecret = process.env.JWT_SECRET;
if (!authSecret) {
    throw new Error('Problems with the env file, type: jsonwebtoken');
}
//REGISTER FUNCTIONALITY
exports.register = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, username, fullName } = req.body;
    if (!email || !password || !username) {
        throw new errors_1.BadRequestError('Please enter complete sign up details');
    }
    //CHECKING TO SEE IF THE USERNAME AND EMAIL ALREADY EXIST IN THE DATABASE
    const takenUsername = yield User_model_1.default.findOne({ username });
    const prevUser = yield User_model_1.default.findOne({ email });
    if (takenUsername) {
        throw new errors_1.BadRequestError('Username has been taken!');
    }
    if (prevUser) {
        throw new errors_1.BadRequestError('User already exists!');
    }
    //HASHING THE PASSWORD
    const salt = yield bcryptjs_1.default.genSalt(10);
    const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
    const newUser = yield User_model_1.default.create({
        email,
        password: hashedPassword,
        username: username.toLowerCase(),
        fullName,
    });
    const token = jsonwebtoken_1.default.sign({
        userId: newUser._id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
    }, authSecret, { expiresIn: '30d' });
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        username: newUser.username,
        email: newUser.email,
        id: newUser._id,
        token,
    });
}));
//LOGIN FUNCTIONALITY
exports.login = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new errors_1.BadRequestError('Please enter complete login details');
    }
    const user = yield User_model_1.default.findOne({ email });
    if (!user) {
        throw new errors_1.UnauthenticatedError("User doesn't exist!");
    }
    const isPasswordCorrect = yield bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordCorrect) {
        throw new errors_1.UnauthenticatedError('Password is not correct');
    }
    const token = jsonwebtoken_1.default.sign({ userId: user._id, username: user.username, email: user.email }, authSecret, { expiresIn: '30d' });
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        username: user.username,
        email: user.email,
        id: user._id,
        token,
    });
}));
//GOOGLE AUTH FUNCTIONALITY
exports.googleFailure = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.user);
    res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
        success: false,
        msg: 'Auth with google failed',
    });
}));
exports.googleSuccess = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ msg: 'Unauthorised' });
    }
    //RECEIVING THE TOKEN DIRECTLY AFTER VERIFYING USER PRESCENCE IN DATABSE IN THE PASSPORT JS UTILITY
    const token = req.user;
    res.redirect(`https://houser-navy.vercel.app/google-success/token?token=${token}`);
}));
exports.googleLogout = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.logout((err) => {
        if (err) {
            console.error('Error during logout:', err);
            return res.status(500).json({ message: 'Logout failed' });
        }
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ message: 'Logout failed' });
            }
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            msg: 'Logged out',
        });
    });
}));
