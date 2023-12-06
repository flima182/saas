const { series } = require('gulp')
const gulp = require('gulp')
const concat = require('gulp-concat')
const cssmin = require('gulp-cssmin')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')
const image = require('gulp-image')
const htmlmin = require('gulp-htmlmin')
const stripJs = require('gulp-strip-comments')
const stripCss = require('gulp-strip-css-comments')
const babel = require('gulp-babel')
const browserSync = require('browser-sync').create()
const sass = require('gulp-sass') (require('node-sass'))
const reload = browserSync.reload


function tarefasCSS(cb) {

    gulp.src([
        './node_modules/bootstrap/dist/css/bootstrap.css',
        './node_modules/@fortawesome/fontawesome-free/css/fontawesome.css',
        './vendor/owl/css/owl.css',
        './vendor/jquery-ui/jquery-ui.css'
    ])
        .pipe(stripCss())                    // remove comentários
        .pipe(concat('libs.css'))            // mescla arquivos
        .pipe(cssmin())                      // minifica css
        .pipe(rename({ suffix: '.min' }))    // libs.min.css
        .pipe(gulp.dest('./dist/css'))      // cria arquivo em novo diretório

    cb()

}


function taferasSASS(cb) {

    gulp.src('./src/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./dist/css'))

    cb()

}

function tarefasJS(cb) {

    gulp.src([
        './node_modules/jquery/dist/jquery.js',
        './node_modules/bootstrap/dist/js/bootstrap.js',
        './vendor/owl/js/owl.js',
        './vendor/jquery-mask/jquery.mask.js',
        //'./vendor/jquery-ui/jquery-ui.js',
        './src/js/custom.js'
    ])

        .pipe(babel({
            comments: false,
            presets: ['@babel/env']
        }))                                  

        .pipe(concat('scripts.js'))         // mescla arquivos
        .pipe(uglify())                     // minifica js
        .pipe(rename({ suffix: '.min' }))    // scripts.min.js
        .pipe(gulp.dest('./dist/js'))       // cria arquivo em novo diretório

    cb()
}



function tarefasImagem() {

    return gulp.src('./src/images/*')
        .pipe(image({
            pngquant: true,
            optipng: false,
            zopflipng: true,
            jpegRecompress: false,
            mozjpeg: true,
            gifsicle: true,
            svgo: true,
            concurrent: 10,
            quiet: true
        }))
        .pipe(gulp.dest('./dist/images'))
}


function tarefasHTML(callback) {
    gulp.src('./src/**/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./dist'))

    return callback()
}

gulp.task('serve', function(){

    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    })
    gulp.watch('./src/**/*').on('change', process)
    gulp.watch('./src/**/*').on('change', reload)
})

function end(cb){
    console.log('tarefas concluídas')
    return cb()
}


const process = series(tarefasHTML, tarefasJS, tarefasCSS, taferasSASS, end)

exports.styles = tarefasCSS
exports.scripts = tarefasJS
exports.images = tarefasImagem
exports.sass = taferasSASS


exports.default = process