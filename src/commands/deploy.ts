import prompts from 'prompts';
import yargs from 'yargs';

import * as utils from '../utils';

export interface DeployContext {
  stage?: string;
  region?: string;
  flags?: string;
}

export const CONFIRM_DEPLOY_TO_PROD = 'deploy-to-production';

/**
 * Adds the deploy command CLI args to yargs
 */
export const addDeployArgs = (): yargs.Argv<unknown> => yargs.command('deploy <stage> <region> [flags]', 'Deploys to the given environment', (y) => {
  y.positional('stage', {
    describe: 'Target deployment stage',
    choices: ['dev', 'staging', 'production'],
  });
  y.positional('region', {
    describe: 'Target deployment region',
  });
  y.positional('flags', {
    describe: 'Flags to pass down to sls',
  });
});

/**
 * Asks the user to confirm
 * a deploy to production
 */
export const confirmDeployToProduction = async (): Promise<string> => {
  const { confirmProd } = await prompts({
    type: 'text',
    name: 'confirmProd',
    message: `Please type '${CONFIRM_DEPLOY_TO_PROD}' to confirm deploy to production.`,
  });

  return confirmProd;
};

/**
 * Deploys to the given stage
 *
 * @param context
 */
export const deploy = async (context: DeployContext): Promise<number> => {
  const stage = context.stage || 'dev';

  if (stage === 'production') {
    const confirm = await confirmDeployToProduction();

    if (confirm !== CONFIRM_DEPLOY_TO_PROD) {
      throw new Error('Bailing out.');
    }
  }

  const command = 'yarn';
  const commandArgs = [
    'sls',
    'deploy',
    '--stage',
    stage,
    '--region',
    context.region || '',
    ...(context.flags?.split(' ') || []),
  ];

  return utils.spawn(command, commandArgs);
};
