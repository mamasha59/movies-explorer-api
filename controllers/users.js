const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const { NODE_ENV, JWT_SECRET } = process.env;

const BadRequestError = require("../errors/bad-request-err"); // 400
const UnauthorizedError = require("../errors/unauthorized-err"); // 401
const NotFoundError = require("../errors/not-found-err"); // 404
const ConflictError = require("../errors/conflict-err"); // 409

// регистрация пользователя
module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        email,
        password: hash,
      })
    )
    .then((user) => {
      res.send({
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Переданы некорректные данные"));
      } else if (err.name === "MongoError" && err.code === 11000) {
        next(new ConflictError("Такой пользователь уже существует"));
      } else {
        next(err);
      }
    });
};
// авторизация пользователя
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user.id },
        NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
        {
          expiresIn: "7d",
        }
      );
      res
        .cookie("jwt", token, {
          maxAge: 3600000 * 24 * 7,
          /*   httpOnly: true,
          sameSite: true, */
        })
        .send({ data: user });
    })
    .catch(() => {
      throw new UnauthorizedError("Неправильные почта или пароль");
    })
    .catch(next);
};

// получение информации о текущем пользователе

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new Error("NotValidId"))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.message === "NotValidId") {
        next(new NotFoundError("Запрашиваемый пользователь не найден"));
      } else {
        next(err);
      }
    });
};

// обновление профайла
module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  if (!name || !email) {
    throw new BadRequestError(
      "Переданы некорректные данные, проверьте правильность заполнения полей"
    );
  }
  return User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail(new Error("NotValidId"))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Переданы некорректные данные"));
      } else if (err.name === "MongoError" && err.code === 11000) {
        next(new ConflictError("Такой пользователь уже существует"));
      } else {
        next(err);
      }
    });
};

// выход из профиля
module.exports.logout = (req, res) => {
  res
    .clearCookie("jwt", {
      /*     httpOnly: true,
      sameSite: true, */
    })
    .send({ message: "Вы успешно вышли из профиля" });
};
