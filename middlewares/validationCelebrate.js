const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { BAD_URL } = require('../utils/errorsText');

module.exports.validationSignUp = celebrate({ // ---валидация при регисттрации
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
});

module.exports.validationSignin = celebrate({ // --- валидация при входе
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports.usersMeValidation = celebrate({ // ---обновление инфы валдиция
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const method = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  // eslint-disable-next-line no-else-return
  } else {
    throw new Error(BAD_URL);
  }
};

module.exports.postMoviesValidation = celebrate({ // --валидация при создании карточки с фильмом
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(method),
    trailer: Joi.string().required().custom(method),
    thumbnail: Joi.string().required().custom(method),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

module.exports.deleteMoviesIdValidation = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex(),
  }),
});
