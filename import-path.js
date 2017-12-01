#!/usr/bin/env node

const program = require('commander');
console.log('!@#!@#!@#!@#2222222');
program
  .arguments('<process>')
  .command('start [entryPoint]', 'start the application')
  .command('lint', 'lints the code')
  .parse(process.argv);
