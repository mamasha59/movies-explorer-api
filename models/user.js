/* eslint-disable linebreak-style */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { BAD_DATA_EMAIL_PASSWORD } = require('../utils/errorsText');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
    },

  },
  password: {
    type: String,
    select: false,
    required: true,
    minlength: 5,
  },

});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error(BAD_DATA_EMAIL_PASSWORD));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error(BAD_DATA_EMAIL_PASSWORD));
          }

          return user; // теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);
