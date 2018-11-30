import * as express from 'express';
import HelloController from '../controllers/hello.controller';

const router = express.Router();

// Route

router.get('/', HelloController.helloWorld);

export default router;
