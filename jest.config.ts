module.exports = {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json',
      diagnostics: false,
    },
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  roots: ['<rootDir>/src', '<rootDir>/test'],
  testPathIgnorePatterns: ['/node_modules/', '/lib/'],
  // testMatch: ['**/__tests__/**/*.test.(ts|js)', '**/__tests__/**/*.Test.(ts|js)'],
  testEnvironment: 'node',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '<rootDir>/test/**/*.ts',
    // '!<rootDir>/src/util/postinstallHelper.ts', // exclude this file, because it is only made for postInstall, not tests
  ],
  globalSetup: '<rootDir>/test/globalSetup.ts',
  globalTeardown: '<rootDir>/test/globalTeardown.ts',
  setupFilesAfterEnv: [],
  testTimeout: 15000,
};
