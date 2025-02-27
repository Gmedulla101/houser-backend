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
exports.checkUser = exports.getUser = void 0;
const User_model_1 = __importDefault(require("../models/User-model"));
const http_status_codes_1 = require("http-status-codes");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const errors_1 = require("../errors");
exports.getUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield User_model_1.default.find({ _id: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId });
    if (!user) {
        throw new errors_1.BadRequestError('This user does not exist');
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ sucess: true, data: user });
}));
exports.checkUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email } = req.query;
    let queryObject = {};
    if (username) {
        queryObject.username = username;
    }
    if (email) {
        queryObject.email = email;
    }
    const user = yield User_model_1.default.findOne(queryObject);
    if (user) {
        throw new errors_1.BadRequestError(`${username || email} already exists`);
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, data: 'proceed' });
}));
