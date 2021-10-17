const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequest = require('../errors/bad-request');
const Unauthorized = require('../errors/unauthorized');
const ConflictError = require('../errors/conflict-error');
const { JWT_SECRET } = require('../utils/configEnv');
const {
  NOT_EXIST_ID,
  VALIDATION_ERROR,
  CAST_ERROR,
  INVALID_DATA,
  ERR_NAME,
  ERR_CODE,
  SAME_EMAIL,
  BAD_REQUEST_USER_UPDATE,
  BAD_AUTHORIZATED,
} = require('../utils/errorsText');

const getMe = (req, res, next) => { // Получить информацию о себе
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(NOT_EXIST_ID);
      }
      return res.status(200).send({ data: user });
    })
    .catch(next);
};

const createUser = (req, res, next) => { // Создать юзера (регистрация)
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10) // --хешируем пароль
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.status(200).send({ email: user.email }))
    .catch((err) => {
      if (err.name === VALIDATION_ERROR || err.name === CAST_ERROR) {
        throw new BadRequest(INVALID_DATA);
      }
      if (err.name === ERR_NAME || err.code === ERR_CODE) {
        throw new ConflictError(SAME_EMAIL);
      }
    })
    .catch(next);
};

const updateUserInfo = (req, res, next) => { // Обновить инфо юзера;
  User.findByIdAndUpdate(req.user._id,
    { name: req.body.name, email: req.body.email }, { runValidators: true })
    .then((user) => {
      if (!user) {
        throw new BadRequest(BAD_REQUEST_USER_UPDATE);
      }
      res.status(200).send({ data: user });
    })
    .catch(next);
};

const login = (req, res, next) => { // --авторизация
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      return res.send({ token });
    })
    .catch(() => {
      throw new Unauthorized(BAD_AUTHORIZATED);
    })
    .catch(next);
};

module.exports = {
  getMe,
  login,
  createUser,
  updateUserInfo,
};
