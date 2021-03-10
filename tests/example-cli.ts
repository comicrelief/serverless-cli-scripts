/* eslint-disable no-console */
import { addDeployArgs, deploy } from '../src/commands/deploy';
import { runner } from '../src/runner';

const echo = (context: unknown) => {
  console.log(context);
  return Promise.resolve(0);
};

const getArgs = () => addDeployArgs().help().argv;

const commands = {
  deploy,
  echo,
};

runner({ getArgs, commands });
