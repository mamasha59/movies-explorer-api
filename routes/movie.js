/* eslint-disable linebreak-style */
const router = require('express').Router();
const { getCards, createCard, deleteCard } = require('../controllers/movie');

const { postMoviesValidation, deleteMoviesIdValidation } = require('../middlewares/validationCelebrate');

router.get('/movies', getCards); // --возвращает все сохранённые пользователем фильмы

router.post('/movies', postMoviesValidation, createCard); // --создаёт фильм с переданными в теле данными

router.delete('/movies/movieId', deleteMoviesIdValidation, deleteCard); // --удаляет сохранённый фильм по id

module.exports = router;
