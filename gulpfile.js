const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const browserSync = require('browser-sync').create();
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const gcmq = require('gulp-group-css-media-queries');
const sass = require('gulp-sass');
const rigger = require('gulp-rigger');


const isDev = true;
const isProd = !isDev;


function clear(){
    return del('build/*');
}

function styles (){
    return gulp.src ('./src/sass/**/*.+(scss|sass|css)')  //берем стайл.сасс
        .pipe(gulpif(isDev, sourcemaps.init()))  // инициализируем соурсмап
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError)) // делаем из сасс цсс
        .pipe(gcmq())  //группируем медиа запросы
        .pipe(autoprefixer({ // расставляеп префиксы
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulpif(isProd, cleanCSS({ // минифицируем цсс
            level: 2
        })))
        .pipe(gulpif(isDev, sourcemaps.write())) // вставляем соурсмеп
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream());
}

function img (){
    return gulp.src ('./src/img/**/*')
        .pipe(gulp.dest('./build/img'))
}

function html(){
    return gulp.src('./src/*.html')
               .pipe(rigger())
               .pipe(gulp.dest('./build'))
               .pipe(browserSync.stream());
}

function fonts(){
    return gulp.src ('./src/fonts/**/*')
        .pipe(gulp.dest('./build/fonts'))
}

function watch(){

    browserSync.init({
        server: {
            baseDir: "./build/",
            directory: true
        }
    });

    gulp.watch('./src/css/**/*.css', styles) //наблюдает за цсс, делает функцию стайлс при любом изменении в файле
    gulp.watch('./src/sass/**/*.sass', styles)
    gulp.watch('./src/**/*.html', html);
    gulp.watch('./src/img/**/*', img);
}

// function grid(done){

//     delete require.cache[require.resolve('./smartgrid.js')];

//     let settings = require('./smartgrid.js');

//     smartgrid('./src/css', settings);
//     done(); 
// }

let build = gulp.series(clear,
    gulp.parallel(styles, img, html, fonts))


gulp.task('bld', gulp.series(build))
gulp.task('watch', gulp.series(build, watch))

// gulp.task('grid', grid)



// gulp.task('css', styles)
// gulp.task('img', img)
// gulp.task('html', html)
// gulp.task('clr', clear)