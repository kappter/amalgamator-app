module.exports = {
  preset: 'jest-environment-jsdom',
  testMatch: ['**/tests/e2e.test.js'],
  testEnvironment: 'node',
  testTimeout: 30000,
  setupFilesAfterEnv: ['./tests/setup.js']
};
