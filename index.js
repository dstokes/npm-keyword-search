#! /usr/bin/env node
var fs = require('fs')
  , path = require('path')
  , through = require('through')
  , column = require('node-column')
  , json = require('JSONStream');

var keywords = process.argv.slice(2);

var cache = path.join(process.env.HOME, '.npm', '-/all', '.cache.json');
function format(pkg) {
  return pkg.name +' '+ pkg.description;
}
function inKeywords(keywords) {
  return function(k) { return keywords.indexOf(k) !== -1; }
}
var filter = through(function(pkg) {
  if (! (pkg.keywords instanceof Array)) return;
  if (keywords.every(inKeywords(pkg.keywords))) {
    this.queue([pkg.name, pkg.description].join('|') + '\n');
  }
});

columns = column('|')
columns.write('name|description\n');

fs.createReadStream(cache)
  .pipe(json.parse([true]))
  .pipe(filter)
  .pipe(columns)
  .pipe(process.stdout);
