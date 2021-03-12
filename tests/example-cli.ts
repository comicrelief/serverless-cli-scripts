/* eslint-disable no-console */
import { addDeployArgs, deploy } from '../src/commands/deploy';
import { runner } from '../src/runner';
import { spawn } from '../src/utils';

const echo = (context: unknown) => {
  console.log(context);
  return Promise.resolve(0);
};

const test = () => spawn('yarn', ['test:unit']);

const getArgs = () => addDeployArgs().help().argv;

const commands = {
  deploy,
  test,
  echo,
};

runner({ getArgs, commands });
