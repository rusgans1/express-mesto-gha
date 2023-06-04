const jwt = require('jsonwebtoken');
const InvalidError = require('../errors/InvalidError');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new InvalidError('Нужна авторизация');
  }

  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    throw new InvalidError('Нужна авторизация');
  }

  req.user = payload;

  next();
};
