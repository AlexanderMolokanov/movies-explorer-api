const router = require('express').Router();
const { URL_NOT_FOUND } = require('../utils/constants');
const auth = require('../middlewares/auth');

// const NotFoundErr = require('../errors/NotFoundErr');

const {logout} = require('../controllers/users');

router.use(require('./auth'));

router.use(auth);

router.use(require('./users'));
router.use(require('./movies'));

router.post('/signout', logout);

router.use('*', (req, res, next) => {
  next(new NotFoundErr(URL_NOT_FOUND));
});

module.exports = router;
