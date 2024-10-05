"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notFound = (req, res) => {
    res.status(400).json({ sucess: false, msg: 'This route does not exist' });
};
exports.default = notFound;
