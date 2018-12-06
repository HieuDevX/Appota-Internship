import mysqlDb from '../custom_modules/common/mysql';
import logger from '../custom_modules/helpers/log/logger';
import { resolve } from 'url';

export const addUser = async (user: IUser) => {
  // tslint:disable:no-shadowed-variable
  return new Promise((resolve, reject) => {
    mysqlDb.query('INSERT INTO users SET ?', user, (error, rows) => {
      if (error) {
        logger.error(`Error: `);
        console.log(error);
        reject(error);
      }
      resolve();
    });
  });
};

export const getUserByEmail = async (email: string) => {
  // tslint:disable:no-shadowed-variable
  return new Promise((resolve, reject) => {
    mysqlDb.query('SELECT * FROM users WHERE ?', { email}, (error, rows) => {
      if (error) {
        logger.error(`Error: `);
        console.log(error);
        reject(error);
      }
      resolve(rows);
    });
  });
};

interface IUser {
  email: string,
  password: string,
  first_name: string,
  last_name: string,
}
