const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const validator = require("validator");

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require("../controllers/movies");

// /movies

router.get("/", getMovies);

router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required().min(2),
      director: Joi.string().required().min(2),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required().min(2),
      image: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (validator.isURL(value)) {
            return value;
          }
          return helpers.message("Проверьте правильность заполнения данных");
        }),
      trailer: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (validator.isURL(value)) {
            return value;
          }
          return helpers.message("Проверьте правильность заполнения данных");
        }),
      thumbnail: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (validator.isURL(value)) {
            return value;
          }
          return helpers.message("Проверьте правильность заполнения данных");
        }),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required().min(2),
      nameEN: Joi.string().required().min(2),
    }),
  }),
  createMovie,
);

router.delete(
  "/:movieId",
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().length(24).hex(),
    }),
  }),
  deleteMovie,
);

module.exports = router;
