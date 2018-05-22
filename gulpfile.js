var gulp = require('gulp');
var clean = require('gulp-clean'); // 清除文件
var cssmin = require('gulp-clean-css'); // css压缩
var htmlmin = require('gulp-htmlmin'); // html压缩
var rename = require('gulp-rename'); // 重命名
var uglify = require('gulp-uglify'); // js压缩
var sass = require('gulp-sass'); // sass => css
var concat = require('gulp-concat'); // 合并文件
var babel = require('gulp-babel'); // es6 => es5
var imagemin = require('gulp-imagemin'); // 压缩 image

var src_path = 'app/'; // 文件来源路径
var dest_path = 'build/'; // 输出文件路径
var env = 'dev'; // 判断当前环境是开发还是生产 pro,需要手动改
var env_dest_path = env === 'dev' ? src_path + 'public' : dest_path + 'public';

/*
** 为了统一路径，开发环境下和生产环境下 各自生成一个 public 文件夹 用来存放编译过后的 js 和 css
** 其中 css 都为压缩过的，js 在 dev环境下未压缩，方便调试，pro环境下压缩 js 和 images
** 如果后面有需求在该框架下有多个项目，可以在 app 下以项目名新建文件夹，重新修改 gulpfie.js 的配置，提取公共部分出来，任务以项目名做区分
*/

gulp.task('sass', function(){ // 仅编译sass
    return gulp.src(src_path + 'sass/*.scss')
    .pipe(sass())
    .pipe(gulp.dest(dest_path + 'css'));
});

gulp.task('concatCss', function(){ // 编译并压缩sass
    return gulp.src(src_path + 'sass/*.scss')
    .pipe(concat('main.min.css'))
    .pipe(cssmin())
    .pipe(gulp.dest(env_dest_path))
});

gulp.task('concatJs', function(){ // 仅合并JS
    return gulp.src(src_path + 'js/*.js')
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(concat('main.js'))
    .pipe(gulp.dest(env_dest_path))
});

gulp.task('uglifyJs', function(){ // 合并并压缩JS
    return gulp.src(src_path + 'js/*.js')
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest(env_dest_path))
});

gulp.task('imagemin', function(){
    return gulp.src(src_path + 'images/*')
    .pipe(imagemin())
    .pipe(gulp.dest(dest_path + 'images'));
});

gulp.task('htmlmin', function(){ // 压缩 html
    return gulp.src(src_path + '*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(dest_path))
});

gulp.task('watch', function(){ // 监听文件变化
    gulp.watch(src_path + 'sass/*.scss', ['concatCss']);
    gulp.watch(src_path + 'js/*.js', ['concatJs']);
});

gulp.task('clean', function(){
    return gulp.src(dest_path)
    .pipe(clean())
});

gulp.task('dev', ['watch'], function(){
    console.log('gulp dev is starting...')
});

gulp.task('build', ['concatCss', 'uglifyJs', 'imagemin', 'htmlmin'], function(){
    console.log('gulp build is starting...')
});



