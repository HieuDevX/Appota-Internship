import { NextFunction, Request, Response } from 'express';
import logger from '../custom_modules/helpers/log/logger';
import { IUser, User } from '../models/user';
import * as expressValidator from 'express-validator';

import {
  hashPassword,
  comparePassword,
} from '../custom_modules/helpers/bcrypt/bcrypt';

class UserController {
  public default = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.send('respond with a resource');
    } catch (error) {
      return next(error);
    }
  };

  public resgisterUI = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.render('register', { title: 'Register' });
    } catch (error) {
      return next(error);
    }
  };

  public loginUI = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.render('login', { title: 'Login' });
    } catch (error) {
      return next(error);
    }
  };

  public register = async (req: Request, res: Response, next: NextFunction) => {
    const form = req.body;
    logger.info(`Request body:`);
    console.log(form);

    let profileImage;
    if (req.file) {
      console.log('Uploading File...');
      profileImage = req.file.filename;
    } else {
      console.log('No File Uploaded...');
      profileImage = 'noimage.jpg';
    }

    (req as expressValidator.RequestValidation).checkBody('name', 'Name field is required').notEmpty();
    (req as expressValidator.RequestValidation).checkBody('email', 'Email field is required').notEmpty();
    (req as expressValidator.RequestValidation).checkBody('email', 'Email is not valid').isEmail();
    (req as expressValidator.RequestValidation).checkBody('username', 'Username field is required').notEmpty();
    (req as expressValidator.RequestValidation).checkBody('password', 'Password field is required').notEmpty();
    (req as expressValidator.RequestValidation)
      .checkBody('password2', 'Password do not match').equals(req.body.password);

    const errors = req.validationErrors();

    if (errors) {
      res.render('register', { errors });
      return;
    }

    try {
      const passwordHashed = await hashPassword(form.password);
      // Insert to DB
      const user: IUser = {
        name: form.name,
        email: form.email,
        username: form.username,
        password: passwordHashed,
        profileImage,
      };

      logger.info('User info');
      console.log(user);
      const result = await User.create(user);
      logger.info(`Result:`);
      console.log(result);

      req.flash('success', 'You are now registered and can login');

      res.location('/');
      res.redirect('/');
    } catch (error) {
      logger.error(`Error:`);
      console.log(error);

      res.render('register', { errors: 'Failed to insert user' });
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.flash('success', 'You are now logged in');
      res.redirect('/');
    } catch (e) {
      next(e);
    }
  };

  public logout = async (req: Request, res: Response, next: NextFunction) => {
    req.logout();
    req.flash('success', 'You are now logged out');
    res.redirect('/users/login');
  }
}

export default new UserController();
