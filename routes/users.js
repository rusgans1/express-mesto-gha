const router = require('express').Router();
const {
  idValidation, changeAvatarValidation, changeInfoValidation,
} = require('../middlewares/validation');
const {
  getUsers, getUser, changeInfo, changeAvatar, getMe,
} = require('../controller/users');

router.get('/users', getUsers);

router.get('/users/me', getMe);

router.get('/users/:_id', idValidation, getUser);

router.patch('/users/me', changeInfoValidation, changeInfo);

router.patch('/users/me/avatar', changeAvatarValidation, changeAvatar);

module.exports = router;
