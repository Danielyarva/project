import type { Config } from "jest"

const config: Config = {
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.ts$": [
      "@swc/jest",
      {
        jsc: {
          parser: { syntax: "typescript" },
          target: "es2022",
        },
        module: { type: "es6" },
      },
    ],
  },
  testMatch: ["**/tests/**/*.test.ts"],
  setupFiles: ["<rootDir>/tests/env-setup.ts"],
}

export default config
