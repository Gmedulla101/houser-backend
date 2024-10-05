"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthenticatedError = exports.NotFoundError = exports.BadRequestError = exports.CustomApiError = void 0;
const bad_request_1 = __importDefault(require("./bad-request"));
exports.BadRequestError = bad_request_1.default;
const not_found_error_1 = __importDefault(require("./not-found-error"));
exports.NotFoundError = not_found_error_1.default;
const unauth_1 = __importDefault(require("./unauth"));
exports.UnauthenticatedError = unauth_1.default;
const custom_error_1 = __importDefault(require("./custom-error"));
exports.CustomApiError = custom_error_1.default;
