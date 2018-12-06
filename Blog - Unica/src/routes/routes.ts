import * as express from 'express';
import { AdminController, BlogController } from '../controllers';

const router = express.Router();

// Route

router.get('/', BlogController.homepage);

router.get('/admin', AdminController.helloAdmin);

router.get('/admin/signup', AdminController.signupUI);

router.post('/admin/signup', AdminController.signup);

router.get('/admin/signin', AdminController.signinUI);

router.post('/admin/signin', AdminController.signin);

router.get('/blog', BlogController.helloBlog);

export default router;
