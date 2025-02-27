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
const User_model_1 = __importDefault(require("../models/User-model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passport_google_oauth2_1 = __importDefault(require("passport-google-oauth2"));
const passport_1 = __importDefault(require("passport"));
const GoogleStrategy = passport_google_oauth2_1.default.Strategy;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
passport_1.default.use('google', new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://houser-backend.onrender.com/api/v1/auth/google/callback',
    passReqToCallback: true,
}, function (request, accessToken, refreshToken, profile, done) {
    return __awaiter(this, void 0, void 0, function* () {
        const userDetails = {
            username: profile.email,
            fullName: `${profile.given_name} ${profile.famiy_name}`,
            email: profile.email,
            role: 'hunter',
            profilePic: profile.picture,
        };
        const addUserToDb = () => __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield User_model_1.default.findOne({
                email: userDetails.email,
            });
            if (existingUser) {
                return existingUser;
            }
            else {
                const newUser = yield User_model_1.default.create(userDetails);
                return newUser;
            }
        });
        const user = yield addUserToDb();
        const token = jsonwebtoken_1.default.sign({ userId: user._id, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: '15d' });
        return done(null, token);
    });
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    done(null, user);
});
