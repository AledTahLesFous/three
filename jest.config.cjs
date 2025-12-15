module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.js', '**/*.test.js'],
  testPathIgnorePatterns: ['src/__tests__/simple.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.html',
    '!src/main.js',
    '!src/__tests__/**'
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  }
};

