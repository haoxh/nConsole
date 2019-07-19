const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs')
const { uglify } = require('rollup-plugin-uglify')

module.exports = {
  inputOpt: {
    input: 'src/nConsole.js',
    plugins: [
      resolve(),
      babel({
        exclude: 'node_modules/**',
        presets: [['@babel/preset-env', { modules: false }]],
        runtimeHelpers: true,
        externalHelpers: true
      }),
      commonjs({
        include: 'node_modules/**',
        extensions: [ '.js'],
        sourceMap: false,
        ignore: [ 'conditional-runtime-dependency' ]
      }),
      uglify({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true
        }
      })
    ]
  },
  outputOpt: {
    file: 'nconsole.umd.min.js',
    format: 'umd',
    name:'nConsole',
    banner:`/*!\n* nConsole v1.0.0\n* (c) 2018-2019 haoxh\n* Released under the MIT License.\n*/`
  }
};



