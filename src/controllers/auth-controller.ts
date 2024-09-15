const userModel = require('../models/User-model');

const register = async (req, res) => {
  res.send('User registered');
};

const login = async (req, res) => {
  res.send('User has loged in');
};

module.exports = {
  register,
  login,
};
