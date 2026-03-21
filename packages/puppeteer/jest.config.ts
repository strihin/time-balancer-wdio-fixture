import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.spec.ts'],
  moduleNameMapper: {
    '^@config/(.*)$': '<rootDir>/../shared/src/config/$1',
    '^@fixtures/(.*)$': '<rootDir>/../shared/src/fixtures/$1',
    '^@selectors/(.*)$': '<rootDir>/../shared/src/selectors/$1',
    '^@support/(.*)$': '<rootDir>/src/support/$1',
  },
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: '.logs',
      outputName: 'results.xml',
    }],
  ],
  testTimeout: 60000,
  maxWorkers: 1,
};

export default config;
