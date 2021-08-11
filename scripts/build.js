"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// run npm run compile-build when you changed this file to generate build.js
const core_1 = require("@rollup-use/core");
const path = require("path");
const plugin_babel_1 = require("@rollup/plugin-babel");
const plugin_node_resolve_1 = require("@rollup/plugin-node-resolve");
const rollup_plugin_terser_1 = require("rollup-plugin-terser"); // to minify bundle
// don't convert follow to imponst xx from 'xx'
const cjs = require("@rollup/plugin-commonjs");
const json = require("@rollup/plugin-json");
const typescript = require("@rollup/plugin-typescript");
// @ts-ignore
const pkg = require("../package.json");
// quick config
const input = "src/index.ts";
const outDir = "dist";
const outputName = core_1.resolveOutputName(pkg.name); // the built file name is outDir/outputName.format.js. You can modify it.
const moduleName = core_1.resolveModuleName(pkg.name); // for umd, amd. You can modify it.
const outputExports = "auto"; // You might get warning 'Mixing named and default exports'. https://rollupjs.org/guide/en/#outputexports
const external = [...core_1.resolveAllDependencies(pkg)];
const umdExternal = [...core_1.resolveUMDDependencies(pkg)]; // umd should bundle dependencies
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
                targets: "defaults",
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
const esmBabelConfig = getBabelConfig();
const cjsBabelConfig = getBabelConfig();
cjsBabelConfig.plugins.push(["module-extension", { mjs: "js" }]); // replace .mjs to .js
const umdBabelConfig = getBabelConfig();
exports.default = [
    // esm
    {
        input,
        external: (source) => core_1.belongsTo(source, external),
        plugins: [
            plugin_node_resolve_1.default(),
            plugin_babel_1.default(esmBabelConfig),
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
        external: (source) => core_1.belongsTo(source, external),
        plugins: [
            plugin_node_resolve_1.default(),
            plugin_babel_1.default(cjsBabelConfig),
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
        external: (source) => core_1.belongsTo(source, umdExternal),
        plugins: [
            plugin_node_resolve_1.default(),
            plugin_babel_1.default(umdBabelConfig),
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
        external: (source) => core_1.belongsTo(source, umdExternal),
        plugins: [
            plugin_node_resolve_1.default(),
            plugin_babel_1.default(umdBabelConfig),
            typescript({ declaration: false }),
            cjs(),
            json(),
            rollup_plugin_terser_1.terser(),
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
    core_1.report(outDir);
}
function getBanner(pkg) {
    return `
/*!
 * ${pkg.name} v${pkg.version}
 * (c) ${pkg.author}
 * Homepage: ${pkg.homepage || null}
 * Released under the ${pkg.license} License.
 */`.trim();
}
