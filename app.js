/* eslint-disable linebreak-style */
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const limiter = require('./utils/rateLimit'); // ---импорт лимита айпи
const { requestLogger, errorLogger } = require('./middlewares/logger'); // --собирает лог ошибок
const router = require('./routes/index'); // --импорт роутов
const { DATA_BASE, PORT } = require('./utils/configEnv');
const ErrorsAll = require('./middlewares/commonError');
const { CRASH_TEST_ERROR } = require('./utils/errorsText');

const app = express();
app.use(helmet());
mongoose.connect(DATA_BASE, {
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
    throw new Error(CRASH_TEST_ERROR);
  }, 0);
});

app.use(router); // --подключаем роуты отдельным файлом

app.use(errorLogger);
app.use(errors());

app.use(ErrorsAll); // ---централизованный обработчик ошибок

app.listen(PORT, () => (
  // eslint-disable-next-line no-console
  console.log(PORT)
));
