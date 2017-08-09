/**
 * Created by Mathias on 08.04.2016.
 */
const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const ngAnnotate = require('gulp-ng-annotate');
const header = require('gulp-header');
const footer = require('gulp-footer');
const addsrc = require('gulp-add-src');

const distName = 'ionicitude';
const start = ';(function(){\n"use strict";\n\n';
const end = '})();';

const files = [
	'./src/setup.module.js',
	'./src/ionicitude.service.js'
];

const prodFolder = './dist';

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

function compileTo(dest) {
	return gulp.src(files)
		.pipe(concat('concat-src'))
		.pipe(header(start))
		.pipe(footer(end))
		.pipe(addsrc.prepend('./src/UnsupportedFeatureError.js'))
		.pipe(concat('concat-all'))
		.pipe(rename({basename: distName, extname: '.js'}))
		.pipe(gulp.dest(dest))
		.pipe(ngAnnotate())
		.pipe(uglify())
		.pipe(rename({extname: '.min.js'}))
		.pipe(gulp.dest(dest));
}

gulp.task('default', () => compileTo(prodFolder));
