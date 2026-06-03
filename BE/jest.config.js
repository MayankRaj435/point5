export default {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  moduleFileExtensions: ["js", "json"],
  transform: {
    "^.+\\.js$": ["babel-jest", { configFile: "./babel.config.cjs" }],
  },
  clearMocks: true,
  verbose: true,
  setupFiles: ["./tests/env.setup.js"],
  setupFilesAfterEnv: ["./tests/setup.js"],
};