import { NextFunction, Request, Response } from 'express';
import * as path from 'path';
import wtlogger from '../custom/helpers/log/logger';
import TodoItem from '../models/todoItemModel';
import SeedTodosData from '../models/seedTodosData';
import * as mongoose from 'mongoose';
import Exception from '../custom/exceptions/Exception';
import logger from '../custom/helpers/log/logger';

class TodosController {
  public initTodosData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const docs = await TodoItem.create(SeedTodosData.data);

      wtlogger.info(`${path.basename(__filename)}| Data: ${docs}`);
      console.log(docs);

      res.status(200).send('Init data successfully!');

    } catch (e) {
      wtlogger.error(`Failed to init data`);
      return next(e);
    }
  };

  public getAllTodos = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const docs = await TodoItem.find();

      wtlogger.info(`${path.basename(__filename)}| Data: ${docs}`);
      console.log(docs);

      const responseJSON = { data: docs };
      return res.status(200).send(responseJSON);

    } catch (e) {
      wtlogger.error(`${path.basename(__filename)}| Failed to get data: ${e}`);
      return next(e);
    }
  };

  public getTodoById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new Exception('Bad request', 400));
    }

    try {
      const docs = await TodoItem.findById(id);

      wtlogger.info(`${path.basename(__filename)}| Data: ${docs}`);
      console.log(docs);

      if (docs === null) {
        return next(new Exception('Not found', 404));
      }

      const responseJSON = { data: docs };
      return res.status(200).send(responseJSON);

    } catch (e) {
      wtlogger.error(`${path.basename(__filename)}| Failed to get data: ${e}`);
      return next(e);
    }
  }

  public createNewTodo = async (req: Request, res: Response, next: NextFunction) => {
    const todoItem = req.body;
    if ((typeof todoItem.text !== 'string')
      || (typeof todoItem.isDone !== 'boolean')) {
      return next(new Exception('Bad request', 400));
    }

    try {
      const docs = await TodoItem.create(todoItem);

      wtlogger.info(`${path.basename(__filename)}| Data: ${docs}`);
      console.log(docs);

      return res.status(200).send(`Create a todo sucessfully!`);
    } catch (e) {
      wtlogger.error(`${path.basename(__filename)}| Failed to create a new todo: ${e}`);
      return next(e);
    }
  }

  public updateTodo = async (req: Request, res: Response, next: NextFunction) => {
    const todoItem = req.body;
    if (todoItem.id === undefined
      || !mongoose.Types.ObjectId.isValid(todoItem.id)
      || (typeof todoItem.text !== 'string')
      || (typeof todoItem.isDone !== 'boolean')) {
      return next(new Exception('Bad request', 400));
    }

    try {
      const docs = await TodoItem.updateOne({
        _id: todoItem.id,
      }, {
        text: todoItem.text,
        isDone: todoItem.isDone,
      });

      wtlogger.info(`${path.basename(__filename)}| Data: ${docs}`);
      console.log(docs);

      if (docs.n === 0) {
        return next(new Exception('Not found', 404));
      }

      res.status(200).send('Update this todo item successfully!');
    } catch (error) {
      logger.error(`${path.basename(__filename)}| ${error}`);
      return next(error);
    }
  }

  public deleteTodo = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.body;
    if (id === undefined
      || !mongoose.Types.ObjectId.isValid(id)) {
      return next(new Exception('Bad request', 400));
    }

    try {
      const docs = await TodoItem.deleteOne({ _id: id });

      wtlogger.info(`${path.basename(__filename)}| Data: ${docs}`);
      console.log(docs);

      if (docs.n === 0) {
        return next(new Exception('Not found', 404));
      }

      return res.status(200).send('Delete this todo item successfully!');
    } catch (error) {
      logger.error(`${path.basename(__filename)}| ${error}`);
      return next(error);
    }
  }
}

export default new TodosController();
