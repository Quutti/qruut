const gulp = require("gulp");
const typescript = require("gulp-typescript");
const clean = require("gulp-clean");
const merge = require("merge2");

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

function copyCss() {
    return gulp.src(getSrc("css"))
        .pipe(gulp.dest(dest, { base: "." }));
}

function copyJs() {
    return gulp.src(getSrc("js"))
        .pipe(gulp.dest(dest, { base: "." }));
}

gulp.task("build", ["clean"], () => {
    return merge([
        compileTypescript(),
        copyJs(),
        copyCss()
    ]);
});

gulp.task("clean", () => {
    return gulp.src(dest, { read: false })
        .pipe(clean({ force: true }));
});