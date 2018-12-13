import { NextFunction, Request, Response } from 'express';
import logger from '../custom_modules/helpers/log/logger';

class ChatController {
  public chatUI = async (req: Request, res: Response, next: NextFunction) => {
    // if (req.session.user) {
    // } else {
    //   res.redirect('/admin/signin');
    // }
    res.render('chat');
  }
}

export default new ChatController();
