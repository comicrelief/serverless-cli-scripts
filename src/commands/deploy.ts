import prompts from 'prompts';

import type { CLIContext } from '../types';
import * as utils from '../utils';

export const CONFIRM_DEPLOY_TO_PROD = 'deploy-to-production';

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
export const deploy = async (context: CLIContext): Promise<number> => {
  const stage = context.stage || 'dev';

  if (stage === 'production') {
    const confirm = await confirmDeployToProduction();

    if (confirm !== CONFIRM_DEPLOY_TO_PROD) {
      throw new Error('Bailing out.');
    }
  }

  const command = 'yarn';
  const commandArgs = ['sls', 'deploy', '--stage', stage];

  return utils.spawn(command, commandArgs);
};
