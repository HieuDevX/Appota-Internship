import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import logger from './log/logger';

import router from './api/routes/routes';

import config from './config/index';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use('/assets', express.static(`${__dirname}/public`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));
app.set('view engine', 'ejs');

// db info
// logger.info(`${path.basename(__filename)}| ${config.getDbConnectionString()}`);
mongoose
  .connect(config.getDbConnectionString(), { useNewUrlParser: true })
  .then(() => {
    logger.info(`${path.basename(__filename)}| Connect database successfully!`);
  }).catch((error) => {
    logger.error(`${path.basename(__filename)}| Failed to connect database!
    ${error}`);
  });

app.use('/', router);

app.listen(port, () => {
  logger.info(`${path.basename(__filename)}| App listening on port: ${port}`);
});
