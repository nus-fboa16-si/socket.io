const gulp = require('gulp');
const mocha = require('gulp-mocha');
const istanbul = require('gulp-istanbul');
const babel = require("gulp-babel");
const help = require("gulp-task-listing");
const eslint = require("gulp-eslint");
const del = require("del");

gulp.task("help", help);

gulp.task("default", ["lint", "test", "transpile"]);

gulp.task("lint", function () {
  return gulp.src(["**/*.js", "!node_modules/**", "!examples/**"])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

// By default, individual js files are transformed by babel and exported to /dist
const TRANSPILE_DEST_DIR = "./dist";
gulp.task("transpile", function () {
  return gulp.src("lib/*.js")
    .pipe(babel({ "presets": ["es2015"] }))
    .pipe(gulp.dest(TRANSPILE_DEST_DIR));
});

gulp.task("clean", function () {
  return del([TRANSPILE_DEST_DIR]);
});

gulp.task('test', function(){
  return gulp.src('test/*.js', {read: false})
    .pipe(mocha({
      timeout: 2000,
      reporter: 'dot',
      bail: true
    }))
    .once('error', function () {
      process.exit(1);
    })
    .once('end', function () {
      process.exit();
    });
});

gulp.task('istanbul-pre-test', function () {
  return gulp.src(['lib/**/*.js'])
    // Covering files
    .pipe(istanbul())
    // Force `require` to return covered files
    .pipe(istanbul.hookRequire());
});

gulp.task('test-cov', ['istanbul-pre-test'], function(){
  return gulp.src(['test/socket.io.js'])
    .pipe(mocha({
      reporter: 'dot'
    }))
    .pipe(istanbul.writeReports())
    .once('error', function (){
      process.exit(1);
    })
    .once('end', function (){
      process.exit();
    });
});
