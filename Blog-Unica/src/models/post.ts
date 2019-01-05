import mysqlDb from '../custom_modules/common/mysql';
import logger from '../custom_modules/helpers/log/logger';

export const getAllPosts = async () => {
  // tslint:disable:no-shadowed-variable
  return new Promise((resolve, reject) => {
    mysqlDb.query('SELECT * FROM posts', (error, rows) => {
      if (error) {
        logger.error(`Error: `);
        console.log(error);
        reject(error);
      }
      resolve(rows);
    });
  });
};

export const addNewPost = async (post: IPost) => {
  // tslint:disable:no-shadowed-variable
  return new Promise((resolve, reject) => {
    mysqlDb.query('INSERT INTO posts SET ?', post, (error, rows) => {
      if (error) {
        logger.error(`Error: `);
        console.log(error);
        reject(error);
      }
      resolve();
    });
  });
};

export const getPostById = async (id: number) => {
   // tslint:disable:no-shadowed-variable
   return new Promise((resolve, reject) => {
    mysqlDb.query('SELECT * FROM posts WHERE ?', { id }, (error, rows) => {
      if (error) {
        logger.error(`Error: `);
        console.log(error);
        reject(error);
      }
      resolve(rows);
    });
  });
};

export const updatePost = async (post: IPost) => {
   // tslint:disable:no-shadowed-variable
   return new Promise((resolve, reject) => {
    mysqlDb.query('UPDATE posts SET title = ?, content = ?, author = ?, updated_at = ? WHERE id = ?',
    [post.title, post.content, post.author, new Date(), post.id], (error, rows) => {
      if (error) {
        logger.error(`Error: `);
        console.log(error);
        reject(error);
      }
      resolve(rows);
    });
  });
};

export const deletePost = async (id: number) => {
   // tslint:disable:no-shadowed-variable
  return new Promise((resolve, reject) => {
    mysqlDb.query('DELETE from posts WHERE id = ?', id, (error, rows) => {
      if (error) {
        logger.error(`Error: `);
        console.log(error);
        reject(error);
      }
      resolve(rows);
    });
  });
};

export interface IPost {
  title: string,
  content: string,
  author: string,
  created_at?: string,
  updated_at?: string,
  id?: string,
}
