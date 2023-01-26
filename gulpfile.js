var gulp = require('gulp');
var gzip = require('gulp-gzip');

gulp.task('compress', function() {
  return gulp.src(['./dist/**/*.*'])
      .pipe(gzip({ gzipOptions: { level: 9 } }))
      .pipe(gulp.dest('./dist.gz'));
});