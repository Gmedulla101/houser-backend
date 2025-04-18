"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
//IMPORTING NEEDED DEPENDENCIES AND MIDDLEWARE
const express_1 = __importStar(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
require("./utils/passport-google-auth");
const connectDB_1 = __importDefault(require("./db/connectDB"));
const not_found_1 = __importDefault(require("./middleware/not-found"));
const error_handler_1 = __importDefault(require("./middleware/error-handler"));
//IMPORTING ROUTES
const user_route_1 = __importDefault(require("./routes/user-route"));
const properties_route_1 = __importDefault(require("./routes/properties-route"));
const auth_route_1 = __importDefault(require("./routes/auth-route"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
    throw new Error('Session secret not set');
}
app.use((0, express_session_1.default)({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
//NEEDED DEFAULT MIDDLEWARE
app.use(express_1.default.json());
app.use((0, express_1.urlencoded)({ extended: false }));
const allowedOrgins = [
    'http://localhost:5173',
    'https://houser-navy.vercel.app',
];
app.use((0, cors_1.default)({
    credentials: true,
    origin: allowedOrgins,
}));
//SETTING UP ROUTERs
app.use('/api/v1/user', user_route_1.default);
app.use('/api/v1/properties', properties_route_1.default);
app.use('/api/v1/auth', auth_route_1.default);
//ERROR MIDDLEWARE
app.use(not_found_1.default);
app.use(error_handler_1.default);
const PORT = process.env.PORT || 5000;
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            throw new Error('Problems with the env file, type: MongoURI');
        }
        yield (0, connectDB_1.default)(mongoURI);
        console.log('Database connected');
    }
    catch (error) {
        console.error(error);
    }
    app.listen(PORT, () => {
        console.log(`Server is listening at port ${PORT}`);
    });
});
start();
