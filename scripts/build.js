const rollup = require('rollup')
const config = require('./rollup.config')

const inputOptions = config.inputOpt;
const outputOptions = config.outputOpt;

async function build() {
  const bundle = await rollup.rollup(inputOptions);
  // generate code and a sourcemap
  // await bundle.generate(outputOptions);
  // write the bundle to disk
  await bundle.write(outputOptions);
}
build();