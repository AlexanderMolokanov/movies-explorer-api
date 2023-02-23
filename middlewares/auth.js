const jsonwebtoken = require('jsonwebtoken');
const { NODE_ENV, JWT_SECRET } = process.env;
const AuthErr = require('../errors/AuthErr');

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;
  if (!jwt) {
    throw new AuthErr('Необходима авторизация');
  }
  let payload;
  try {
    payload = jsonwebtoken.verify(jwt, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new AuthErr('Необходима авторизация');
  }
  req.user = payload;
  return next();
};
