const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

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
    throw new Error('URL validation err');
  }
};

module.exports.postMoviesValidation = celebrate({ // --валидация при создании карточки с фильмом
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(30),
    director: Joi.string().required().min(2).max(30),
    duration: Joi.string().required().min(2).max(30),
    year: Joi.string().required().min(2).max(30),
    description: Joi.string().required().min(2).max(30),
    image: Joi.string().required().custom(method),
    trailer: Joi.string().required().custom(method),
    thumbnail: Joi.string().required().custom(method),
    owner: Joi.string().required().min(2).max(30),
    movieId: Joi.string().required().min(2).max(30),
    nameRU: Joi.string().required().min(2).max(30),
    nameEN: Joi.string().required().min(2).max(30),
  }),
});

module.exports.deleteMoviesIdValidation = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex(),
  }),
});
