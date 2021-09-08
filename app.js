/* eslint-disable linebreak-style */
require('dotenv').config();
const express = require('express');

const mongoose = require('mongoose');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');

const { validationSignin, validationSignUp } = require('./middlewares/validationCelebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/movie');
const { requestLogger, errorLogger } = require('./middlewares/logger'); // --собирает лог ошибок
const { createUser, login } = require('./controllers/users');
const NotFoundError = require('./errors/not-found-err');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

const limiter = rateLimit({ // ---защита от ddos атак
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
// eslint-disable-next-line no-console
}).then(() => console.log('Connected to DS'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') {
    res.send(200);
  }
  next();
});

app.use(express.json()); // для собирания JSON-формата
app.use(requestLogger);
app.use(limiter);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', validationSignin, login); // --роутер авторизации с валидацией

app.post('/signup', validationSignUp, createUser);// --роутер регистариции с валидацией

app.use(auth); // --ниже порты защищены авторизацией
app.use('/', usersRouter);
app.use('/', cardsRouter);

app.use('/*', () => { // --- если перейти по несуществующему порту
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use(errorLogger);
app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => { //  если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? `На сервере произошла ошибка${err}`
        : message,
    });
});

app.listen(PORT, () => (
  // eslint-disable-next-line no-console
  console.log(PORT)
));
