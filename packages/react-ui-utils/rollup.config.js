import * as fs from "node:fs";
import * as path from "node:path";
import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import external from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import alias from "@rollup/plugin-alias";
import { babel } from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

import pkg from "./package.json" assert { type: "json" };

const ALIAS = "@utils";

const entries = [];

const ENTRIES_ALIAS = {
  resolve: [".ts", ".tsx"],
  entries: [{ find: ALIAS, replacement: "./src" }],
};

const GLOBAL_DEPENDENCIES = {
  react: "React",
};

const REPLACE_PLUGIN_OPTIONS = {
  "process.env.NODE_ENV": JSON.stringify("production"),
  preventAssignment: true,
};

const RESOLVE_PLUGIN_OPTIONS = {
  extensions: [".js", ".ts", ".tsx"],
};

const COMMONJS_PLUGIN_OPTIONS = {
  exclude: process.env.INPUT_DIR + "**",
  sourceMap: false,
};

const TYPESCRIPT_CONFIG = {
  exclude: "**/__tests__/**",
  clean: true,
  tsconfig: "./tsconfig.json",
  tsconfigDefaults: {
    compilerOptions: {
      plugins: [
        { transform: "typescript-transform-paths" },
        {
          transform: "typescript-transform-paths",
          afterDeclarations: true,
        },
      ],
    },
  },
};

// Plugins
const BABEL_PLUGIN_OPTIONS = {
  exclude: "node_modules/**",
  presets: ["@babel/preset-env", "@babel/preset-react"],
  plugins: ["@babel/plugin-transform-runtime"],
  skipPreflightCheck: true,
  babelHelpers: "runtime",
  babelrc: false,
};

const TERSER_PLUGIN_OPTIONS = {
  compress: {
    keep_infinity: true,
    pure_getters: true,
    reduce_funcs: false,
  },
};

const PLUGINS = [
  alias(ENTRIES_ALIAS),
  replace(REPLACE_PLUGIN_OPTIONS),
  resolve(RESOLVE_PLUGIN_OPTIONS),
  commonjs(COMMONJS_PLUGIN_OPTIONS),
  babel(BABEL_PLUGIN_OPTIONS),
  external(),
  typescript(TYPESCRIPT_CONFIG),
];

//Formats
function createESMConfig(input, output) {
  return {
    input,
    output: { file: `${output}.mjs`, format: "esm" },
    plugins: PLUGINS,
  };
}

function createCommonJSConfig(input, output) {
  return {
    input,
    output: {
      file: `${output}.js`,
      format: "cjs",
      esModule: false,
    },
    plugins: PLUGINS,
  };
}

function createUMDConfig(input, output, env) {
  let name = pkg.name;
  const fileName = output.slice((process.env.OUTPUT_DIR + "/umd/").length);
  const capitalize = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
  if (fileName !== "index") {
    name += fileName.replace(/(\w+)\W*/g, (_, p) => capitalize(p));
  }
  return {
    input,
    output: {
      file: `${output}.${env}.js`,
      format: "umd",
      name,
      globals: {
        react: "React",
      },
    },
    plugins: [...PLUGINS, ...(env === "production" ? [terser()] : [])],
  };
}

function createSystemConfig(input, output, env) {
  return {
    input,
    output: {
      file: `${output}.${env}.js`,
      format: "system",
    },
    plugins: PLUGINS,
  };
}

function addPackageJson() {
  const outputDir = path.join(__dirname, process.env.OUTPUT_DIR);
  const packageJson = `{
  "name": "${pkg.name}",
  "version": "${pkg.version}",
  "private": false,
  "author": "Ilan Arellano <ilanarellano15@gmail.com>",
  "description": "A cross-platform general UI common methods for React Projects",
  "main": "cjs/index.js",
  "module": "esm/index.mjs",
  "types": "types.d.ts",
  "homepage": "https://github.com/IlanArellano/ihaz/blob/main/packages/react-ui-utils/README.md",
  "repository": {
      "type": "git",
      "url": "git+https://github.com/IlanArellano/ihaz.git"
  },
  "license": "MIT",
  "bugs": {
      "url": "https://github.com/IlanArellano/ihaz/issues"
  },
  "keywords": [
    "react",
    "react-utils",
    "react native"
  ],
  "sideEffects": false,
  "files": [
    "**"
  ],
  "peerDependencies": {
    "react": "${pkg.peerDependencies.react}"
  },
  "peerDependenciesMeta": {
      "@types/react": {
          "optional": true
      }
  },
  "engines": {
    "node": ">=16"
  }
}`;

  !fs.existsSync(outputDir) && fs.mkdirSync(outputDir);
  fs.writeFileSync(path.join(outputDir, "package.json"), packageJson);
}

function addEntry(input, output, standaloneFile = false) {
  entries.push(
    createCommonJSConfig(
      input,
      standaloneFile
        ? `${process.env.OUTPUT_DIR}/${output}`
        : `${process.env.OUTPUT_DIR}/cjs/${output}`
    )
  );
  entries.push(
    createESMConfig(input, `${process.env.OUTPUT_DIR}/esm/${output}`)
  );
  entries.push(
    createUMDConfig(
      input,
      `${process.env.OUTPUT_DIR}/umd/${output}`,
      "development"
    )
  );
  entries.push(
    createUMDConfig(
      input,
      `${process.env.OUTPUT_DIR}/umd/${output}`,
      "production"
    )
  );
  entries.push(
    createSystemConfig(
      input,
      `${process.env.OUTPUT_DIR}/system/${output}`,
      "development"
    )
  );
  entries.push(
    createSystemConfig(
      input,
      `${process.env.OUTPUT_DIR}/system/${output}`,
      "production"
    )
  );
}

function addEntries(
  filePath,
  type = "directory",
  excludeFolders = [],
  indexFileName = "index",
  standaloneFile = false
) {
  switch (type) {
    case "directory":
      let dir = fs.readdirSync(
        path.resolve(__dirname, process.env.INPUT_DIR, filePath),
        {
          withFileTypes: true,
        }
      );

      dir = dir.filter(
        (dir) =>
          dir.isDirectory() &&
          (excludeFolders.length === 0
            ? true
            : !excludeFolders.some((folder) => folder === dir.name))
      );
      dir.forEach(({ name: folderName }) => {
        const subFolderPath = path.resolve(
          __dirname,
          process.env.INPUT_DIR,
          filePath,
          folderName
        );
        fs.readdirSync(subFolderPath).forEach((file) => {
          const name = file.split(/\.(ts|tsx)$/)[0].toLowerCase();

          if (name === indexFileName) {
            const input =
              process.env.INPUT_DIR +
              "/" +
              filePath +
              "/" +
              folderName +
              "/" +
              file;
            const output = `${filePath}/${folderName}`;

            addEntry(input, output, standaloneFile);
          }
        });
      });
      break;
    case "file":
      const input = process.env.INPUT_DIR + "/" + filePath;
      const output = filePath.split(/\.(ts|tsx)$/)[0].toLowerCase();

      addEntry(input, output, standaloneFile);
      break;
    default:
      break;
  }
}

//All
addEntries("index.ts", "file", [], "index");
/*//Cache
addEntries("Cache", "directory", ["logic"]);
//HOCs
addEntries("hoc");
//Hooks
addEntries("hooks", "directory", ["shared"]);*/
//Package JSON
addPackageJson();

export default entries;
