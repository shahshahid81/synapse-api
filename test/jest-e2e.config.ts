import type { Config } from 'jest';

export default async (): Promise<Config> => {
  return {
    resetMocks: true,
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.',
    testRegex: '.e2e-spec.ts$',
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    testEnvironment: 'node',
    moduleNameMapper: {
      'src/(.*)': '<rootDir>/../src/$1',
    },
  };
};
