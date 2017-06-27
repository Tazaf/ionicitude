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
var addsrc = require('gulp-add-src');

var distName = 'ionicitude';
var start = ';(function(){\n"use strict";\n\n';
var end = '})();';

var files = [
	'./src/setup.module.js',
	'./src/ionicitude.service.js'
];

var prodFolder = './dist';

/**
 * Builds a dist version of the module.
 * This task does the following :
 * - Concatenates all module files in the correct order
 * - Opens the IIFE by adding a header
 * - Closes the IIFE by adding a footer
 * - Prepends the UnsupportedFeatureException script in the gulp.src
 * - Concatenates everything
 * - Rename the file
 * - Saves the file in the destination folder
 * - Checks for any injection and adds the injection statements
 * - Uglifies the file
 * - Renames the file with '.min.js'
 * - Saves the file in the destination folder
 */
gulp.task('build', function () {
	gulp.src(files)
		.pipe(concat('concat-src'))
		.pipe(header(start))
		.pipe(footer(end))
		.pipe(addsrc.prepend('./src/UnsupportedFeatureError.js'))
		.pipe(concat('concat-all'))
		.pipe(rename({basename: distName, extname: '.js'}))
		.pipe(gulp.dest(prodFolder))
		.pipe(ngAnnotate())
		.pipe(uglify())
		.pipe(rename({extname: '.min.js'}))
		.pipe(gulp.dest(prodFolder));
});

gulp.task('default', function() {
	gulp.watch('./src/*.js', ['build']);
})