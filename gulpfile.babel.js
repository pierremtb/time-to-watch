import gulp from 'gulp';
import babel from 'gulp-babel';
import del from 'del';
import runSequence from 'run-sequence';

const config = {
  paths: {
    js: {
      src: 'src/**/*.js',
      dist: 'dist/',
    },
  },
};

gulp.task('clean', () =>
  del(config.paths.js.dist)
);

gulp.task('babel', ['babel-src']);

gulp.task('babel-src', [], () =>
  gulp.src(config.paths.js.src)
    .pipe(babel())
    .pipe(gulp.dest(config.paths.js.dist))
);

gulp.task('watch', () => {
  gulp.watch(config.paths.js.src, ['babel-src']);
});

// Default Task
gulp.task('default', () =>
  runSequence('clean', ['babel'])
);
