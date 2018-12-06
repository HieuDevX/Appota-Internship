import * as mongoose from 'mongoose';

const { Schema } = mongoose;

const todoSchema = new Schema({
  text: String,
  isDone: Boolean,
});

const TodoItem = mongoose.model('Todos', todoSchema);

export default TodoItem;
