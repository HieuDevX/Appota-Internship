import { NextFunction, Request, Response } from 'express';

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
      res.render('index');
    } catch (error) {
      next(error);
    }
  }
}

export default new BlogController();
