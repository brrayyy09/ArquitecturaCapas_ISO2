export default {
  moduleFileExtensions: [
    'mjs',
    'js',
  ],
  testMatch: [
    '**/__tests__/**/*.mjs',
  ],
  collectCoverageFrom: [
    '**/app.mjs',
    '**/handlers/**/*.mjs',
  ],
  verbose: true,
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};
