const router = require('express').Router();

const {  createUser,  login } = require('../controllers/users');
const { loginValidator, createUserValidator } = require('../middlewares/validation');

router.post('/signup', createUserValidator, createUser);
router.post('/signin', loginValidator, login);

module.exports = router; 
