import path from 'path';
import mongoose from 'mongoose';
import {
  getAllTodoItems,
  getTodoItemById,
  createNewTodoItem,
  updateTodoItem,
  deleteTodoItem,
} from '../models/todoItemModel';
import logger from '../../log/logger';

const findAllTodos = async (req, res) => {
  try {
    const todosData = await getAllTodoItems();
    logger.info(`${path.basename(__filename)}| ${JSON.stringify(todosData)}`);
    const responseJSON = { data: todosData };
    return res.send(responseJSON);
  } catch (error) {
    logger.error(`${path.basename(__filename)}| ${error}`);
    return res.status(500).send('Failed to get todo items from server!');
  }
};

const findTodoById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send('ObjectId is not valid');
    }

    const todosData = await getTodoItemById(id);
    logger.info(`${path.basename(__filename)}| ${todosData}`);
    const responseJSON = { data: [todosData] };
    return res.send(responseJSON);
  } catch (error) {
    logger.error(`${path.basename(__filename)}| ${error}`);
    return res.status(500).send('Failed to get todo item from server');
  }
};

const createNewTodo = async (req, res) => {
  const todoItem = req.body;
  if (todoItem.text === undefined || todoItem.isDone === undefined) {
    return res.status(400).send('Request is not valid');
  }
  try {
    const todosData = await createNewTodoItem(todoItem);
    logger.info(`${path.basename(__filename)}| ${todosData}`);
    return res.send('Create a new todo successfully!');
  } catch (error) {
    logger.error(`${path.basename(__filename)}| ${error}`);
    return res.status(500).send('Failed to create a new todo');
  }
};

const updateTodo = async (req, res) => {
  const todoItem = req.body;
  if (todoItem.id === undefined
    || !mongoose.Types.ObjectId.isValid(todoItem.id)
    || todoItem.text === undefined
    || todoItem.isDone === undefined) {
    return res.status(400).send('Request is not valid');
  }

  try {
    const todosData = await updateTodoItem(todoItem);
    logger.info(`${path.basename(__filename)}| ${todosData}`);
    return res.send('Update data successfully!');
  } catch (error) {
    logger.error(`${path.basename(__filename)}| ${error}`);
    return res.status(500).send('Failed to update data');
  }
};

const deleteTodo = async (req, res) => {
  const { id } = req.body;
  if (id === undefined
    || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send('Request is not valid');
  }

  try {
    const todosData = await deleteTodoItem(id);
    logger.info(`${path.basename(__filename)}| ${todosData}`);
    return res.send('Delete todo item successfully');
  } catch (error) {
    logger.error(`${path.basename(__filename)}| ${error}`);
    return res.status(500).send('Failed to delete todo item');
  }
};

export {
  findAllTodos,
  findTodoById,
  createNewTodo,
  updateTodo,
  deleteTodo,
};

// function getTodos(res) {
//   Todos.find((error, results) => {
//     if (error) {
//       res.status(500).json(error);
//     } else {
//       res.json(results);
//     }
//   });
// }

// module.exports = (app) => {
//   // get all todos
//   app.get('/api/todos', (req, res) => {
//     getTodos(res);
//   });

//   // api/todo/id
//   app.get('/api/todo/:id', (req, res) => {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id.toString())) {
//       return res.status(400).send(`ObjectId is not valid: ${id}`);
//     }

//     Todos.findById({ _id: id }, (error, results) => {
//       if (error) {
//         throw error;
//       } else {
//         res.json(results);
//       }
//     });
//   });

//   /**
//    * Create a todo
//    */

//   app.post('/api/todo', (req, res) => {
//     const todo = {
//       text: req.body.text,
//       isDone: req.body.isDone,
//     };

//     Todos.create(todo, (error) => {
//       if (error) {
//         throw error;
//       } else {
//         getTodos(res);
//       }
//     });
//   });

//   /**
//    * Update a todo
//    */

//   app.put('/api/todo', (req, res) => {
//     const { id } = req.body;
//     if (!mongoose.Types.ObjectId.isValid(id.toString())) {
//       return res.status(400).send(`ObjectId is not valid: ${id}`);
//     }
//     Todos.update({
//       _id: id,
//     }, {
//         text: req.body.text,
//         isDone: req.body.isDone,
//       }, (error) => {
//         if (error) {
//           return res.status(500).json(error);
//         }
//         getTodos(res);
//       });
//   });

//   /**
//    * Delete a todo
//    */

//   app.delete('/api/todo/:id', (req, res) => {
//     const { id } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(id.toString())) {
//       return res.status(400).send(`ObjectId is not valid: ${id}`);
//     }
//     Todos.remove({
//       _id: id,
//     }, (error) => {
//       if (error) {
//         return res.status(500).json(error);
//       }
//       getTodos(res);
//     });
//   });
// };
