const jwt = require('jsonwebtoken');
require('dotenv').config();
const { JWT_SECRET } = require('../utils/configEnv');
const Unauthorized = require('../errors/unauthorized');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Unauthorized('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Unauthorized('Необходима авторизация');
  }

  req.user = payload;
  next();
};
