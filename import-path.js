#!/usr/bin/env node

const {program} = require('commander');

program
  .version('0.0.1')
  .option('--path [path]', 'Path inside the package to improve')
  .option('--dts', 'Create typescript declaration files')
  .parse(process.argv);

const options = program.opts();

require('./src/scan')(options.path, options.dts);
