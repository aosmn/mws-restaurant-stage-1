const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify');
// const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');

gulp.task('default', ['copy-html', 'copy-images', 'copy-styles'],
	function() {
		// gulp.watch('js/**/*.js', ['lint']);
		gulp.watch('./index.html', ['copy-html']);

		browserSync.init({
			server: './dist'
		});

		gulp.watch('./dist/index.html')
			.on('change', browserSync.reload);
	});

gulp.task('copy-html', function() {
	gulp.src('./index.html')
		.pipe(gulp.dest('./dist'));
});
gulp.task('copy-images', function() {
	gulp.src('./img/*')
		.pipe(gulp.dest('./dist/img'));
});
gulp.task('copy-styles', function(){
	gulp.src('css/**/*.css')
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(gulp.dest('./dist/css'));
});

// gulp.task('scripts', function() {
// 	gulp.src('./d/**/*.js')
// 		.pipe(sourcemaps.init())
// 		.pipe(babel({
// 			presets: ['@babel/env']
// 		}))
// 		.pipe(sourcemaps.write())
// 		.pipe(gulp.dest('./dist/js'));
// });

gulp.task('scripts-dist', function() {
	gulp.src('js/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./dist/js'));
});
gulp.task('crunch-images', function() {
	gulp.src('./img/*')
		.pipe(imagemin({
			progressive: true,
			use: [pngquant()]
		}))
		.pipe(gulp.dest('dist/img'));
});

gulp.task('dist', ['copy-html',
	'copy-images',
	'styles',
	'lint',
	'scripts-dist',
	'crunch-images']);