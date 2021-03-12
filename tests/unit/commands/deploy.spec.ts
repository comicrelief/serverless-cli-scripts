import * as deploy from '../../../src/commands/deploy';
import * as utils from '../../../src/utils';

describe('unit.commands.deploy', () => {
  afterEach(() => jest.resetAllMocks());

  describe('deploy', () => {
    ['dev', 'staging', 'production'].forEach((stage) => {
      describe(`with stage: ${stage}`, () => {
        it('throws with an exit code > 0', () => {
          // eslint-disable-next-line prefer-promise-reject-errors
          jest.spyOn(utils, 'spawn').mockImplementation(() => Promise.reject(1));

          const promise = deploy.deploy({ stage });

          expect(promise).rejects.toThrowErrorMatchingSnapshot();
        });

        it('returns status code 0', () => {
          // eslint-disable-next-line prefer-promise-reject-errors
          jest.spyOn(utils, 'spawn').mockImplementation(() => Promise.resolve(0));

          const promise = deploy.deploy({ stage });

          expect(promise).resolves.toMatchSnapshot();
        });
      });
    });
  });
});
