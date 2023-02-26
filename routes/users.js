const router = require('express').Router();

const { getUserInfo, updateUserInfo } = require('../controllers/users');

const { getCurrentUserValidator, updateUserValidator } = require('../middlewares/validation');

router.get('/users/me', getCurrentUserValidator, getUserInfo);
router.patch('/users/me', updateUserValidator, updateUserInfo);

module.exports = router;
