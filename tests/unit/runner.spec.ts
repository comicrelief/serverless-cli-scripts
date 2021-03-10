import { CLIArgs, getEnvFilePath } from '../../src/runner';

const getContext = (overrides: Record<string, unknown> = {}): CLIArgs => ({
  _: ['test'],
  $0: 'runner.spec.ts',
  ...overrides,
});

describe('unit.runner', () => {
  describe('getEnvFilePath', () => {
    it('resolves the supplied --env-path=.env', () => {
      const context = getContext({ 'env-path': '.env' });
      const actual = getEnvFilePath(context);
      expect(actual).toMatch(/^.+\/.env$/);
    });

    it('resolves the supplied --env-path=./.env', () => {
      const context = getContext({ 'env-path': './.env' });
      const actual = getEnvFilePath(context);
      expect(actual).toMatch(/^.+\/.env$/);
    });

    it('resolves the supplied --env-path=path/.env', () => {
      const context = getContext({ 'env-path': 'path/.env' });
      const actual = getEnvFilePath(context);
      expect(actual).toMatch(/^.+\/path\/.env$/);
    });

    it('resolves the supplied --env-path=./path/.env', () => {
      const context = getContext({ 'env-path': './path/.env' });
      const actual = getEnvFilePath(context);
      expect(actual).toMatch(/^.+\/path\/.env$/);
    });

    it('returns the supplied --env-path=/etc/path/to/env as is', () => {
      const envPath = '/etc/path/to/env';
      const context = getContext({ 'env-path': envPath });
      const actual = getEnvFilePath(context);
      expect(actual).toEqual(envPath);
    });
  });
});
