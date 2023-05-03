const router = require('express').Router();

const { getUserInfo, updateUserInfo } = require('../controllers/users');

const {  updateUserValidator } = require('../middlewares/validation');

router.get('/users/me',  getUserInfo);
router.patch('/users/me', updateUserValidator, updateUserInfo);

module.exports = router;
