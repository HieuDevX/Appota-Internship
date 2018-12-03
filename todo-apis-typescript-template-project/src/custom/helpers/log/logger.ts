import { format, createLogger, transports } from 'winston';

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.colorize(),
    format.printf((info) => `${info.level}: ${info.message}`),
  ),
  transports: [
    new transports.File({ filename: './src/custom/helpers/log/development-error.log', level: 'error' }),
    new transports.File({ filename: './src/custom/helpers/log/development-info.log', level: 'info' }),
    new transports.File({ filename: './src/custom/helpers/log/development-warn.log', level: 'warn' }),
    new transports.Console(),
  ],
});

export default logger;
