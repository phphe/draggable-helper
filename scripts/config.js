const {
  camelCase, defaultBanner, defaultPlugins, babelTargetEsmodules, belongsTo,
  alias, replace, terser, // rollup plugins
} = require('rollup-helper')
const path = require('path')
const fs = require('fs')
const pkg = require('../package.json')
const resolve = p => path.resolve(__dirname, '../', p)

const options = {
  input: fs.existsSync(resolve('src/index.js')) ? resolve(`src/index.js`) : resolve(`src/${pkg.name}.js`),
  outputName: pkg.name,
  moduleName: camelCase(pkg.name),
}

const builds = {
  'cjs': {
    entry: options.input,
    dest: resolve(`dist/${options.outputName}.cjs.js`),
    format: 'cjs',
    plugins: defaultPlugins({babel: babelTargetEsmodules}),
    external: source => belongsTo(source, Object.keys(pkg.dependencies)),
  },
  'esm': {
    entry: options.input,
    dest: resolve(`dist/${options.outputName}.esm.js`),
    format: 'es',
    plugins: defaultPlugins({babel: babelTargetEsmodules}),
    external: source => belongsTo(source, Object.keys(pkg.dependencies)),
  },
  'umd': {
    entry: options.input,
    dest: resolve(`dist/${options.outputName}.js`),
    format: 'umd',
    plugins: defaultPlugins(),
    moduleName: options.moduleName,
  },
  'umd-min': {
    entry: options.input,
    dest: resolve(`dist/${options.outputName}.min.js`),
    format: 'umd',
    plugins: defaultPlugins(),
    moduleName: options.moduleName,
    sourcemap: false,
  },
}

const aliases = require('./alias')
function genConfig (name) {
  const opts = builds[name]
  const config = {
    input: opts.entry,
    external: opts.external,
    plugins: [
      alias(Object.assign({}, aliases, opts.alias)),
      ...opts.plugins,
    ],
    output: {
      file: opts.dest,
      format: opts.format,
      banner: opts.banner || defaultBanner(pkg),
      name: opts.moduleName,
      sourcemap: opts.sourcemap,
    },
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        warn(msg)
      }
    }
  }

  // built-in vars
  const vars = {}
  // build-specific env
  if (opts.env) {
    vars['process.env.NODE_ENV'] = JSON.stringify(opts.env)
  }
  if (Object.keys(vars).length > 0) {
    config.plugins.push(replace(vars))
  }
  const isProd = /(min|prod)\.js$/.test(config.output.file)
  if (isProd) {
    config.plugins.push(terser())
  }

  Object.defineProperty(config, '_name', {
    enumerable: false,
    value: name
  })

  return config
}

if (process.env.TARGET) {
  module.exports = genConfig(process.env.TARGET)
} else {
  exports.getBuild = genConfig
  exports.getAllBuilds = () => Object.keys(builds).map(genConfig)
}
