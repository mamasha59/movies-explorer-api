const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const userRoutes = require("./users");
const movieRoutes = require("./movies");
const NotFoundError = require("../errors/not-found-err"); // 404
const auth = require("../middlewares/auth");
const { createUser, login, logout } = require("../controllers/users");

// роуты регистрации и авторизации
router.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().min(8).required(),
    }),
  }),
  createUser
);

router.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().min(8).required(),
    }),
  }),
  login
);

router.post("/signout", logout);
router.use(auth);
router.use("/users", userRoutes);
router.use("/movies", movieRoutes);

router.use("*", () => {
  throw new NotFoundError("Запрашиваемый ресурс не найден");
});

module.exports = router;
