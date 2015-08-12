var gulp = require('gulp');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var template = require('gulp-template-store');
var plumber = require('gulp-plumber');
var inlinesource = require('gulp-inline-source');

// define tasks here
gulp.task('build', function() {
  gulp.src('src/**/*.html')
    .pipe(inlinesource())
    .pipe(template({
      variable: 'exports.tmpl'
    }))
    .pipe(gulp.dest('dist'));
  gulp.src('src/**/*.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
      .pipe(babel())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['build'], function() {
  return gulp.watch('src/**/*.*', ['build']);
});

gulp.task('default', ['build']);
