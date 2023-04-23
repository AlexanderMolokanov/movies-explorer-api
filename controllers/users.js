const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { devJwtKey } = require('../utils/config');
const {
  USER_NOT_FOUND,
  WRONG_DATA_PROFILE,
  WRONG_DATA_USER,
  EMAIL_ALREADY_EXISTS,
  WRONG_EMAIL_OR_PASSWORD,
} = require('../utils/constants');
const NotFoundErr = require('../errors/NotFoundErr');
const DataErr = require('../errors/DataErr');
const EmailErr = require('../errors/EmailErr');
const AuthErr = require('../errors/AuthErr');

// GET /users/me - возвращает информацию о текущем пользователе
const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundErr(USER_NOT_FOUND);
    })
    .then((user) => res.status(200).send(user))
    .catch(next);
};

// PATCH /users/me — обновляет профиль
const updateUserInfo = (req, res, next) => {
  const { email, name } = req.body;
  User.findOne({ email })
    .then((response) => {
      if (response) {
        throw new EmailErr(EMAIL_ALREADY_EXISTS);
      }
      User.findByIdAndUpdate(req.user._id, { email, name }, { runValidators: true, new: true })
        .orFail(() => {
          throw new NotFoundErr(USER_NOT_FOUND);
        })
        .then((user) => res.status(200).send(user))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new DataErr(WRONG_DATA_PROFILE));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

// POST /signup — создаёт пользователя
const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new EmailErr(EMAIL_ALREADY_EXISTS);
      }
      return bcrypt.hash(password, 10)
        .then((hash) => User.create({
          name,
          email,
          password: hash,
        }))
        .then((newUser) => {
          res
            .status(200).send({
              _id: newUser._id,
              email: newUser.email,
              name: newUser.name,
            });
        });
    })
    .catch((err) => {
      if (err.statusCode === 400) {
        next(new DataErr(WRONG_DATA_USER));
      } else {
        next(err);
      }
    });
};

// POST /signin аутентификация (вход)
const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : devJwtKey, { expiresIn: '7d' },
        { expiresIn: '7d' },
      );
      return res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
         secure: true,
        sameSite: true,
      }).send({ token });
    })
    .catch(next);
};
//   return User.findOne({ email })
//     .select('+password')
//     .then((user) => {
//       if (!user) {
//         throw new AuthErr(WRONG_EMAIL_OR_PASSWORD);
//       }
//       return bcrypt.compare(password, user.password)
//         .then((matched) => {
//           if (!matched) {
//             throw new AuthErr(WRONG_EMAIL_OR_PASSWORD);
//           }
//           const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : devJwtKey, { expiresIn: '7d' });
//           res.cookie('jwt', token, {
//               maxAge: 3600000 * 24 * 7,
//               httpOnly: true,
//               // secure: true,
//               sameSite: 'none',
//             })
//             .status(200).send({
//               _id: user._id,
//               email: user.email,
//               name: user.name,
//             });
//         })
//         .catch((err) => next(err));
//     });
// };

const logout = (req, res) => {
  res
    .cookie('jwt', 'jwt.token.revoked', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: -1,
    })
    .send({ message: 'Сессия завершена' });
};

module.exports = {
  getUserInfo,
  updateUserInfo,
  createUser,
  login,
  logout,
};
