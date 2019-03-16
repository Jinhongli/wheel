const chalk = require('chalk');

export const log = (...args) => {
  const d = new Date();
  const logTime = d.toLocaleTimeString() + `:${d.getMilliseconds()}`;
  console.log(chalk.green(`[${logTime}]:`), ...args);
};

export const error = (...args) => {
  const d = new Date();
  const logTime = d.toLocaleTimeString() + `:${d.getMilliseconds()}`;
  console.log(`[${logTime}]:`, ...args);
};
