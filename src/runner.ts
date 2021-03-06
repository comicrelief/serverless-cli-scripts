import path from 'path';

import consola from 'consola';
import { config } from 'dotenv';
import prompts from 'prompts';

import { deploy } from './commands/deploy';

export const CONFIRM_PRODUCTION = 'confirm-production';

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

export type Executor = (context: CLIArgs) => Promise<number>;

export interface Commands {
  [name: string]: Executor
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
 * Prompts a user to confirm
 * they are targeting production
 */
export const promptProduction = async (): Promise<string> => {
  const { confirm } = await prompts({
    type: 'text',
    name: 'confirm',
    message: `Please type '${CONFIRM_PRODUCTION}' to confirm deploy to production.`,
  });

  return confirm;
};

/**
 * Checks whether the script
 * is targeting production
 *
 * @param context
 */
export const checkProduction = async (context: CLIArgs): Promise<void> => {
  if (
    context.stage === 'production'
    || process.env.DEPLOY_ENV === 'production'
    || process.env.NODE_ENV === 'production'
  ) {
    const confirm = await promptProduction();

    if (confirm !== CONFIRM_PRODUCTION) {
      throw new Error('Bailing out.');
    }

    consola.warn('Targetting production');
  }
};

/**
 * Returns the command executor
 *
 * @param options
 * @param context
 */
export const getExecutor = <T extends Commands>(options: CLIRunnerOptions<T>, context: CLIArgs): Executor => {
  const [command] = context._;
  const executor = options.commands[command as keyof T];

  if (!executor) {
    throw new Error(`'${command}' is not a valid command.`);
  }

  consola.info(`Running: ${command}`);

  return executor;
};

/**
 * Runs as a main function
 *
 * @param options
 */
export const runner = async <T extends Commands>(options: CLIRunnerOptions<T>): Promise<void> => {
  try {
    const context = options.getArgs();

    const executor = getExecutor(options, context);

    await checkProduction(context);

    // Default to using `loadEnv`
    (options.loadEnv || loadEnv)(context);

    process.exitCode = await executor(context);
  } catch (error) {
    consola.error(error);
    process.exitCode = 1;
  }
};
