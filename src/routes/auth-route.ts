import express from 'express';
const { register, login } = require('../controllers/auth-controller');

const authRouter = express.Router();

authRouter.post('/register-user', register);
authRouter.post('/user-login', login);

module.exports = authRouter;
