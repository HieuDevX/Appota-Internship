import * as path from 'path';
import * as dotEnvSafe from 'dotenv-safe';

// check process.env and load environment variables
(() => {
  if (
    process.env.NODE_ENV === 'production' ||
    process.env.NODE_ENV === 'debug'
  ) {
    return;
  }
  // declare path of env file
  let envPath = path.join(__dirname, '../.env');

  if (process.env.NODE_ENV === 'test') {
    envPath = path.join(__dirname, '../.env.test');
  }
  // import .env variables from file .env.example by dotEnvSafe package
  dotEnvSafe.load({
    allowEmptyValues: true,
    path: envPath,
    sample: path.join(__dirname, '../.env.example'),
  });
})();

import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import * as http from 'http';
import * as mongoose from 'mongoose';
import * as morgan from 'morgan';
import * as cors from 'cors';
// import * as compress from 'compression';
// import * as helmet from 'helmet';
import {
  MONGODB_URI,
  TIMEZONE,
  SERVER_PORT,
  SERVER_TEST_PORT,
} from './custom/configs/env-configs';
import ExceptionCode from './custom/exceptions/ExceptionCode';
import Exception from './custom/exceptions/Exception';
// import * as _ from 'lodash';
import routes from './routes/routes';
// import bearerToken from './custom/middlewares/bearer.token';
// import { redis } from './caches';
import dev from './custom/helpers/dev';
import wtlogger from './custom/helpers/log/logger';
import * as moment from 'moment-timezone';
import { Logger } from 'mongodb';

moment.tz.setDefault(TIMEZONE);

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
// app.use(helmet());
// app.use(compress());
// app.use(bearerToken());

if (process.env.NODE_ENV !== 'test') {
  try {
    mongoose.connect(
      MONGODB_URI,
      { useNewUrlParser: true },
    );
  } catch (error) {
    wtlogger.error(`Failed to connect mongodb: ${error}`);
  }
}
if (process.env.NODE_ENV === 'debug') {
  mongoose.set('debug', true);

  let logCount = 0;
  Logger.setCurrentLogger((msg, state) => {
    wtlogger.info(`MONGO DB REQUEST ${++logCount}: ${msg}`);
  });
  Logger.setLevel('debug');
  Logger.filter('class', ['Cursor']);
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
}

app.use(morgan('dev'));

app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    // wtlogger.info(`MongoDb ready state: ${mongoose.connection.readyState}`);
    if (mongoose.connection.readyState !== 1) {
      dev('connect mongodb error', 'error');
      wtlogger.error(`failed to connect mongodb`);

      // Reconnect if we can
      await mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
    }

    // Redis handle error
    // if (redis.status !== 'ready') {
    //     dev('redis connect error', 'error');
    //     throw new Error();
    // }
  } catch (error) {
    return next(new Exception('server error', 500));
  }

  next();
});

app.use(routes);

// Hanlde all error thrown from controller or other middlewares
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (error.code) {
    res.json({
      error_code: error.code,
      message: error.message,
    });
  } else {
    res.json({
      error_code: ExceptionCode.SYSTEM_ERROR,
      message: 'server error!',
    });
  }
});

app.use((req: Request, res: Response, next: NextFunction) => {
  res.json({
    error_code: ExceptionCode.REQUEST_NOT_FOUND,
    message: 'request not found!',
  });
});

let port = SERVER_PORT;

if (process.env.NODE_ENV === 'test') {
  port = SERVER_TEST_PORT;
}

server.listen(port);
wtlogger.info(`${path.basename(__filename)}| Server running at: http://localhost:${port}`);
wtlogger.info(`${path.basename(__filename)}| ENV: ${process.env.NODE_ENV}`);

export default server; // for tests
