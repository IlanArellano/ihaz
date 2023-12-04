function makeModuleNameMapper(srcPath, tsconfigPath) {
  const json = require(tsconfigPath);
  const { paths } = json.compilerOptions;

  const aliases = {};

  Object.keys(paths).forEach((item) => {
    const key = item.replace("/*", "/(.*)");
    const path = paths[item][0].replace("/*", "/$1");
    aliases[key] = srcPath + "/" + path;
  });
  console.log({ aliases });
  return aliases;
}

const SRC_PATH = "react-ui-utils/src";

module.exports = {
  roots: ["<rootDir>"],
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
  moduleNameMapper: {
    "@utils/(.*)": "<rootDir>/src/$1",
  },
};
