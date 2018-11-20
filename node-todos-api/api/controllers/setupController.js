import path from 'path';
import { initData } from '../models/todoItemModel';
import logger from '../../log/logger';

const initTodoData = async (req, res) => {
  try {
    const todosData = await initData();
    logger.info(`${path.basename(__filename)}| ${todosData}`);
    return res.send('Init data successfullly');
  } catch (error) {
    logger.error(`${path.basename(__filename)}| ${error}`);
    return res.status(500).send('Failed to init data!');
  }
};

export default initTodoData;
