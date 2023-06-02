const ERROR_INCORRECT = 400;
const ERROR_UNFIND = 404;
const ERROR_DEFAULT = 500;

const getDefaultError = (res) => {
  res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка.' });
};

const getUnfindError = (res, mess) => {
  res.status(ERROR_UNFIND).send({ message: `${mess}` });
};

const getIncorrectError = (res, mess) => {
  res.status(ERROR_INCORRECT).send({ message: `Переданы некорректные данные ${mess}.` });
};

const getError = (err, res, mess, unMess) => {
  if ((err.name === 'ValidationError') || (err.name === 'CastError')) {
    getIncorrectError(res, mess);
  } else if (err.name === 'NotFound') {
    getUnfindError(res, unMess);
  } else {
    getDefaultError(res);
  }
};

module.exports = { getDefaultError, getError };
