const jsonwebtoken = require('jsonwebtoken');
const { NODE_ENV, JWT_SECRET } = process.env;
const { devJwtKey } = require('../utils/config');
const AuthErr = require('../errors/AuthErr');

const {
  AUTHORIZATION_REQUIRED,
} = require('../utils/constants');

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;
  if (!jwt) {
    throw new AuthErr(AUTHORIZATION_REQUIRED);
  }
  let payload;
  try {
    payload = jsonwebtoken.verify(jwt, NODE_ENV === 'production' ? JWT_SECRET : devJwtKey);
  } catch (err) {
    throw new AuthErr(AUTHORIZATION_REQUIRED);
  }
  req.user = payload;
  return next();
};
