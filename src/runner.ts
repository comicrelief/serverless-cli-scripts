/* eslint-disable import/no-extraneous-dependencies */
import consola from 'consola';

import { deploy } from './commands/deploy';

export const commands = {
  deploy,
};

export interface CLIArgs {
  [x: string]: unknown;
  _: (string | number)[];
  $0: string;
  stage?: string;
}

export interface Commands {
  [name: string]: (context: CLIArgs) => Promise<void>
}

export interface CLIRunnerOptions<T extends Commands> {
  getArgs: () => CLIArgs,
  loadEnv: (stage: string) => Promise<void>;
  commands: T
}

/**
 * Runs as a main function
 *
 * @param options
 */
export const runner = async <T extends Commands>(options: CLIRunnerOptions<T>): Promise<void> => {
  const context = options.getArgs();

  const [command] = context._;
  const executor = options.commands[command as keyof T];

  if (!executor) {
    throw new Error(`'${command}' is not a valid command.`);
  }

  consola.info(`Running: ${command}`);

  options.loadEnv(context.stage || '');

  await executor(context);
};
