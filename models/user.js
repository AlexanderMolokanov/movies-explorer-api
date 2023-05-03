const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { WRONG_EMAIL,
  WRONG_EMAIL_OR_PASSWORD, } = require('../utils/constants');
const AuthErr = require('../errors/AuthErr');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: WRONG_EMAIL,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
   email, password 
) {
  return this.findOne({ email }).select('+password').then((user) => {
    if (!user) {
      throw new AuthErr(WRONG_EMAIL_OR_PASSWORD);
    }

    return bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        throw new AuthErr(WRONG_EMAIL_OR_PASSWORD);
      }
      return user;
    });
  });
};

module.exports = mongoose.model('user', userSchema);
