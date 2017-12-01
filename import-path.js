#!/usr/bin/env node

const program = require('commander');

program
.version('0.0.1')
.option('--package [package]', 'Packge that will have the nicer import path')
.option('--path [path]', 'Path inside the package to improve')
.parse(process.argv);

require('./src/scan')(program);
