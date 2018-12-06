import { NextFunction, Request, Response } from 'express';
import logger from '../custom_modules/helpers/log/logger';
import { addUser, getUserByEmail } from '../models/user';
import { hashPassword, comparePassword } from '../custom_modules/helpers/bcrypt/hash';

class AdminController {
  public helloAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({
        msg: 'Hello friends! Cô Tịch aka Méo béo đây',
      });
    } catch (error) {
      return next(error);
    }
  }

  public signupUI = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.render('signup', { data: {} });
    } catch (error) {
      return next(error);
    }
  }

  public signinUI =  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.render('signin', { data: {} });
    } catch (error) {
      return next(error);
    }
  }

  public signup = async (req: Request, res: Response, next: NextFunction) => {
    const form = req.body;
    logger.info(`Request body:`);
    console.log(form);

    if (typeof form.email !== 'string'
      || form.email.trim().length === 0) {
      res.render('signup', { data: { error: 'Email is required'} });
      return;
    }

    if (typeof form.passwd !== 'string'
      || form.passwd.trim().length === 0) {
      res.render('signup', { data: { error: 'Password is required'} });
      return;
    } else {
      if (typeof form.repasswd !== 'string'
        || form.passwd !== form.repasswd) {
        res.render('signup', { data: { error: 'Password is not match'}});
        return;
      }
    }

    const passwordHashed = await hashPassword(form.passwd);

    // Insert to DB
    const user = {
      email: form.email,
      password: passwordHashed,
      first_name: form.firstname,
      last_name: form.lastname,
    };

    logger.info('User info');
    console.log(user);

    try {
      const result = await addUser(user);
      logger.info(`Result:`);
      console.log(result);
      // res.json({ message: 'Insert user successfully!' });
      res.redirect('/admin/signin');
    } catch (error) {
      logger.error(`Error:`);
      console.log(error);
      if (error.code === 'ER_DUP_ENTRY') {
        res.render('signup', { data: { error: 'This email is existed' }});
      } else {
        res.render('signup', { data: { error: 'Failed to insert user' }});
      }
    }
  }

  public signin = async (req: Request, res: Response, next: NextFunction) => {
    const form = req.body;
    logger.info(`Request body: `);
    console.log(form);

    if (typeof form.email !== 'string'
      || form.email.trim().length === 0) {
      res.render('signin', { data: { error: 'Email is required'} });
      return;
    }

    try {
      const data = await getUserByEmail(form.email);
      logger.info(`Result:`);
      console.log(data);

      const user = data[0];
      const status = await comparePassword(form.password, user.password);

      if (!status) {
        res.render('signin', { data: { error: 'Wrong password' } });
      } else {
        // đẩy thông tin vào session
        req.session.user = user;
        logger.info(`Session:`);
        console.log(req.session.user);
        res.redirect('/admin/');
      }
    } catch (error) {
      logger.error(`Error:`);
      console.log(error);
      res.render('signin', { data: { error: 'User is not exist'} });
    }

  }
}

export default new AdminController();
