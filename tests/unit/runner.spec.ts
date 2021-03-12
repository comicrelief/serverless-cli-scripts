import consola from 'consola';

import * as runner from '../../src/runner';

const getContext = (overrides: Record<string, unknown> = {}): runner.CLIArgs => ({
  _: ['test'],
  $0: 'runner.spec.ts',
  ...overrides,
});

describe('unit.runner', () => {
  let currentExitCode = process.exitCode;

  beforeAll(() => {
    currentExitCode = process.exitCode;
  });

  afterEach(() => {
    process.exitCode = currentExitCode;
    jest.resetAllMocks();
  });

  describe('getEnvFilePath', () => {
    it('resolves the supplied --env-path=.env', () => {
      const context = getContext({ 'env-path': '.env' });
      const actual = runner.getEnvFilePath(context);
      expect(actual).toMatch(/^.+\/.env$/);
    });

    it('resolves the supplied --env-path=./.env', () => {
      const context = getContext({ 'env-path': './.env' });
      const actual = runner.getEnvFilePath(context);
      expect(actual).toMatch(/^.+\/.env$/);
    });

    it('resolves the supplied --env-path=path/.env', () => {
      const context = getContext({ 'env-path': 'path/.env' });
      const actual = runner.getEnvFilePath(context);
      expect(actual).toMatch(/^.+\/path\/.env$/);
    });

    it('resolves the supplied --env-path=./path/.env', () => {
      const context = getContext({ 'env-path': './path/.env' });
      const actual = runner.getEnvFilePath(context);
      expect(actual).toMatch(/^.+\/path\/.env$/);
    });

    it('returns the supplied --env-path=/etc/path/to/env as is', () => {
      const envPath = '/etc/path/to/env';
      const context = getContext({ 'env-path': envPath });
      const actual = runner.getEnvFilePath(context);
      expect(actual).toEqual(envPath);
    });
  });

  describe('runner', () => {
    const getOptions = (overrides: Record<string, unknown> = {}) => ({
      getArgs: () => ({
        _: ['test'],
        $0: 'jest',
        ...overrides,
      }),
      commands: {
        test: jest.fn(() => Promise.resolve(1)),
      },
    });

    describe('targeting production', () => {
      it('fails with any text', async () => {
        const options = getOptions({ stage: 'production' });
        jest.spyOn(consola, 'info').mockImplementation();
        jest.spyOn(consola, 'warn').mockImplementation();
        jest.spyOn(consola, 'error').mockImplementation();
        jest.spyOn(runner, 'promptProduction').mockImplementation(() => Promise.resolve('nope'));

        await runner.runner(options);

        expect(runner.promptProduction).toHaveBeenCalledTimes(1);
        expect(options.commands.test).toHaveBeenCalledTimes(0);
        expect(consola.warn).toHaveBeenCalledTimes(0);
        expect(consola.error).toHaveBeenCalledTimes(1);
      });

      it(`accepts '${runner.CONFIRM_PRODUCTION}'`, async () => {
        const options = getOptions({ stage: 'production' });
        jest.spyOn(consola, 'info').mockImplementation();
        jest.spyOn(consola, 'warn').mockImplementation();
        jest.spyOn(consola, 'error').mockImplementation();
        jest.spyOn(runner, 'promptProduction').mockImplementation(() => Promise.resolve(runner.CONFIRM_PRODUCTION));

        await runner.runner(options);

        expect(runner.promptProduction).toHaveBeenCalledTimes(1);
        expect(options.commands.test).toHaveBeenCalledTimes(1);
        expect(consola.warn).toHaveBeenCalledTimes(1);
        expect(consola.error).toHaveBeenCalledTimes(0);
      });
    });
  });
});
