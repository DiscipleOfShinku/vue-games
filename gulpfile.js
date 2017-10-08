var gulp = require('gulp');
var webpack = require('webpack-stream');

gulp.task('default', function() {
  return gulp.src('src/index.js')
  .pipe(webpack( require('./webpack.prod.js') ))
    .pipe(gulp.dest('dist/'));
});