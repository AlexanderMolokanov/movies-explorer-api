const router = require('express').Router();

const auth = require('../middlewares/auth');

const NotFoundErr = require('../errors/notFoundErr');

const {logout} = require('../controllers/users');

router.use(require('./auth'));

router.use(auth);

router.use(require('./users'));
router.use(require('./movies'));

router.post('/signout', logout);

router.use('*', (req, res, next) => {
  next(new NotFoundErr('Такой страницы не существует'));
});

module.exports = router;
