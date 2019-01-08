import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import * as multer from 'multer';

import { HomeController, UserController } from '../controllers';
import { authenticate } from '../custom_modules/helpers/passport/passportLocal';

const router = express.Router();
const upload = multer({ dest: './upload' });

const ensureAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/users/login');
};

router.route('/')
  .get(ensureAuthenticated, HomeController.home);

router.route('/users')
  .get(UserController.default);
router.route('/users/register')
  .get(UserController.resgisterUI)
  .post(upload.single('profileImage'), UserController.register);

router.route('/users/login')
  .get(UserController.loginUI)
  .post(authenticate, UserController.login);

router.route('/users/logout')
  .get(UserController.logout);

// Route

export default router;
