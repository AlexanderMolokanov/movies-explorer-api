const router = require('express').Router();

const {  createUser,  login } = require('../controllers/users');
const { loginValidator, createUserValidator } = require('../middlewares/validation');

router.post('/signin', loginValidator, login);

router.post('/signup', createUserValidator, createUser);

module.exports = router;
