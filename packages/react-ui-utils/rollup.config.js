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
  extensions: [".js"],
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

function addEntry(input, output) {
  const exports = "named";
  const inlineDynamicImports = true;

  const onwarn = (warning) => {
    if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
      return;
    }
  };

  const getEntry = (isMinify) => {
    return {
      onwarn,
      input,
      plugins: [...PLUGINS, isMinify && terser(TERSER_PLUGIN_OPTIONS)],
      external: ["react"],
      inlineDynamicImports,
    };
  };

  const get_CJS_ESM = (isMinify) => {
    return {
      ...getEntry(isMinify),
      output: [
        {
          format: "cjs",
          file: `${output}.cjs${isMinify ? ".min" : ""}.js`,
          exports,
        },
        {
          format: "esm",
          file: `${output}.esm${isMinify ? ".min" : ""}.js`,
          exports,
        },
      ],
    };
  };

  const get_IIFE = (isMinify) => {
    return {
      ...getEntry(isMinify),
      output: [
        {
          format: "iife",
          name: "utils",
          file: `${output}${isMinify ? ".min" : ""}.js`,
          globals: GLOBAL_DEPENDENCIES,
          exports,
        },
      ],
    };
  };

  entries.push(get_CJS_ESM());
  entries.push(get_CJS_ESM(true));
  entries.push(get_IIFE());
  entries.push(get_IIFE(true));
}

function addPackageJson() {
  const outputDir = path.join(__dirname, process.env.OUTPUT_DIR);
  const packageJson = `{
  "name": "${pkg.name}",
  "version": "${pkg.version}",
  "private": false,
  "author": "Ilan Arellano",
  "description": "A cross-platform general UI common methods for React Projects",
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
  "unpkg": "index.min.js",
  "jsdelivr": "index.min.js",
  "main": "index.min.js",
  "module": "index.esm.min.js",
  "types": "types.d.ts",
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

function addEntries(
  filePath,
  type = "directory",
  indexFileName = "index",
  excludeFolders = []
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
            const output =
              process.env.OUTPUT_DIR +
              "/" +
              filePath +
              "/" +
              folderName +
              "/" +
              name;

            addEntry(input, output);
          }
        });
      });
      break;
    case "file":
      const input = process.env.INPUT_DIR + "/" + filePath;
      const output =
        process.env.OUTPUT_DIR +
        "/" +
        filePath.split(/\.(ts|tsx)$/)[0].toLowerCase();

      addEntry(input, output);
      break;
    default:
      break;
  }
}

//All
addEntries("index.ts", "file");
//Cache
addEntries("Cache", "directory", "index", ["logic"]);
//HOCs
addEntries("hoc");
//Hooks
addEntries("hooks", "directory", "index", ["shared"]);
//Package JSON
addPackageJson();

export default entries;
