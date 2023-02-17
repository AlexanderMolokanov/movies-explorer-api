const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const NotFoundErr = require('./errors/NotFoundErr');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// const { PORT = 3001, MONGO_ADDRESS = 'mongodb://localhost:27017/moviesdb' } = process.env;
const { PORT = 3000, NODE_ENV, MONGODB_ADDRESS } = process.env;

const app = express();

app.use('*', cors({
  origin: [
    'localhost:3000',
    'http://localhost:3000',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'Origin', 'Referer', 'Accept', 'Authorization'],
  credentials: true,
}));

app.use(cookieParser());

// app.listen(PORT);
app.use(express.json());

mongoose.set("strictQuery", false);
// mongoose.connect(`${MONGO_ADDRESS}`, {
  //   useNewUrlParser: true,
  // });

  async function main() {
    await mongoose.connect(NODE_ENV === 'production' ? MONGODB_ADDRESS : 'mongodb://localhost:27017/moviesdb', {
      useNewUrlParser: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
      useUnifiedTopology: true,
    });
    app.listen(PORT, (err) => {
      if (!err) {
        console.log(`порт слушает ${PORT}!`);
      }
    });
  }

  main();

  app.use(requestLogger);

app.use(require('./routes/index'));

app.use((req, res, next) => {
  next(new NotFoundErr('Такой страницы не существует'));
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  res
    .status(err.statusCode || 500)
    .send({ message: err.message });
  next();
});
