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
  'env-path'?: string;
}

export interface Commands {
  [name: string]: (context: CLIArgs) => Promise<number>
}

export interface CLIRunnerOptions<T extends Commands> {
  getArgs: () => CLIArgs,
  loadEnv?: (context: CLIArgs) => Promise<void>;
  commands: T
}

/**
 * Generates the env path, given the CLI args
 *
 * 1. Defaults to context['env-path'] (i.e., yarn cli [command] --env-path your-path)
 * 2. Uses the CWD + the stage to generate a filepath
 *
 * @param context
 */
export const getEnvFilePath = (context: CLIArgs): string => {
  const envPath = context['env-path'];

  if (envPath) {
    return path.resolve(envPath);
  }

  const envFileName = context.stage && context.stage !== 'dev' ? `.env.${context.stage}` : '.env';

  return path.resolve(process.cwd(), envFileName);
};

/**
 * Loads the environment variables
 *
 * @param context
 */
export const loadEnv = (context: CLIArgs): void => {
  const envFilePath = getEnvFilePath(context);

  consola.info(`Using env file: '${envFilePath}'`);

  config({ path: envFilePath });
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
    (options.loadEnv || loadEnv)(context);

    await executor(context);
  } catch (error) {
    consola.error(error);
    process.exit(1);
  }
};
