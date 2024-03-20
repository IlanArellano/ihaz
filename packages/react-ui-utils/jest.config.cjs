module.exports = {
  roots: ["<rootDir>"],
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
  moduleNameMapper: {
    "@utils/(.*)": "<rootDir>/src/$1",
    "@jsUtils/(.*)": "<rootDir>/../js-ui-utils/src/$1",
  },
};
