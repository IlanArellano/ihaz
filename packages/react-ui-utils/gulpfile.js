import gulp from "gulp";
import rename from "gulp-rename";

gulp.task("copy-d.ts", function () {
  return gulp
    .src(process.env.INPUT_DIR + "**/*.d.ts")
    .pipe(
      rename(function (path) {
        path.basename = path.basename.toLowerCase();
      })
    )
    .pipe(gulp.dest("./" + process.env.OUTPUT_DIR));
});

gulp.task("build-readme", function () {
  return gulp.src("README.md").pipe(gulp.dest(process.env.OUTPUT_DIR));
});

gulp.task("build-licence", function () {
  return gulp.src("../../LICENSE.md").pipe(gulp.dest(process.env.OUTPUT_DIR));
});

gulp.task("copy-package.json", function () {
  return gulp
    .src(process.env.INPUT_DIR + "**/package.json")
    .pipe(gulp.dest("./" + process.env.OUTPUT_DIR));
});

gulp.task(
  "copy-files",
  gulp.series("copy-d.ts", "copy-package.json", "build-readme", "build-licence")
);
