import * as mongoose from 'mongoose';
import wtlogger from '../custom/helpers/log/logger';
import seedData from './seedTodosData';

const { Schema } = mongoose;

const todoSchema = new Schema({
  text: String,
  isDone: Boolean,
});

const TodoItem = mongoose.model('Todos', todoSchema);

export default TodoItem;
