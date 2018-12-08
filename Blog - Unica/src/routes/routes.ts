import * as express from 'express';
import { AdminController, BlogController } from '../controllers';

const router = express.Router();

// Route

router.get('/', BlogController.homepage);

router.get('/admin', AdminController.helloAdmin);

// router.get('/admin/signup', AdminController.signupUI);
// router.post('/admin/signup', AdminController.signup);
router.route('/admin/signup')
  .get(AdminController.signupUI)
  .post(AdminController.signup);

// router.get('/admin/signin', AdminController.signinUI);
// router.post('/admin/signin', AdminController.signin);
router.route('/admin/signin')
  .get(AdminController.signinUI)
  .post(AdminController.signin);

// router.get('/admin/post/new', AdminController.addNewPostUI);
// router.route('/admin/post/new', AdminController.addNewPost);
router.route('/admin/posts/new')
  .get(AdminController.addNewPostUI)
  .post(AdminController.addNewPost);

router.route('/admin/posts/edit/:id')
  .get(AdminController.editPostUI);
router.route('/admin/posts/edit')
  .put(AdminController.editPost);

router.get('/blog', BlogController.helloBlog);

export default router;
