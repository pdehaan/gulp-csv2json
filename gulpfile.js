var gulp = require('gulp');
var csv2json = require('./');
var rename = require('gulp-rename');

gulp.task('default', function () {
    gulp.src('./sample/*.csv')
        .pipe(csv2json())
				.pipe(rename({extname: '.json'}))
        .pipe(gulp.dest('./dist'));
});
