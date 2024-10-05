"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CustomApiError = require('./custom-error');
const http_status_codes_1 = require("http-status-codes");
class BadRequestError extends CustomApiError {
    constructor(message) {
        super(message), (this.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
}
exports.default = BadRequestError;
