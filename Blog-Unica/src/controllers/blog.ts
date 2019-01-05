import { NextFunction, Request, Response } from 'express';
import { getAllPosts, IPost, getPostById } from '../models/post';
import logger from '../custom_modules/helpers/log/logger';

class BlogController {
  public helloBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({
        msg: 'Hello friends! Xin chào yaosu',
      });
    } catch (error) {
      return next(error);
    }
  }

  public homepage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const posts = await getAllPosts();
      logger.info(`Info:`);
      console.log(posts);

      const data = {
        posts,
        error: false,
      };
      res.render('blog/index', { data });
    } catch (error) {
      logger.error(`Error:`);
      console.log(error);
      res.render('blog/index', { data: { error: 'Failed to get posts data' }});
    }
  }

  public getPostById = async (req: Request, res: Response, next: NextFunction) => {
    const form = req.params;
    logger.info(`Request body:`);
    console.log(form);

    if (typeof form.id !== 'string'
      || (form.id as number) <= 0) {
      res.status(400).json({ data: { error: 'Post ID is invalid'} });

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

        res.render('blog/post', { data });
      } else {
        res.render('blog/post', { data: { error: `Failed to get Post which had id = ${id}`}});
      }

    } catch (error) {
      logger.error(`Error:`);
      console.log(error);
      res.status(500).json({ data: { error: 'Failed to get Post'}});
    }
  }

  public about = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.render('blog/about');
    } catch (error) {
      next(error);
    }
  }
}

export default new BlogController();
