"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: [true, 'Please enter your username'],
    },
    fullName: {
        type: String,
        required: [true, 'Please enter your full name'],
    },
    email: {
        type: String,
        required: [true, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Please enter our password'],
    },
    role: {
        type: String,
        enum: ['hunter', 'owner'],
    },
    phoneNumber: {
        type: Number,
    },
    country: {
        type: String,
    },
}, { timestamps: true });
const userModel = mongoose_1.default.model('user', UserSchema);
exports.default = userModel;
