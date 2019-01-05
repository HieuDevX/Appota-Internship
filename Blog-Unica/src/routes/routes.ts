import * as express from 'express';
import { AdminController, BlogController, ChatController } from '../controllers';

const router = express.Router();

// Route

router.route('/admin')
  .get(AdminController.adminDashboard);
router.route('/admin/posts')
  .get(AdminController.adminPosts);

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

router.route('/admin/posts/delete')
  .delete(AdminController.deletePost);

router.route('/admin/users')
  .get(AdminController.getAllUsers);

router.route('/')
  .get(BlogController.helloBlog);

router.route('/blog')
  .get(BlogController.homepage);

router.route('/blog/post/:id')
  .get(BlogController.getPostById);

router.route('/blog/about')
  .get(BlogController.about);

router.route('/chat')
  .get(ChatController.chatUI);

export default router;
