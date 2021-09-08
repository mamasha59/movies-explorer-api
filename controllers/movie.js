const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const BadRequest = require('../errors/bad-request');
const Forbidden = require('../errors/forbidden');

const getCards = (req, res, next) => { // Получить список всех карточек
  Movie.find({})
    .then((cards) => {
      if (!cards) {
        throw new NotFoundError('Запрашиваемый файл не найден');
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
        throw new BadRequest('Данные не прошли валидацию');
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Что-то не так с запросом.'); // ---- ошибка 400
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
        throw new NotFoundError('Карточка не найдена');
      }
      if (card.owner.toString() !== owner) {
        throw new Forbidden('Нельзя удалить чужую карточку - ошибка доступа');
      }
      Movie.findByIdAndRemove(req.params.movieId)
        .then(() => res.status(200).send({ message: 'Карточка удалена' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Id карточки не валидный'));
      }
      next(err);
    });
};

module.exports = {
  getCards, createCard, deleteCard,
};
