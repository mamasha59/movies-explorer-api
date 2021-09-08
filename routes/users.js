/* eslint-disable linebreak-style */
const router = require('express').Router();
const { getMe, updateUserInfo } = require('../controllers/users');

const { usersMeValidation } = require('../middlewares/validationCelebrate');

router.get('/users/me', getMe); // --возвращает информацию о пользователе (email и имя)

router.patch('/users/me', usersMeValidation, updateUserInfo); // --обновляет информацию о пользователе (email и имя)

module.exports = router;
