const gulp = require("gulp");
const babel = require("gulp-babel");
const sourcemaps = require("gulp-sourcemaps");

gulp.task("default", () =>
  gulp
    .src("./react-navigation-config/**/*.js")
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./dist"))
);
