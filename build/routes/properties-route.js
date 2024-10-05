"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const properties_controller_1 = require("../controllers/properties-controller");
const auth_middleware_1 = require("../middleware/auth-middleware");
const propertiesRouter = express_1.default.Router();
propertiesRouter.get('/get-all-Properties', properties_controller_1.getAllProps);
propertiesRouter.get('/featured-Properties', properties_controller_1.getFeaturedProps);
propertiesRouter.get('/my-properties', auth_middleware_1.auth, properties_controller_1.getUserProp);
propertiesRouter.get('/get-property/:id', properties_controller_1.getProp);
propertiesRouter.post('/add-property', auth_middleware_1.auth, properties_controller_1.createProp);
propertiesRouter.patch('/update-property/:id', auth_middleware_1.auth, properties_controller_1.updateProp);
propertiesRouter.delete('/delete-property/:id', auth_middleware_1.auth, properties_controller_1.deleteProp);
exports.default = propertiesRouter;
