#!/usr/bin/env node

var yargs = require('yargs');
var cssReport = require('../dist');

var argv = yargs
  .options({
    output: {
      alias: 'o',
      default: 'report.html',
      describe: 'The output file',
      type: 'string'
    }
  })
  .demand(1)
  .argv;

cssReport.generateCssReport(argv._, argv.o);
