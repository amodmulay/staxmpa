/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // Force module uuid to resolve with the CJS entry point
    // https://github.com/uuidjs/uuid/issues/451
    "uuid": require.resolve('uuid'),
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json'
      },
    ],
  },
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
};
