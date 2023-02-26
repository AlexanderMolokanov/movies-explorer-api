require('dotenv').config();
const express = require('express');

const app = express();
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
// const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/error-handler');
const { limiter, devDatabaseUrl } = require('./utils/config');
const { requestLogger, errorLogger } = require('./middlewares/logger');

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

app.use(bodyParser.json());
app.use(helmet());
app.use(cookieParser());
app.use(errorLogger);
app.use(requestLogger);
app.use(limiter);
app.use(express.json());

mongoose.set("strictQuery", false);

async function main() {
  await mongoose.connect(NODE_ENV === 'production' ? MONGODB_ADDRESS : devDatabaseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  app.listen(PORT, (err) => {
    if (!err) {
      console.log(`порт слушает ${PORT}!`);
    }
  });
}

main();

app.use(require('./routes/index'));
app.use(errors()); // обработчик ошибок celebrate
app.use(errorHandler); // мидлвара централизованного обработчика ошибок


// файл .env , пример:
// NODE_ENV = production
// JWT_SECRET = 'a4768f7eb2a93f64b0dcbc8998e135d1b14bf747b52ba2a7aaf11a2fe34cb2b0'
// MONGO_ADDRESS = 'mongodb://localhost:27017/bitfilmsdb'
