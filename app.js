const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const userRoute = require('./routes/users');
const cardRoute = require('./routes/cards');
const { getUnfindError } = require('./errors/errors');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());

app.use((req, res, next) => {
  req.user = {
    _id: '647a43664bf956a34f7ea6fd',
  };
  next();
});

app.use(userRoute);
app.use(cardRoute);
app.use('*', (req, res) => {
  getUnfindError(res, 'Указанный путь не существует.');
});

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.listen(PORT, () => console.log('Сервер запущен'));
