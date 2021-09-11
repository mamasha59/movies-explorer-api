const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const BadRequest = require('../errors/bad-request');
const Forbidden = require('../errors/forbidden');
const {
  VALIDATION_ERROR,
  CAST_ERROR,
  INVALID_DATA,
  FILE_NOT_FOUND,
  MOVIE_NOT_FOUND,
  CANNOT_DELETE_OTHER_CARD,
  SUCCESS_DELETE,
  NOT_EXIST_ID,
} = require('../utils/errorsText');

const getCards = (req, res, next) => { // Получить список всех карточек
  Movie.find({})
    .then((cards) => {
      if (!cards) {
        throw new NotFoundError(FILE_NOT_FOUND);
      }
      res.status(200).send(cards);
    })
    .catch(next);
};

const createCard = (req, res, next) => { // Создать карточку
  const owner = req.user._id;
  const {
    country, director, duration, year, description,
    image, trailer, thumbnail, movieId, nameRU, nameEN,
  } = req.body; // --достаем из боди необходимю инфу
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  }) // --- создаем каточку по данным из боди
    .then((card) => {
      if (!card) {
        throw new BadRequest(INVALID_DATA);
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === VALIDATION_ERROR) {
        throw new BadRequest(INVALID_DATA); // ---- ошибка 400
      }
      next(err);
    })
    .catch(next);
};

const deleteCard = (req, res, next) => { // Удалить карточку
  const owner = req.user._id;
  Movie.findById(req.params.movieId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(MOVIE_NOT_FOUND);
      }
      if (card.owner.toString() !== owner) {
        throw new Forbidden(CANNOT_DELETE_OTHER_CARD);
      }
      Movie.findByIdAndRemove(req.params.movieId)
        .then(() => res.status(200).send(SUCCESS_DELETE));
    })
    .catch((err) => {
      if (err.name === CAST_ERROR) {
        next(new NotFoundError(NOT_EXIST_ID));
      }
      next(err);
    });
};

module.exports = {
  getCards, createCard, deleteCard,
};
