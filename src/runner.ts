import path from 'path';

import consola from 'consola';
import { config } from 'dotenv';

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
  [name: string]: (context: CLIArgs) => Promise<number>
}

export interface CLIRunnerOptions<T extends Commands> {
  getArgs: () => CLIArgs,
  loadEnv?: (stage: string) => Promise<void>;
  commands: T
}

/**
 * Loads the environment variables
 *
 * @param {string} stage
 */
export const loadEnv = (stage = ''): void => {
  const envFileName = stage && stage !== 'dev' ? `../.env.${stage}` : '../.env';
  const envFile = path.resolve(__dirname, envFileName);
  consola.info(`Using env file: '${envFile}'`);

  config({ path: envFile });
};

/**
 * Runs as a main function
 *
 * @param options
 */
export const runner = async <T extends Commands>(options: CLIRunnerOptions<T>): Promise<void> => {
  try {
    const context = options.getArgs();

    const [command] = context._;
    const executor = options.commands[command as keyof T];

    if (!executor) {
      throw new Error(`'${command}' is not a valid command.`);
    }

    consola.info(`Running: ${command}`);

    // Default to using `loadEnv`
    (options.loadEnv || loadEnv)(context.stage || '');

    await executor(context);
  } catch (error) {
    consola.error(error);
    process.exit(1);
  }
};
