const chalk = require('chalk');

const getTime = () => {
  const d = new Date();
  const localTime = d.toLocaleTimeString();
  const ms = d.getMilliseconds();
  if (ms < 10) return `${localTime}.00${ms}`;
  if (ms < 100) return `${localTime}.0${ms}`;
  return `${localTime}.${ms}`;
};

export const log = (...args) => {
  console.log(chalk.yellow(`<${getTime()}>:`), '  [LOG] ', ...args);
};

export const error = (...args) => {
  console.log(
    chalk.yellow(`<${getTime()}>:`),
    chalk.red('[ERROR] '),
    ...args.map(arg => chalk.red(arg))
  );
};
