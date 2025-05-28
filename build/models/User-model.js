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
        unique: [true, 'Username already exists'],
    },
    fullName: {
        type: String,
        required: [true, 'Please enter your full name'],
    },
    email: {
        type: String,
        required: [true, 'Please enter a valid email address'],
        unique: [true, 'Email already exists'],
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        enum: ['hunter', 'owner'],
    },
    verified: {
        type: Boolean,
        default: false,
    },
    phoneNumber: {
        type: Number,
    },
    country: {
        type: String,
    },
    profilePic: {
        type: String,
    },
}, { timestamps: true });
const userModel = mongoose_1.default.model('user', UserSchema);
exports.default = userModel;
