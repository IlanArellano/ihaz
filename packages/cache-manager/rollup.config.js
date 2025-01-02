import typescript from "rollup-plugin-typescript2";
import external from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import alias from "@rollup/plugin-alias";
import tsAlias from "./tsAlias.js";

import pkg from "./package.json" assert { type: "json" };

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      exports: "named",
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: "es",
      exports: "named",
      sourcemap: true,
    },
  ],
  plugins: [
    external(),
    resolve(),
    typescript({
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
    }),
    alias({
      resolve: [".ts", ".tsx"],
      entries: [{ find: "@cache", replacement: "./src" }],
    }),
    tsAlias(),
  ],
};
