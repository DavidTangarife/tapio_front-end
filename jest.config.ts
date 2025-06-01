import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",

  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "./tsconfig.app.json",
      },
    ],
  },

  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy",
  },
};

export default config;
