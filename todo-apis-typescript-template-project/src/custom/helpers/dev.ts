import * as debug from 'debug';

type type_log = 'log' | 'error' | 'core_error' | 'job_error' | 'service_error';

const dev = (message, type: type_log = 'log') => {
    const logs = debug('app:' + type);
    logs(message);
};

export default dev;
