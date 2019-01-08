import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import ExceptionCode from './custom_modules/exceptions/ExceptionCode';
import Exception from './custom_modules/exceptions/Exception';
import * as path from 'path';
import * as http from 'http';
import * as favicon from 'serve-favicon';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import * as expressValidator from 'express-validator';
import * as multer from 'multer';
import * as mongoose from 'mongoose';
// tslint:disable-next-line: no-var-requires
const flash = require('connect-flash');

import routes from './routes/routes';
import { SERVER_PORT, SECRET_KEY, MONGODB_URI } from './custom_modules/config/env-configs';
import logger from './custom_modules/helpers/log/logger';

const upload = multer({ dest: './uploads' });

const app = express();
const server = http.createServer(app);

const mongoDbOptions = {
  useNewUrlParser: true,
};

// view engine setup
app.set('views', 'views');
app.set('view engine', 'jade');

app.use('/static', express.static('public'));

if (process.env.NODE_ENV !== 'test') {
  logger.info(`MongoDB options: `);
  console.log(mongoDbOptions);
  mongoose
    .connect(
      MONGODB_URI,
      mongoDbOptions,
    )
    .then(() => {
      logger.info(`MongoDB connected`);
    })
    .catch((error) => {
      logger.error(`Failed to connect mongodb`);
      console.log(error);
      logger.info(`Mongo connection: `);
      console.log(mongoose.connection);
    });
}

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(async (req: Request, res: Response, next: NextFunction) => {
  logger.info(`MongoDB ready state: ${mongoose.connection.readyState}`);
  try {
    if (mongoose.connection.readyState !== 1) {
      logger.error(`failed to connect mongodb`);
      logger.info(`Mongo connection: `);
      console.log(mongoose.connection);

      logger.info(`MongoDB options: `);
      console.log(mongoDbOptions);
      // Reconnect if we can
      await mongoose.connect(
        MONGODB_URI,
        mongoDbOptions,
      );
      logger.info(`MongoDB connected`);
    }
  } catch (error) {
    return next(new Exception('server error', 500));
  }

  next();
});

// Handle Sessions
app.use(
  session({
    secret: SECRET_KEY,
    saveUninitialized: true,
    resave: true,
  }),
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Validator
app.use(
  expressValidator({
    errorFormatter: (param: string, msg: string, value: any) => {
      const namespace = param.split('.');
      const root = namespace.shift();
      let formParam = root;

      while (namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param: formParam,
        msg,
        value,
      };
    },
  }),
);

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());
// app.use((req, res, next) => {
//   res.locals.messages = require("express-messages")(req, res);
//   next();
// });

app.get('*', (req: Request, res: Response, next: NextFunction) => {
  res.locals.user = req.user || null;
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

const port = SERVER_PORT ? SERVER_PORT : 3000;

server.listen(port, () => {
  logger.info(`Server is running at: http://localhost:${port}`);
  logger.info(`ENV: ${process.env.NODE_ENV}`);
});
