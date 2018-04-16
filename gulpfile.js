// 引入定义工具
var gulp = require('gulp');
var concat = require('gulp-concat');
// less 编译用到
var less = require('gulp-less');
// 压缩css
var minifyCss = require('gulp-minify-css');
// 压缩js
var annotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
// 动态刷新
var browserSync = require('browser-sync');
var opn = require('opn');
// 定义路径
var path = {
    less: './src/app/components/**/*.less',
    css: './src/css/**/*.css',
    js: './src/app/**/*.js',
    html: './src/app/components/**/*.html',
    src: './'
};
//合并html模板命令--gulp template
var templateCache = require('gulp-angular-templatecache');
gulp.task('template', function () {
     gulp.src(path.html)
        .pipe(templateCache({module: 'templates'}))
        .pipe(gulp.dest('./src/js'));
});
gulp.task('less', function(){
    gulp.src(path.less)
        .pipe(less())
        .pipe(minifyCss())
        .pipe(concat('build.min.css'))
        .pipe(gulp.dest('./src/css'))
        .pipe(browserSync.stream());
});
gulp.task('js', function () {
    return gulp.src(path.js)
        .pipe(annotate({single_quotes: true}))
        .pipe(uglify())
        .pipe(concat('build.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./src/js'));
});
gulp.task('serve',['less', 'js'], function(){
    browserSync.init({
        server:{
            baseDir: path.src
        },
        port:3000,
        open:false
    }, function(){
        var homepage = 'http://localhost:3000/';
        opn(homepage);
    });

    // 编译完less后，无刷新方式更新页面
    gulp.watch(path.less, ['less']);

    gulp.watch(path.js, ['js']);
    // 修改页面和js后，页面刷新，重新加载
    gulp.watch([path.html, path.js]).on("change", function() {
        browserSync.reload();
    });
});
