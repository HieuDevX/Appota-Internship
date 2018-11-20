import express from 'express';
import {
  findAllTodos,
  findTodoById,
  createNewTodo,
  updateTodo,
  deleteTodo,
} from '../controllers/todoController';

import initTodoData from '../controllers/setupController';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('<h1>Hello Appota</h1>');
});

router.get('/api/initData', initTodoData);

router.get('/api/todos', findAllTodos);

router.get('/api/todo/:id', findTodoById);

router.post('/api/todo', createNewTodo);

router.put('/api/todo', updateTodo);

router.delete('/api/todo', deleteTodo);

export default router;
