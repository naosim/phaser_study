var gulp = require("gulp");
var concat = require("gulp-concat");

// それぞれのプラグインで行う処理を書いていく
gulp.task('js:concat', function() {
  return gulp.src('dev/js/**/*.js')
    .pipe(concat('libs.js'))
    .pipe(gulp.dest('./dest/js/'));
});
