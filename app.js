const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const { loginUser, createUser } = require('./controller/users');
const { userValidation, loginValidation } = require('./middlewares/validation');
const userRoute = require('./routes/users');
const cardRoute = require('./routes/cards');
const auth = require('./middlewares/auth');
const UnfindError = require('./errors/UnfindError');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());
app.use(cookieParser());
app.use(rateLimit());

app.use('/signin', loginValidation, loginUser);
app.use('/signup', userValidation, createUser);

app.use(auth);
app.use(userRoute);
app.use(cardRoute);
app.use('*', () => {
  throw new UnfindError('Указанный путь не существует.');
});

app.use(errors());
app.use(((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(err.statusCode)
    .send({
      message: statusCode === 500
        ? 'Ошибка сервера'
        : message,
    });
  next();
}));

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.listen(PORT, () => console.log('Сервер запущен'));
