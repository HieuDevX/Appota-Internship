import mongoose from 'mongoose';
import path from 'path';
import logger from '../../log/logger';
import initialData from './initialData';

const { Schema } = mongoose;

mongoose.Promise = Promise;

const todoSchema = new Schema({
  text: String,
  isDone: Boolean,
});

// Todos is a name of collection on database
const TodoItem = mongoose.model('Todos', todoSchema);

const getAllTodoItems = () => TodoItem
  .find()
  .exec()
  .then((doc) => {
    logger.info(`${path.basename(__filename)}| ${doc}`);
    return doc;
  })
  .catch((error) => {
    logger.error(`${path.basename(__filename)}| ${error}`);
    return new Error(error);
  });

const getTodoItemById = id => TodoItem
  .findById(id)
  .exec()
  .then((doc) => {
    logger.info(`${path.basename(__filename)}| ID: ${id}`);
    logger.info(`${path.basename(__filename)}| ${doc}`);
    return doc;
  })
  .catch((error) => {
    logger.error(`${path.basename(__filename)}| ${error}`);
    return new Error(error);
  });

const createNewTodoItem = todoItem => TodoItem
  .create(todoItem)
  .then((doc) => {
    logger.info(`${path.basename(__filename)}| ${doc}`);
    return doc;
  })
  .catch((error) => {
    logger.error(`${path.basename(__filename)}| ${error}`);
    return new Error(error);
  });

const updateTodoItem = todoItem => TodoItem
  .update({
    _id: todoItem.id,
  }, {
    text: todoItem.text,
    isDone: todoItem.isDone,
  })
  .exec()
  .then((doc) => {
    logger.info(`${path.basename(__filename)}| ${doc}`);
    return doc;
  })
  .catch((error) => {
    logger.error(`${path.basename(__filename)}| ${error}`);
    return new Error(error);
  });

const deleteTodoItem = id => TodoItem
  .remove({
    _id: id,
  })
  .exec()
  .then((doc) => {
    logger.info(`${path.basename(__filename)}| ${doc}`);
    return doc;
  })
  .catch((error) => {
    logger.error(`${path.basename(__filename)}| ${error}`);
    return new Error(error);
  });

const initData = () => TodoItem
  .create(initialData.data)
  .then((doc) => {
    logger.info(`${path.basename(__filename)}| ${doc}`);
    return doc;
  })
  .catch((error) => {
    logger.error(`${path.basename(__filename)}| ${error}`);
    return new Error(error);
  });

export {
  getAllTodoItems,
  getTodoItemById,
  createNewTodoItem,
  updateTodoItem,
  deleteTodoItem,
  initData,
};
