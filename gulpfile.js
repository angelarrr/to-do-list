var gulp = require('gulp');

var htmlmin = require('gulp-htmlmin');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

// Minify index
gulp.task('html', function() {
	return gulp.src('site/index.html')
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest('dist/'))
});

// js build task
gulp.task('scripts', function() {
	return browserify('site/js/app.js')
		.bundle()
		.pipe(source('app.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
});

// concat css
gulp.task('styles', function() {
	return gulp.src('site/css/*.css')
		.pipe(concat('style.css'))
		.pipe(gulp.dest('dist/css'));
});

// build
gulp.task('build', ['html', 'scripts', 'styles']);