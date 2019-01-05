import { NextFunction, Request, Response } from 'express';
import logger from '../custom_modules/helpers/log/logger';
import { addUser, getUserByEmail, IUser, getAllUsers } from '../models/user';
import { getAllPosts, IPost, addNewPost, getPostById, updatePost, deletePost } from '../models/post';
import { hashPassword, comparePassword } from '../custom_modules/helpers/bcrypt/hash';

class AdminController {
  public adminDashboard = async (req: Request, res: Response, next: NextFunction) => {
    if (req.session.user) {
      try {
        const posts = await getAllPosts();
        logger.info(`Info:`);
        console.log(posts);

        const data = {
          posts,
          error: false,
        };
        res.render('admin/dashboard', { data });
      } catch (error) {
        logger.error(`Error:`);
        console.log(error);
        res.render('admin/dashboard', { data: { error: 'Failed to get posts data' }});
      }
    } else {
      res.redirect('/admin/signin');
    }
  }

  public adminPosts = async (req: Request, res: Response, next: NextFunction) => {
    if (req.session.user) {
      res.redirect('/admin');
    } else {
      res.redirect('/admin/signin');
    }
  };

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
    const user: IUser = {
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
        // push user info into session
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

  public addNewPostUI = async (req: Request, res: Response, next: NextFunction) => {
    if (req.session.user) {
      res.render('admin/posts/new', {data: {}});
    } else {
      res.redirect('/admin/signin');
    }
  };

  public addNewPost = async (req: Request, res: Response, next: NextFunction) => {
    const form = req.body;
    logger.info(`Request body:`);
    console.log(form);

    if (typeof form.title !== 'string'
    || form.title.trim().length === 0) {
      res.render('admin/posts/new', { data: { error: 'Please enter title'} });
      return;
    }

    if (typeof form.content !== 'string'
    || form.content.trim().length === 0) {
      res.render('admin/posts/new', { data: { error: 'Please enter content'} });
      return;
    }

    if (typeof form.author !== 'string'
    || form.author.trim().length === 0) {
      res.render('admin/posts/new', { data: { error: 'Please enter author'} });
      return;
    }

    const now = new Date();
    form.created_at = now;
    form.updated_at = now;

    const post: IPost = {
      title: form.title,
      content: form.content,
      author: form.author,
      created_at: form.created_at,
      updated_at: form.updated_at,
    };

    logger.info(`Post info:`);
    console.log(post);

    try {
      const result = await addNewPost(post);
      logger.info(`Result:`);
      console.log(result);
      res.redirect('/admin');
    } catch (error) {
      logger.error(`Error:`);
      console.log(error);
      const data = {
        error: 'Failed to add new post',
      };
      res.render('admin/posts/new', { data });
    }
  };

  public editPostUI = async (req: Request, res: Response, next: NextFunction) => {
    if (req.session.user) {
      const form = req.params;
      logger.info(`Request body:`);
      console.log(form);

      if (typeof form.id !== 'string'
        || (form.id as number) <= 0) {
        res.render('admin/posts/edit', { data: { error: 'Post ID is invalid'} });
        return;
      }

      const id = form.id;

      try {
        const result = await getPostById(id);
        logger.info(`Result:`);
        console.log(result);

        if ((result as any).length > 0) {
          const post = result[0];
          const data = {
            post,
            error: false,
          };

          res.render('admin/posts/edit', { data });
        } else {
          res.render('admin/posts/edit', { data: { error: `Failed to get Post which had id = ${id}`}});
        }

      } catch (error) {
        logger.error(`Error:`);
        console.log(error);
        res.render('admin/posts/edit', { data: { error: 'Failed to get Post'}});
      }
    } else {
      res.redirect('/admin/signin');
    }
  }

  public editPost = async (req: Request, res: Response, next: NextFunction) => {
    const form = req.body;
    logger.info(`Request body:`);
    console.log(form);

    if (typeof form.id !== 'string'
    || (form.id as number) <= 0) {
      res.render('admin/posts/edit', { data: { error: 'POST ID is invalid'} });
      return;
    }

    if (typeof form.title !== 'string'
    || form.title.trim().length === 0) {
      res.render('admin/posts/edit', { data: { error: 'Please enter title'} });
      return;
    }

    if (typeof form.content !== 'string'
    || form.content.trim().length === 0) {
      res.render('admin/posts/edit', { data: { error: 'Please enter content'} });
      return;
    }

    if (typeof form.author !== 'string'
    || form.author.trim().length === 0) {
      res.render('admin/posts/edit', { data: { error: 'Please enter author'} });
      return;
    }

    const post: IPost = {
      id: form.id,
      title: form.title,
      content: form.content,
      author: form.author,
    };

    try {
      const result = await updatePost(post);
      logger.info(`Result:`);
      console.log(result);
      res.status(200).send({ data: { result: 'redirect', url: '/admin'}});
      // res.redirect('/admin');
    } catch (error) {
      logger.error(`Error:`);
      console.log(error);
      res.render('admin/posts/edit', { data: { error: 'Failed to update this post'} });
    }
  }

  public deletePost = async (req: Request, res: Response, next: NextFunction) => {
    const form = req.body;
    logger.info(`Request body: `);
    console.log(form);

    if (typeof form.id !== 'string'
    || (form.id as number) <= 0) {
      res.status(500).json({message: 'Post ID is invalid'});
      return;
    }

    const id: number = form.id as number;

    try {
      const result = await deletePost(id);
      logger.info(`Result:`);
      console.log(result);
      res.status(200).json({status_code: 200});
    } catch (error) {
      logger.error(`Error:`);
      console.log(error);
      res.status(500).json({message: 'Failed to delete this post'});
    }
  }

  public getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    if (req.session.user) {
      try {
        const users = await getAllUsers();
        logger.info(`Info:`);
        console.log(users);

        const data = {
          users,
          error: false,
        };
        res.render('admin/users', { data });
      } catch (error) {
        logger.error(`Error:`);
        console.log(error);
        const data = {
          error: 'Failed to get users info',
        };
        res.render('admin/users', { data });
      }
    } else {
      res.redirect('/admin/signin');
    }
  }
}

export default new AdminController();
