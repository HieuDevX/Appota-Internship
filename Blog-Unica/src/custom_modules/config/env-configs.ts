declare var process: any;

export const SERVER_PORT = process.env.SERVER_PORT;
export const MONGODB_URI = process.env.MONGODB_URI;
export const MYSQL_HOST = 'localhost';
export const MYSQL_PORT = 3306;
// export const MYSQL_USER = 'blog';
export const MYSQL_USER = 'root';
export const MYSQL_PASSWORD = '12345678';
export const MYSQL_DATABASE = 'blog';
export const BCRYPT_SALT = 10;
export const SECRET_KEY = 'secretkey';
