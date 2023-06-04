const Card = require('../models/card');
const DefaultError = require('../errors/DefaultError');
const UnfindError = require('../errors/UnfindError');
const ForbiddenError = require('../errors/ForbiddenError');
const IncorrectError = require('../errors/IncorrectError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => {
      next(new DefaultError());
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectError('Переданы некорректные данные при создании карточки.'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const userId = req.user._id;

  Card.findById(req.params._id)
    .orFail(() => {
      throw new UnfindError('Карточка с указанным _id не найдена.');
    })
    .then((card) => {
      if (card.owner.toString() === userId) {
        Card.findByIdAndRemove(req.params._id)
          .then((removeCard) => {
            res.send(removeCard);
          })
          .catch(next);
      } else {
        throw new ForbiddenError('Недостаточно прав');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectError('Переданы некорректные данные при удалении карточки.'));
      } else {
        next(err);
      }
    });
};

const setLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new UnfindError('Карточка с указанным _id не найдена.');
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectError('Переданы некорректные данные при добавлении лайка.'));
      } else {
        next(err);
      }
    });
};

const removeLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params._id, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      throw new UnfindError('Карточка с указанным _id не найдена.');
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectError('Переданы некорректные данные при удалении лайка.'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards, createCard, deleteCard, setLike, removeLike,
};
