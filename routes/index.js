const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./movie');
const { createUser, login } = require('../controllers/users');
const { validationSignin, validationSignUp } = require('../middlewares/validationCelebrate');
const { RESOURCE_NOT_FOUND_ERR } = require('../utils/errorsText');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');

router.post('/signin', validationSignin, login); // --роутер авторизации с валидацией

router.post('/signup', validationSignUp, createUser);// --роутер регистариции с валидацией

router.use(auth); // --ниже порты защищены авторизацией
router.use('/', usersRouter);
router.use('/', cardsRouter);

router.use('*', () => { // --- если перейти по несуществующему порту
  throw new NotFoundError(RESOURCE_NOT_FOUND_ERR);
});

module.exports = router;
