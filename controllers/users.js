const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequest = require('../errors/bad-request');
const Unauthorized = require('../errors/unauthorized');
const ConflictError = require('../errors/conflict-error');

const { NODE_ENV, JWT_SECRET } = process.env;

const getMe = (req, res, next) => { // Получить информацию о себе
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
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
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequest(`Данные не прошли валидацию${err}`);
      }
      if (err.name === 'MongoError' || err.code === '11000') {
        throw new ConflictError('Такой email уже зарегистрирован');
      }
    })
    .catch(next);
};

const updateUserInfo = (req, res, next) => { // Обновить инфо юзера;
  User.findByIdAndUpdate(req.user._id,
    { name: req.body.name }, { runValidators: true })
    .then((user) => {
      if (!user) {
        throw new BadRequest('Ошибка при обновлении информации пользователя');
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
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      return res.send({ token });
    })
    .catch(() => {
      throw new Unauthorized('Авторизация не пройдена');
    })
    .catch(next);
};

module.exports = {
  getMe,
  login,
  createUser,
  updateUserInfo,
};
