// run npm run compile-build when you changed this file to generate build.js
import {
  belongsTo,
  report,
  resolveOutputName,
  resolveModuleName,
  resolveAllDependencies,
  resolveUMDDependencies,
} from "@rollup-use/core";
import * as rollup from "rollup";
import * as path from "path";
import babel from "@rollup/plugin-babel";
import node from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser"; // to minify bundle
// don't convert follow to imponst xx from 'xx'
const cjs = require("@rollup/plugin-commonjs");
const json = require("@rollup/plugin-json");
const typescript = require("@rollup/plugin-typescript");
// @ts-ignore
import pkg = require("../package.json");

// quick config
const input = "src/index.ts";
const outDir = "dist";
const outputName = resolveOutputName(pkg.name); // the built file name is outDir/outputName.format.js. You can modify it.
const moduleName = resolveModuleName(pkg.name); // for umd, amd. You can modify it.
const outputExports = "auto"; // You might get warning 'Mixing named and default exports'. https://rollupjs.org/guide/en/#outputexports
const external = [...resolveAllDependencies(pkg)];
const umdExternal = [...resolveUMDDependencies(pkg)]; // umd should bundle dependencies
// for declaration files
const rootDir = "src";
const declarationDir = "types"; //

const getBabelConfig = () => ({
  // .babelrc
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: false,
        targets: "defaults", // default browsers, coverage 90%
      },
      "@babel/typescript",
    ],
  ],
  plugins: [
    "@babel/plugin-transform-runtime",
    // Stage 1
    "@babel/plugin-proposal-optional-chaining",
    // Stage 2
    "@babel/plugin-proposal-export-namespace-from",
    // Stage 3
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-syntax-import-meta",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-json-strings",
  ],
  assumptions: {
    /**
     * When true, class properties are compiled to use an assignment expression instead of Object.defineProperty. Check: https://babeljs.io/docs/en/babel-plugin-proposal-class-properties#options
     * 当设置为 true 时，类属性将被编译为赋值表达式而不是 Object.defineProperty。参考: https://babel.docschina.org/docs/en/babel-plugin-proposal-class-properties/#%E9%80%89%E9%A1%B9
     */
    // "setPublicClassFields": true
  },
  // for rollup babel plugin
  babelHelpers: "runtime",
  exclude: [
    /@babel\/runtime/,
    /@babel\\runtime/,
    /regenerator-runtime/,
    /tslib/,
  ],
  extensions: [".js", ".jsx", ".es6", ".es", ".mjs", ".vue", ".ts", ".tsx"],
  babelrc: false,
});

const esmBabelConfig = <any>getBabelConfig();

const cjsBabelConfig = <any>getBabelConfig();
cjsBabelConfig.plugins.push(["module-extension", { mjs: "js" }]); // replace .mjs to .js

const umdBabelConfig = <any>getBabelConfig();

export default <rollup.RollupOptions[]>[
  // esm
  {
    input,
    external: (source) => belongsTo(source, external),
    plugins: [
      node(),
      babel(esmBabelConfig),
      typescript({ declaration: true, rootDir, declarationDir }),
      cjs(),
      json(),
    ],
    output: {
      dir: "./",
      entryFileNames: path.join(outDir, `${outputName}.esm.js`),
      format: "esm",
      banner: getBanner(pkg),
      sourcemap: false,
      exports: outputExports,
    },
  },
  // cjs
  {
    input,
    external: (source) => belongsTo(source, external),
    plugins: [
      node(),
      babel(cjsBabelConfig),
      typescript({ declaration: false }),
      cjs(),
      json(),
    ],
    output: {
      file: path.resolve(outDir, `${outputName}.cjs.js`),
      format: "cjs",
      banner: getBanner(pkg),
      sourcemap: false,
      exports: outputExports,
    },
  },
  // umd
  {
    input,
    external: (source) => belongsTo(source, umdExternal),
    plugins: [
      node(),
      babel(umdBabelConfig),
      typescript({ declaration: false }),
      cjs(),
      json(),
    ],
    output: {
      file: path.resolve(outDir, `${outputName}.js`),
      format: "umd",
      banner: getBanner(pkg),
      sourcemap: false,
      name: moduleName,
      exports: outputExports,
    },
  },
  // umd min
  {
    input,
    external: (source) => belongsTo(source, umdExternal),
    plugins: [
      node(),
      babel(umdBabelConfig),
      typescript({ declaration: false }),
      cjs(),
      json(),
      terser(), // to minify bundle
    ],
    output: {
      file: path.resolve(outDir, `${outputName}.min.js`),
      format: "umd",
      banner: getBanner(pkg),
      sourcemap: false,
      name: moduleName,
      exports: outputExports,
    },
  },
];

if (process.argv.includes("--report")) {
  report(outDir);
}

function getBanner(pkg: any) {
  return `
/*!
 * ${pkg.name} v${pkg.version}
 * (c) ${pkg.author}
 * Homepage: ${pkg.homepage || null}
 * Released under the ${pkg.license} License.
 */`.trim();
}
