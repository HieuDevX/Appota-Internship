import { NextFunction, Request, Response } from 'express';

class HelloController {
  public helloWorld = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({
        err: 0,
        msg: '',
        data: 'Hello',
      });
    } catch (e) {
      return next(e);
    }
  };

  public home = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.render('index');
    } catch (e) {
      return next(e);
    }
  };
}

export default new HelloController();
