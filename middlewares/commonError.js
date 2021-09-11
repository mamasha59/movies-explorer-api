const { ERROR_ON_SERVER } = require('../utils/errorsText');
// eslint-disable-next-line no-unused-vars
module.exports = ((err, req, res, next) => { //  если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500 ? ERROR_ON_SERVER : message,
    });
});
