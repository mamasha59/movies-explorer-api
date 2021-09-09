/* eslint-disable linebreak-style */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const limiter = require('./utils/rateLimit'); // ---импорт лимита айпи
const { requestLogger, errorLogger } = require('./middlewares/logger'); // --собирает лог ошибок
const router = require('./routes/index'); // --импорт роутов

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/moviesdb', {
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
app.use(limiter); // ---защита от ддос - ограничение айпи

app.get('/crash-test', () => { // --краш тест
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(router); // --подключаем роуты отдельным файлом

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
