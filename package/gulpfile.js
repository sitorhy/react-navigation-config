const path = require("path");
const fs = require("fs");
const gulp = require("gulp");
const babel = require("gulp-babel");

const testbed_dir = path.join(path.resolve("../"), "testbed");

gulp.task("build",()=>{
    return gulp
        .src(["src/**/*.js"])
        .pipe(
            babel()
        )
        .pipe(gulp.dest("./dist"));
})

gulp.task("deploy",()=>{
    return gulp
        .src(["src/**/*.js"])
        .pipe(
            babel()
        )
        .pipe(gulp.dest(path.join(testbed_dir, "react-navigation-config")));
})

gulp.task("default", async () =>
{
    const json = require("./package.json");
    delete json.devDependencies;
    delete json.scripts;
    if (!fs.existsSync("./dist"))
    {
        fs.mkdirSync("./dist");
    }
    fs.writeFileSync("./dist/package.json", JSON.stringify(json, null, 2));
    gulp.src(path.join(path.resolve("../"), "*.md")).pipe(gulp.dest("./dist"));
    return gulp.series("build","deploy");
});

gulp.task("dev", () => gulp.watch("src/**/*.js")
    .on("change", async () =>
    {
        return gulp
            .src(["src/**/*.js"])
            .pipe(
                babel()
            )
            .pipe(gulp.dest(path.join(testbed_dir, "react-navigation-config")));
    })
    .on("add", async () =>
    {
        return gulp
            .src(["src/**/*.js"])
            .pipe(
                babel()
            )
            .pipe(gulp.dest(path.join(testbed_dir, "react-navigation-config")));
    })
);
