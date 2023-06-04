const router = require('express').Router();
const {
  idValidation, cardValidation,
} = require('../middlewares/validation');
const {
  getCards, createCard, deleteCard, setLike, removeLike,
} = require('../controller/cards');

router.get('/cards', getCards);

router.post('/cards', cardValidation, createCard);

router.delete('/cards/:_id', idValidation, deleteCard);

router.put('/cards/:_id/likes', idValidation, setLike);

router.delete('/cards/:_id/likes', idValidation, removeLike);

module.exports = router;
