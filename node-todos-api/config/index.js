import configValues from './config';

const getDbConnectionString = () => `mongodb://${configValues.username}:${configValues.password}@ds255797.mlab.com:55797/todosnodejs`;

export default { getDbConnectionString };
