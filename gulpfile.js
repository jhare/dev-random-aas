'use strict';

var gulp = require('gulp');
var minifyCss = require('gulp-minify-css');
var uglifyJs = require('gulp-uglify');
var help = require('gulp-task-listing');
var stylus = require('gulp-stylus');
var rename = require('gulp-rename');
var rimraf = require('gulp-rimraf');
var livereload = require('gulp-livereload');
var concat = require('gulp-concat');

var options = {
	stylusFiles: './stylus/**/*',
	cssConcatName: 'styles.css',
	javascriptFiles: './javascript/**/*',
	javascriptConcatName: 'app.js',
	distPath: './dist',
	readme: './README.md',
	gulpfile: './gulpfile.js'
};

/**
 * Building tasks
 */
function buildCssDev() {
	gulp.src(options.stylusFiles)
		.pipe(stylus())
		.pipe(gulp.dest(options.distPath + '/css'));
}

function buildCssProduction() {
	gulp.src(options.stylusFiles)
		.pipe(stylus())
		.pipe(minifyCss())
		.pipe(concat(options.cssConcatName))
		.pipe(gulp.dest(options.distPath + '/css'));
}

function buildJavascriptDev() {
	gulp.src(options.javascriptFiles)
		.pipe(gulp.dest(options.distPath + '/javascript'));
}

function buildJavascriptProduction() {
	gulp.src(options.javascriptFiles)
		.pipe(uglifyJs())
		.pipe(concat(options.javascriptConcatName))
		.pipe(gulp.dest(options.distPath + '/javascript'));
}

function cleanDist() {
	gulp.src(options.distPath)
		.pipe(rimraf({
			force: true
		}));
}

/**
 * Live reload setup
 */
function notifyStylusChange() {
	gulp.watch(options.stylusFiles, livereload.changed);
}

function notifyReadmeChange() {
	gulp.watch(options.readme, livereload.changed);
}

function notifyGulpfileChange() {
	// Can you handle the meta!?
	gulp.watch(options.gulpfile, livereload.changed);
}

function startListener() {
	livereload.listen();
}

/**
 * Tie builds together
 */
gulp.task('build-javascript-development', buildJavascriptDev);
gulp.task('build-javascript-production', buildJavascriptProduction);

gulp.task('build-javascript', [
	'build-javascript-development',
	'build-javascript-production'
]);

gulp.task('build-css-development', buildCssDev);
gulp.task('build-css-production', buildCssProduction);

gulp.task('build-css', [
	'build-css-development',
	'build-css-production'
]);

gulp.task('build-development', [
	'build-javascript-development',
	'build-css-development'
]);

gulp.task('build', [
	'build-javascript-production',
	'build-css-production'
]);
/**
 * Tie watches together
 */
gulp.task('watch-stylus', notifyStylusChange);
gulp.task('watch-readme', notifyReadmeChange);
gulp.task('watch-gulpfile', notifyGulpfileChange);
gulp.task('watch-startListener', startListener);

gulp.task('watch', [
	'watch-stylus',
	'watch-readme',
	'watch-gulpfile',
	'watch-startListener'
]);

/**
 * Utility stuff
 */
gulp.task('clean', cleanDist);

gulp.task('help', help);
gulp.task('default', ['help']);
