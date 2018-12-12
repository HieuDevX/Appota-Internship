import * as dotEnvSafe from 'dotenv-safe';
import * as path from 'path';

// check process.env and load environment variables
(() => {
  // declare path of env file
  const envPath = path.join(__dirname, '../.env');

  // import .env variables from file .env.example by dotEnvSafe package
  dotEnvSafe.load({
    allowEmptyValues: true,
    path: envPath,
    sample: path.join(__dirname, '../.env.example'),
  });
})();

// import after import .env.example
import { MONGODB_URI, SERVER_PORT, SECRET_KEY } from './custom_modules/config/env-configs';
import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import * as session from 'express-session';
import * as http from 'http';
import * as cors from 'cors';
import * as morgan from 'morgan';

import mysqlDb from './custom_modules/common/mysql';
import logger from './custom_modules/helpers/log/logger';
import ExceptionCode from './custom_modules/exceptions/ExceptionCode';
import Exception from './custom_modules/exceptions/Exception';
import router from './routes/routes';

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// session config
app.set('trust proxy', 1);
app.use(session({
  secret:  SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use('/static', express.static(__dirname + '/public'));

if (process.env.NODE_ENV !== 'test') {
  try {
    mysqlDb.connect();
    logger.info(`Mysql connected`);
  } catch (error) {
    logger.error(`Failed to connect mysql: ${error}`);
  }
}

app.use(morgan('dev'));

app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (mysqlDb.state  === 'disconnect' || mysqlDb.state === 'protocol_error') {
      logger.error(`f\Failed to connect mysql`);

      // Reconnect if we can
      mysqlDb.connect();
    }
  } catch (error) {
    return next(new Exception('server error', 500));
  }

  next();
});

app.use(router);

// Hanlde all error thrown from controller or other middlewares
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (error.code) {
    res.json({
      error_code: error.code,
      message: error.message,
    });
  } else {
    // res.json({
    //   error_code: ExceptionCode.SYSTEM_ERROR,
    //   message: 'server error!',
    // });
    res.json({
      error: error.toString(),
    });
  }
});

app.use((req: Request, res: Response, next: NextFunction) => {
  res.json({
    error_code: ExceptionCode.REQUEST_NOT_FOUND,
    message: 'request not found!',
  });
});

const port = SERVER_PORT;

server.listen(port, () => {
  logger.info(`Server is running at: http://localhost:${port}`);
  logger.info(`ENV: ${process.env.NODE_ENV}`);
});

export default server;
