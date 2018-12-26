import * as express from 'express';
import HelloController from '../controllers/hello.controller';
import TodosController from '../controllers/todos.controller';

const router = express.Router();

// Route

router.route('/')
    .post(HelloController.helloWorld)
    .get(HelloController.home);

router.route('/api/initData')
    .post(TodosController.initTodosData);

router.route('/api/todos')
    .get(TodosController.getAllTodos)
    .post(TodosController.createNewTodo)
    .put(TodosController.updateTodo)
    .delete(TodosController.deleteTodo);

router.route('/api/todos/:id')
    .get(TodosController.getTodoById);


// router.post('/', HelloController.helloWorld);

// router.get('/', HelloController.home);

// router.post('/api/initData', TodosController.initTodosData);

// router.get('/api/todos', TodosController.getAllTodos);

// router.get('/api/todos/:id', TodosController.getTodoById);

// router.post('/api/todos', TodosController.createNewTodo);

// router.put('/api/todos', TodosController.updateTodo);

// router.delete('/api/todos', TodosController.deleteTodo);

export default router;
