import {belongsTo, report, camelize} from "rogo";
import * as rollup from "rollup";
import * as path from "path";
const babel = require('rollup-plugin-babel');
const node = require("@rollup/plugin-node-resolve");
const cjs = require("@rollup/plugin-commonjs");
const json = require("@rollup/plugin-json");
import { terser } from "rollup-plugin-terser"; // to minify bundle
const pkg = require("../package.json")

// quick config
const input = 'src/index.js'
const outDir = 'dist'
const outputName = pkg.name // the built file name is outDir/outputName.format.js
const moduleName = camelize(pkg.name) // for umd, amd

const getBabelConfig = () => ({
  // .babelrc
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: false,
      targets: 'defaults', // default browsers, coverage 90%
    }],
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    // Stage 1
    ['@babel/plugin-proposal-optional-chaining', { 'loose': false }],
    // Stage 2
    '@babel/plugin-proposal-export-namespace-from',
    // Stage 3
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-import-meta',
    ['@babel/plugin-proposal-class-properties', { 'loose': true }],
    '@babel/plugin-proposal-json-strings',
  ],
  // for rollup babel plugin
  runtimeHelpers: true,
  exclude: [/@babel\/runtime/, /@babel\\runtime/, /regenerator-runtime/],
  extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.vue', '.ts', '.tsx'],
  babelrc: false,
})

const esmBabelConfig = <any>getBabelConfig()

const cjsBabelConfig = <any>getBabelConfig()
cjsBabelConfig.plugins.push(['module-extension', {mjs: 'js'}]) // replace .mjs to .js

const umdBabelConfig = <any>getBabelConfig()

export default <rollup.RollupOptions[]>[
  // esm
  {
    input,
    external: (source) => belongsTo(source, Object.keys(pkg.dependencies||{})) || belongsTo(source, Object.keys(pkg.peerDependencies||{})),
    plugins: [
      babel(esmBabelConfig),
      node(), cjs(), json(),
    ],
    output: {
      file: path.resolve(outDir, `${outputName}.esm.js`),
      format: 'esm',
      banner: getBanner(pkg),
      sourcemap: false,
    },
  },
  // cjs
  {
    input,
    external: (source) => belongsTo(source, Object.keys(pkg.dependencies||{})) || belongsTo(source, Object.keys(pkg.peerDependencies||{})),
    plugins: [
      babel(cjsBabelConfig),
      node(), cjs(), json(),
    ],
    output: {
      file: path.resolve(outDir, `${outputName}.cjs.js`),
      format: 'cjs',
      banner: getBanner(pkg),
      sourcemap: false,
    },
  },
  // umd
  {
    input,
    external: (source) => belongsTo(source, Object.keys(pkg.peerDependencies||{})),
    plugins: [
      babel(umdBabelConfig),
      node(), cjs(), json(),
    ],
    output: {
      file: path.resolve(outDir, `${outputName}.js`),
      format: 'umd',
      banner: getBanner(pkg),
      sourcemap: false,
      name: moduleName,
    },
  },
  // umd min
  {
    input,
    external: (source) => belongsTo(source, Object.keys(pkg.peerDependencies||{})),
    plugins: [
      babel(umdBabelConfig),
      node(), cjs(), json(),
      terser(), // to minify bundle
    ],
    output: {
      file: path.resolve(outDir, `${outputName}.min.js`),
      format: 'umd',
      banner: getBanner(pkg),
      sourcemap: false,
      name: moduleName,
    },
  },
]

if (process.argv.includes('--report')) {
  report(outDir)
}

function getBanner(pkg) {
  return `
/*!
 * ${pkg.name} v${pkg.version}
 * (c) ${pkg.author}
 * Homepage: ${pkg.homepage}
 * Released under the ${pkg.license} License.
 */`.trim()
}