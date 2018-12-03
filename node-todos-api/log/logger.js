import { format, createLogger, transports } from 'winston';
// import path from 'path';
// import moment from 'moment';

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.colorize(),
    format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`),
  ),
  transports: [
    new transports.File({ filename: './log/development-error.log', level: 'error' }),
    new transports.File({ filename: './log/development-info.log', level: 'info' }),
    new transports.File({ filename: './log/development-warn.log', level: 'warn' }),
    new transports.Console(),
  ],
});

export default logger;
