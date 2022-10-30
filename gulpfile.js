const gulp = require("gulp");
const del = require("del");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
// const autoprefixer = require('gulp-autoprefixer');
const posthtml = require("gulp-posthtml");
const include = require("posthtml-include");
const rename = require("gulp-rename");
const svgstore = require("gulp-svgstore");
const sync = require("browser-sync").create();

const clean = () => {
    return del("build");
}

const copy = () => {
    return gulp.src([
        "source/fonts/**",
        "source/img/**",
        "source/js/**"
      ], {
        base: "source"
      })
      .pipe(gulp.dest("build"));
}

const styles = () => {
    return gulp
        .src("source/less/style.less")
        .pipe(plumber())
        .pipe(sourcemap.init())
        .pipe(less())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(sourcemap.write("."))
        .pipe(gulp.dest("build/css"))
        .pipe(sync.stream());
};

const sprite = () => {
    return gulp.src("source/img/*.svg")
        .pipe(svgstore({
            inlineSvg: true
        }))
        .pipe(rename("sprite.svg"))
        .pipe(gulp.dest("build/img"));
}

const html = () => {
    return gulp.src("source/*.html")
        .pipe(posthtml([
            include()
        ]))
        .pipe(gulp.dest("build"));
}

const server = () => {
    sync.init({
        server: {
            baseDir: "build",
        },
        cors: true,
        notify: false,
        ui: false,
    });

    gulp.watch("source/less/**/*.less", gulp.series(styles));
    gulp.watch("source/*.html").on("change", gulp.series(html, sync.reload));
};

exports.default = gulp.series(clean, copy, styles, sprite, html, server);
