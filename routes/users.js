const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");

const { getMe, updateProfile } = require("../controllers/users");

// /users
router.get("/me", getMe);

router.patch(
  "/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
    }),
  }),
  updateProfile,
);

module.exports = router;
