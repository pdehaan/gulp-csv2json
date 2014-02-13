'use strict';
var path = require('path');
var fs = require('graceful-fs');
var gutil = require('gulp-util');
var map = require('map-stream');
var filesize = require('filesize');
var tempWrite = require('temp-write');
var csv = require('csv');

var header = []
	, record = [];

module.exports = function (options) {
	return map(function (file, cb) {
		if (file.isNull()) {
			return cb(null, file);
		}

		if (file.isStream()) {
			return cb(new gutil.PluginError('gulp-csv2json', 'Streaming not supported'));
		}

		if (['.csv'].indexOf(path.extname(file.path)) === -1) {
			gutil.log('gulp-csv2json: Skipping unsupported csv ' + gutil.colors.blue(file.relative));
			return cb(null, file);
		}

		tempWrite(file.contents, path.extname(file.path), function (err, tempFile) {
			if (err) {
				return cb(new gutil.PluginError('gulp-csv2json', err));
			}

			fs.stat(tempFile, function (err, stats) {
				if (err) {
					return cb(new gutil.PluginError('gulp-csv2json', err));
				}

				options = options || {};

				csv()
					.from.path(tempFile, { delimiter: ',', escape: '"' })
					//.to.stream(fs.createWriteStream(config.output))
					.transform( function(row){
						row.unshift(row.pop());
						return row;
					})
					.on('record', function(row, index){

						if(index === 0) {
							header = row;
						}else{
							var obj = {};
							header.forEach(function(column, index) {
								obj[column] = row[index];
							})
							record.push(obj);
						}
					})
					.on('end', function(count){
						// when writing to a file, use the 'close' event
						// the 'end' event may fire before the file has been written
						// 
						gutil.log('gulp-csv2json:', gutil.colors.green('✔ ') + file.relative); 
						file.contents = new Buffer(JSON.stringify(record));
						file.path = gutil.replaceExtension(file.path, '.json');
						cb(null, file);
						

					})
					.on('error', function(error){
            					return cb(new gutil.PluginError('gulp-csv2json', error));
					});
					
			});
		});
	});
};
