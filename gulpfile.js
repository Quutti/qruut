const gulp = require("gulp");
const typescript = require("gulp-typescript");
const clean = require("gulp-clean");
const merge = require("merge2");
const babel = require("gulp-babel");

const src = "./src";
const dest = "./dist";

function getSrc(ext) {
    ext = Array.isArray(ext) ? ext : [ext];
    return ext.map(e => `${src}/**/*.${e}`);
}

function compileTypescript() {
    const tsProject = typescript.createProject("./src/tsconfig.json");
    return gulp.src(getSrc(["ts", "tsx"]))
        .pipe(tsProject())
        .pipe(gulp.dest(dest, { base: "." }))
};

function compileJavascript() {
    const babelOptions = {
        presets: ['env']
    }

    return gulp.src(getSrc("js"))
        .pipe(babel(babelOptions))
        .pipe(gulp.dest(dest, { base: "." }))
}

function copyResources() {
    return gulp.src([...getSrc("css"), ...getSrc("d.ts")])
        .pipe(gulp.dest(dest, { base: "." }));
}

gulp.task("build", ["clean"], () => {
    return merge([compileTypescript(), compileJavascript(), copyResources()]);
});

gulp.task("clean", () => {
    return gulp.src(dest, { read: false })
        .pipe(clean({ force: true }));
});