require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const helmet = require("helmet");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const limiter = require("./middlewares/limiter");
const router = require("./routes/index");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const errorHandler = require("./middlewares/error-handler");

// настраиваем порт
const { PORT = 3001, MONGO_URL = "mongodb://localhost:27017/movies-explorer" } = process.env;

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// мидлвэры
app.use(requestLogger);
app.use(cors({ credentials: true, origin: "http://moviesbyme.nomoredomains.club" }));
app.options("*", cors());
app.use(limiter);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(router); // подключение роутов
app.use(errorLogger);

// обработка ошибок
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
