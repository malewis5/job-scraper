import Logger from '@ptkdev/logger';

const options = {
  colors: true,
  debug: true,
  info: true,
  warning: true,
  error: true,
  sponsor: true,
  write: true,
  type: 'log',
  rotate: {
    size: '10M',
    encoding: 'utf8',
  },
  path: {
    debug_log: './debug.log',
    error_log: './errors.log',
  },
};

//@ts-ignore
export const logger = new Logger(options);
