/* Gulp file */

var gulp 				= require('gulp'),
		jshint 			= require('gulp-jshint'),
		sass 				= require('gulp-sass'),
		autoprefixer= require('gulp-autoprefixer'),
		minifyCss 	= require('gulp-minify-css'),
		jade				= require('gulp-jade'),
		sourcemaps  = require('gulp-sourcemaps'),
		uglify			= require('gulp-uglify'),
		gzip				= require('gulp-gzip'),
		rename			= require('gulp-rename'),
		concat 			= require('gulp-concat'),
		imagemin 		= require('gulp-imagemin'),
		cache 			= require('gulp-cache');
		
var del 				= require('del'),
		browserSync = require('browser-sync').create(),
		reload 			= browserSync.reload;

// load the configuration
var config = require('./config.js');

// Task for libs
gulp.task('libs:css', function(){
	gulp.src(config.libs.css.src)
		.pipe(concat(config.libs.css.options.basename+".css"))
		.pipe(autoprefixer('last 2 version'))
		.pipe(minifyCss())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(config.libs.css.dest));
});
gulp.task('libs:js', function(){
	gulp.src(config.libs.js.src)
		.pipe(concat(config.libs.js.options.basename+".js"))
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(config.libs.js.dest));
});
gulp.task('libs', ['libs:css', 'libs:js']);
// Task for Browser Sync
gulp.task('browserSync',['libs', 'sass', 'jade', 'img', 'indexTask', 'js'], function(){
	browserSync.init({
		notify: false,
		server: {
			baseDir: config.browserSync.options.baseDir
		},
		ghostMode: {
			clicks: true,
			forms: true,
			scroll: true
		}
	});
});

// Task for styles
gulp.task('sass', function(){
	return gulp.src(config.sass.src)
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle:'expanded'}).on('error', sass.logError))
		.pipe(autoprefixer({browsers: ['last 2 versions'], cascade: false}))
		.pipe(gulp.dest(config.sass.options.intermd))
		.pipe(rename({basename: config.js.options.basename, suffix: '.min'}))
		.pipe(minifyCss())
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest(config.sass.dest))
		.pipe(browserSync.stream());
});


// Task for javascript files
gulp.task('js', function(){
	return gulp.src(config.js.src)
		.pipe(sourcemaps.init())
		.pipe(concat(config.js.options.basename+".js"))
		.pipe(gulp.dest(config.js.options.intermd))
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(uglify())
		.on('error', err)
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(config.js.dest))
		.pipe(gzip({append: true}))
		.pipe(gulp.dest(config.js.dest))
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest(config.js.dest))
		.pipe(reload({stream: true}));
});

// Task for Jade to HTML
gulp.task('jade', function(){
	return gulp.src(config.jade.src)
		.pipe(jade({pretty: true}))
		.on('error', err)
		.pipe(gulp.dest(config.jade.dest))
		.pipe(reload({stream: true}));
});

// Task for image minification
gulp.task('img', function(){
	return gulp.src(config.img.src)
		.pipe(cache(imagemin({optimizationLevel: 10, progressive: true, interlaced: true})))
		.pipe(gulp.dest(config.img.dest))
		.pipe(reload({stream: true}));
});

// Task for cleanup
gulp.task('clean', function(){
	return del('app/');
});

// Root Task
gulp.task('indexTask', function(){
	return gulp.src(config.src+"/index.jade")
		.pipe(jade({pretty: true}))
		.pipe(gulp.dest(config.dest))
		.pipe(reload({stream: true}));
});

// Now set the default task
gulp.task('default',['browserSync', 'watch']);

// Set up for watches
gulp.task('watch', function(){
	gulp.watch(config.sass.watchSrc, ['sass']);
	gulp.watch(config.js.src, ['js']);
	gulp.watch(config.jade.src, ['jade']);
	gulp.watch([config.src+"/index.jade", config.src+"/jade/includes/**/*.jade"],['indexTask']);
});


// error
function err(e){
	console.log(e.message);
	this.emit('end');
}
