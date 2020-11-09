module.exports = {
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 0,
    },
  },
  coverageDirectory: 'coverage',

  moduleFileExtensions: [
    'js',
    //   "json",
    //   "jsx",
    'ts',
    //   "tsx",
    //   "node"
  ],

  roots: ['src'],
  testEnvironment: 'node',
};
