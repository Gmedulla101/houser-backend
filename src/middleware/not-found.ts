const notFound = (req, res) => {
  res.status(400).json({ sucess: false, msg: 'This route does not exist' });
};

module.exports = notFound;
