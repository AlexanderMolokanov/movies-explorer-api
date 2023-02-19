require('dotenv').config();
const express = require('express');

const app = express();
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
// const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');

const NotFoundErr = require('./errors/NotFoundErr');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// const { PORT = 3000, MONGO_ADDRESS = 'mongodb://localhost:27017/moviesdb' } = process.env;
const { PORT = 3000, NODE_ENV, MONGODB_ADDRESS } = process.env;


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

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(bodyParser.json());

app.use(helmet());

app.use(cookieParser());

app.use(limiter);

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
