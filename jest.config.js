const jestConfig = {
  displayName: {
    name: 'UNIT',
    color: 'blue',
  },
  preset: 'ts-jest',
  moduleNameMapper: {
    '~/(.*)$': '<rootDir>/$1',
  },
  testEnvironment: 'node',
};

if (process.env.JEST_COLLECT_COVERAGE) {
  jestConfig.collectCoverage = true;
  jestConfig.collectCoverageFrom = ['<rootDir>/src/**/*.ts'];
}

module.exports = jestConfig;
