'use strict';
var fs = require('fs');
var assert = require('assert');
var gutil = require('gulp-util');
var csv2json = require('./index');

it('should convert csv to json', function (cb) {
	var stream = csv2json();
	stream.on('data', function (file) {
    var parse_file = JSON.parse(file.contents.toString('utf-8'));
		assert(parse_file instanceof Object);
		cb();
	});

	stream.write(new gutil.File({
		path: __dirname + '/sample/sample-csv.csv',
		contents: fs.readFileSync(__dirname + '/sample/sample-csv.csv')
	}));
});
