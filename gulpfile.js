var gulp = require('gulp');
var csv2json = require('./');

gulp.task('default', function () {
    gulp.src('./sample/*.csv')
        .pipe(csv2json())
        .pipe(gulp.dest('./dist'));
});
