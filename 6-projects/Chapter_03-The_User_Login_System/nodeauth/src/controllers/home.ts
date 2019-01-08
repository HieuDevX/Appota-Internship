import { NextFunction, Request, Response } from 'express';

class HomeController {
  public home = async (req: Request, res: Response, next: NextFunction) => {
    res.render('index', { title: 'Members' });
  }
}

export default new HomeController();
