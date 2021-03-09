import * as deploy from '../../../src/commands/deploy';
import * as utils from '../../../src/utils';

describe('unit.commands.deploy', () => {
  afterEach(() => jest.resetAllMocks());

  describe('deploy', () => {
    describe('with stage: production', () => {
      it('fails with any text', () => {
        jest.spyOn(deploy, 'confirmDeployToProduction').mockImplementation(() => Promise.resolve('abc'));
        jest.spyOn(utils, 'spawn').mockImplementation(() => Promise.resolve(0));

        const promise = deploy.deploy({ stage: 'production' });

        expect(promise).rejects.toThrowErrorMatchingSnapshot();
        expect(deploy.confirmDeployToProduction).toHaveBeenCalledTimes(1);
      });

      it(`accepts '${deploy.CONFIRM_DEPLOY_TO_PROD}'`, () => {
        jest.spyOn(deploy, 'confirmDeployToProduction').mockImplementation(() => Promise.resolve(deploy.CONFIRM_DEPLOY_TO_PROD));
        jest.spyOn(utils, 'spawn').mockImplementation(() => Promise.resolve(0));

        const promise = deploy.deploy({ stage: 'production' });

        expect(promise).resolves.toMatchSnapshot();
        expect(deploy.confirmDeployToProduction).toHaveBeenCalledTimes(1);
      });
    });

    ['dev', 'staging'].forEach((stage) => {
      describe(`with stage: ${stage}`, () => {
        it('throws with an exit code > 0', () => {
          jest.spyOn(deploy, 'confirmDeployToProduction').mockImplementation(() => Promise.resolve(deploy.CONFIRM_DEPLOY_TO_PROD));
          // eslint-disable-next-line prefer-promise-reject-errors
          jest.spyOn(utils, 'spawn').mockImplementation(() => Promise.reject(1));

          const promise = deploy.deploy({ stage });

          expect(promise).rejects.toThrowErrorMatchingSnapshot();
          expect(deploy.confirmDeployToProduction).toHaveBeenCalledTimes(0);
        });

        it('returns status code 0', () => {
          jest.spyOn(deploy, 'confirmDeployToProduction').mockImplementation(() => Promise.resolve(deploy.CONFIRM_DEPLOY_TO_PROD));
          // eslint-disable-next-line prefer-promise-reject-errors
          jest.spyOn(utils, 'spawn').mockImplementation(() => Promise.resolve(0));

          const promise = deploy.deploy({ stage });

          expect(promise).resolves.toMatchSnapshot();
          expect(deploy.confirmDeployToProduction).toHaveBeenCalledTimes(0);
        });
      });
    });
  });
});
