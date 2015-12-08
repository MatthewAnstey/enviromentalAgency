var browserify = require('browserify');
var gulp = require('gulp');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var buffer = require("vinyl-buffer");
var watch = require('gulp-watch');
var cssmin = require('gulp-cssmin');
var uncss = require('gulp-uncss');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var mustache = require("gulp-mustache-plus");
var browserSync = require('browser-sync').create();
var nodemon = require('gulp-nodemon');
var sourcemaps = require('gulp-sourcemaps');
var sitemap = require('gulp-sitemap');
var reload = browserSync.reload;

function mustachePipe() {
    return gulp.src('./templates/*.mustache')
        .pipe(mustache({}, {}, {
            head : './templates/partials/head.mustache',
            navigation : './templates/partials/navigation.mustache', 
            scripts : './templates/partials/scripts.mustache',
            config : './templates/partials/config.mustache'
        }))
        .pipe(gulp.dest('./public/'));
}

function sassPipe() {
    return gulp.src('./public/sass/*.scss')
        .pipe(sass())
        .pipe(uncss({
            html: ['./public/*.html'],
            ignore  : ['.parsley-errors-list', '.collapse.in', '.collapsing'],
         }))
        .pipe(cssmin())
        .pipe(gulp.dest('./public/css/main/'));
}

function browserifyPipe() {
    return browserify(['./public/javascript/App.js'], { debug : true })
        .bundle()
        .pipe(source('./bundle.js')) 
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./public/'))
        .pipe(gulp.dest('./public/build/'));
}


gulp.task('default', ['build'] , function () {
    gulp.start('demon');    
});

gulp.task('build', function () {
    gulp.start('mustache');
    gulp.start('sass');
    gulp.start('browserify');
})
 
gulp.task('mustache', mustachePipe);

gulp.task('mustache-reload', function () {
    return mustachePipe().pipe(reload({stream: true}));
});

gulp.task('sass', sassPipe);   

gulp.task('sass-reload', function () {
    return sassPipe().pipe(reload({stream: true}));  
});   

gulp.task('browserify-reload', function() {
    return browserifyPipe()
    .pipe(reload({stream: true}));
});

gulp.task('browserify', function() {
    return browserifyPipe();
});

gulp.task('browserify:production', function() {
    return browserify(['./public/javascript/App.js'])
    .bundle()
    .pipe(source('./bundle.js')) 
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./public/build/'));    
});

gulp.task('vaildate', function() {
  return gulp.src('./public/javascript/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default')); 
});

gulp.task('watch', function () {
    watch('./public/javascript/*.js', function () {
        gulp.start('vaildate');
        gulp.start('browserify-reload');
    });
    watch('./public/sass/*.scss', function () {
        gulp.start('sass-reload');
    });
    watch('./templates/**/*.mustache' , function () {
        gulp.start('mustache-reload');
    });
});    

gulp.task('sitemap', function () {
    gulp.src('public/*.html')
        .pipe(sitemap({
            siteUrl: 'http://localhost:7000/'
        }))
        .pipe(gulp.dest('./public'));
});

gulp.task('browser-sync', function () {
    browserSync.init({
        proxy: "http://localhost:3010/", 
        port: 7000
    });
    gulp.start('watch');
});

gulp.task('demon', function () {
    nodemon({ 
        script: 'server.js',
        ext: 'js'
    })
    .on('start', ['browser-sync'])
    .on('change', ['watch']);
});