// old
// var gulp = require('gulp');
// new
const { task, series, parallel, watch } = require('gulp');
const gulp             = require('gulp');
const jspOut           = true; // 콘텐트(cts)생성
const sourcemaps       = require('gulp-sourcemaps');
// const sass             = require('gulp-sass');
const sass = require('gulp-sass')(require('sass'));
const browserSync      = require('browser-sync').create();
const autoprefixer     = require('gulp-autoprefixer');
const headerfooter     = require('gulp-headerfooter');
const rename           = require('gulp-rename');
// const imageResize      = require('gulp-image-resize');
const reload           = browserSync.reload;
const scssOptions = {
  errLogToConsole: true,
  outputStyle : "compressed",
  indentType : "space", // space tab
  indentWidth : 0, // outputStyle 이 nested, expanded 인 경우에 사용
  precision: 6, //Default : 5 CSS 의 소수점 자리수
  sourceComments: true
};
// https://browsersync.io/docs/options
function servers() {
	browserSync.init({
		server: {
			baseDir: './',
			index: 'static/guide/index.html',
		},
		port: 3000,
	});
}
const scss = ['fss'];
function scssTocss(targets) {
	gulp.src('static/' + targets + '/scss/*.scss')
		.pipe(sourcemaps.init({ loadMaps: false }))
		.pipe(sass(scssOptions).on('error', sass.logError))
		.pipe(sourcemaps.write('./'))
		//.pipe(removeEmptyLines())
		.pipe(gulp.dest('static/' + targets + '/css/'))
		.pipe(browserSync.stream());
}
function nmcscss(kk) {
	console.log(kk, scss[kk], '← 프로젝트 구동...' , 'static/' + scss[kk] + '/scss/*.scss');
	watch('./static/' + scss[kk] + '/scss/*.scss').on('change', function (event) {
		console.log(scss[kk], 'scss[kk]===');
		scssTocss(scss[kk]);
	});
}
for (var i = scss.length - 1; i >= 0; i--) {
	nmcscss(i);
}

function waths(){
	console.log('waths 시작')
	// html
	// watchLibrary('front');
	watchLibraryReload('nmc');
	// watchContent('sign');
	watchLibrary('nmc');
	watchContent('nmc');
}

function watchLibraryReload(targets) {
	watch('**/*.{html,css,js}').on('change', function (event) {
		// console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
		browserSync.reload();
	});
}

const Vinyl = require('vinyl');

function watchLibrary(targets) {
	const watcher = watch(['static/guide/' + targets + '/lib/*.html']);
	watcher.on('change', function(paths, stats) {
		const file = new Vinyl({
			path: paths
		});
		gulp.src(file.dirname + '/' + file.stem + file.extname)
			.pipe(headerfooter.header('static/guide/' + targets + '/top.html'))
			.pipe(headerfooter.footer('static/guide/' + targets + '/bottom.html'))
			.pipe(gulp.dest('static/guide/' + targets + '/dist'));
	});
}
function watchContent(targets) {
	const watcher = watch('static/guide/' + targets + '/content/*.html')
	watcher.on('change', function (paths, stats) {
		const file = new Vinyl({
			path: paths,
		});
		gulp.src(file.dirname + '/' + file.stem + file.extname)
			.pipe(headerfooter.header('static/guide/' + targets + '/top.html'))
			.pipe(headerfooter.footer('static/guide/' + targets + '/bottom.html'))
			.pipe(gulp.dest('static/guide/' + targets + '/dist'));
		if (jspOut) {
			gulp.src(file.dirname + '/' + file.stem + file.extname)
				.pipe(headerfooter.header('<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>'))
				.pipe(rename({ extname: '.jsp' }))
				.pipe(gulp.dest('WEB-INF/jsp/cts/' + targets + '/'));
		}
	});
}

// exports.nmcscss = nmcscss;
exports.default = series(parallel(servers, waths));
// exports.default = series(clean, parallel(html, watchFiles));
exports.server = series(servers);
/*
Gulp 4.0 에서는 Task 실행 순서를 통제할 수 있는 API를 제공한다. 따라서 앞으로 run-sequence 모듈을 사용하지 않아도 된다.
parallel 함수는 Task를 병렬로 실행하는데 기존 gulp.task(‘build’, [‘html’, ‘css’]); 방식의 실행 순서에 대응된다.


console.log(`                                                   tttt                                hhhhhhh
                                                ttt:::t                                h:::::h
                                                t:::::t                                h:::::h
                                                t:::::t                                h:::::h
   ggggggggg   ggggg   ooooooooooo        ttttttt:::::ttttttt       ooooooooooo         h::::h hhhhh          ooooooooooo      mmmmmmm    mmmmmmm       eeeeeeeeeeee
  g:::::::::ggg::::g oo:::::::::::oo      t:::::::::::::::::t     oo:::::::::::oo       h::::hh:::::hhh     oo:::::::::::oo  mm:::::::m  m:::::::mm   ee::::::::::::ee
 g:::::::::::::::::go:::::::::::::::o     t:::::::::::::::::t    o:::::::::::::::o      h::::::::::::::hh  o:::::::::::::::om::::::::::mm::::::::::m e::::::eeeee:::::ee
g::::::ggggg::::::ggo:::::ooooo:::::o     tttttt:::::::tttttt    o:::::ooooo:::::o      h:::::::hhh::::::h o:::::ooooo:::::om::::::::::::::::::::::me::::::e     e:::::e
g:::::g     g:::::g o::::o     o::::o           t:::::t          o::::o     o::::o      h::::::h   h::::::ho::::o     o::::om:::::mmm::::::mmm:::::me:::::::eeeee::::::e
g:::::g     g:::::g o::::o     o::::o           t:::::t          o::::o     o::::o      h:::::h     h:::::ho::::o     o::::om::::m   m::::m   m::::me:::::::::::::::::e
g:::::g     g:::::g o::::o     o::::o           t:::::t          o::::o     o::::o      h:::::h     h:::::ho::::o     o::::om::::m   m::::m   m::::me::::::eeeeeeeeeee
g::::::g    g:::::g o::::o     o::::o           t:::::t    tttttto::::o     o::::o      h:::::h     h:::::ho::::o     o::::om::::m   m::::m   m::::me:::::::e
g:::::::ggggg:::::g o:::::ooooo:::::o           t::::::tttt:::::to:::::ooooo:::::o      h:::::h     h:::::ho:::::ooooo:::::om::::m   m::::m   m::::me::::::::e
 g::::::::::::::::g o:::::::::::::::o           tt::::::::::::::to:::::::::::::::o      h:::::h     h:::::ho:::::::::::::::om::::m   m::::m   m::::m e::::::::eeeeeeee
  gg::::::::::::::g  oo:::::::::::oo              tt:::::::::::tt oo:::::::::::oo       h:::::h     h:::::h oo:::::::::::oo m::::m   m::::m   m::::m  ee:::::::::::::e
    gggggggg::::::g    ooooooooooo                  ttttttttttt     ooooooooooo         hhhhhhh     hhhhhhh   ooooooooooo   mmmmmm   mmmmmm   mmmmmm    eeeeeeeeeeeeee
            g:::::g
gggggg      g:::::g
g:::::gg   gg:::::g
 g::::::ggg:::::::g
  gg:::::::::::::g
    ggg::::::ggg
	   gggggg`);
*/