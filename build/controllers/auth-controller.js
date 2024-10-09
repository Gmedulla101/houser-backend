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
exports.getUser = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = require("http-status-codes");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const User_model_1 = __importDefault(require("../models/User-model"));
const errors_1 = require("../errors");
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
        username,
        fullName,
    });
    const token = jsonwebtoken_1.default.sign({
        userId: newUser._id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
    }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        username: newUser.username,
        email: newUser.email,
        token,
    });
}));
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
    const token = jsonwebtoken_1.default.sign({ userId: user._id, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        username: user.username,
        email: user.email,
        token,
    });
}));
exports.getUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_model_1.default.find({ _id: req.user.userId });
    if (!user) {
        throw new errors_1.BadRequestError('This user does not exist');
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ sucess: true, data: user });
}));
