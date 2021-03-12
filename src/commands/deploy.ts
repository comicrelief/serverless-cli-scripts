import yargs from 'yargs';

import * as utils from '../utils';

export interface DeployContext {
  stage?: string;
  region?: string;
  flags?: string;
}

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
 * Deploys to the given stage
 *
 * @param context
 */
export const deploy = async (context: DeployContext): Promise<number> => {
  const command = 'yarn';
  const commandArgs = [
    'sls',
    'deploy',
    '--stage',
    context.stage || 'dev',
    '--region',
    context.region || '',
    ...(context.flags?.split(' ') || []),
  ];

  return utils.spawn(command, commandArgs);
};
