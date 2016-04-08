/**
 * Created by Mathias on 08.04.2016.
 */
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var ngAnnotate = require('gulp-ng-annotate');
var header = require('gulp-header');
var footer = require('gulp-footer');

var dest = './dist';
var distName = 'ionic-wikitude-module';
var start = ';(function(){\n"use strict";\n\n';
var end = '})();';

var files = [
	'./src/UnsupportedFeatureError.js',
	'./src/wikitude.module.js',
	'./src/wikitude.settings.js',
	'./src/wikitude.plugin.js',
	'./src/wikitude.service.js'
];

// Task order :
// - concat src files into one
// - ajouter header
// - ajouter footer
// - déplacer dans le dossier dist
// - uglify
// - minify
// - renommer
// - déplacer dans le dossier dist

gulp.task('default', function () {
	// place code for your default task here
});

gulp.task('build', function () {
	return gulp.src(files)
		.pipe(concat('concat'))
		.pipe(ngAnnotate())
		.pipe(header(start))
		.pipe(footer(end))
		.pipe(rename({basename: distName, extname: '.js'}))
		.pipe(gulp.dest(dest))
		.pipe(uglify())
		.pipe(rename({extname: '.min.js'}))
		.pipe(gulp.dest(dest));
});

gulp.task('inject-test', function () {
	return gulp.src('./src/wikitude.service.js')
		.pipe(ngAnnotate({add: true, single_quotes: true}))
		.pipe(rename('inject-test.js'))
		.pipe(gulp.dest(dest));
})