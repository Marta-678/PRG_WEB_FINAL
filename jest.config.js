export default {
  testEnvironment: 'node',
  transform: {},
  testMatch: ['**/tests/**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testTimeout: 30000,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
    '!src/socket/socket.js',
    '!src/config/swagger.js',
  ],
  coverageThreshold: {
    global: {
      statements: 50,
      branches: 30,
      functions: 40,
      lines: 50,
    },
  },
  verbose: true,
};