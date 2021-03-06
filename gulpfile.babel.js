'use strict';

import gulp from 'gulp';
// Loads the plugins without having to list all of them, but you need
// to call them as $.pluginname
import gulpLoadPlugins from 'gulp-load-plugins';
const $ = gulpLoadPlugins();
// Delete stuff
import del from 'del';
// Used to run shell commands
import shell from 'shelljs';
// BrowserSync is used to live-reload your website
import browserSync from 'browser-sync';
const reload = browserSync.reload;
// AutoPrefixer
import autoprefixer from 'autoprefixer';
// Yargs for command line arguments
import {argv} from 'yargs';
// Bourbon & Neat
import neat from 'node-neat';


//
// FOR SURGE
//
gulp.task('CNAME', () =>
  gulp.src([
    'CNAME'
  ])
    .pipe(gulp.dest('dist'))
);

// 'gulp clean:assets' -- deletes all assets except for images
// 'gulp clean:images' -- deletes your images
// 'gulp clean:dist' -- erases the dist folder
// 'gulp clean:gzip' -- erases all the gzipped files
// 'gulp clean:metadata' -- deletes the metadata file for Jekyll
gulp.task('clean:assets', () => {
  return del(['.tmp/**/*', '!.tmp/assets', '!.tmp/assets/images', '!.tmp/assets/images/**/*', 'dist/assets']);
});
gulp.task('clean:images', () => {
  return del(['.tmp/assets/images', 'dist/assets/images']);
});
gulp.task('clean:uploads', () => {
  return del(['.tmp/uploads', 'dist/uploads']);
});
gulp.task('clean:dist', () => {
  return del(['dist/']);
});
gulp.task('clean:gzip', () => {
  return del(['dist/**/*.gz']);
});
gulp.task('clean:metadata', () => {
  return del(['src/.jekyll-metadata']);
});

// 'gulp jekyll' -- builds your site with development settings
// 'gulp jekyll --prod' -- builds your site with production settings
gulp.task('jekyll', done => {
  if (!argv.prod) {
    shell.exec('jekyll build');
    done();
  } else if (argv.prod) {
    shell.exec('jekyll build --config _config.yml,_config.build.yml');
    done();
  }
});

// 'gulp doctor' -- literally just runs jekyll doctor
gulp.task('jekyll:doctor', done => {
  shell.exec('jekyll doctor');
  done();
});

// 'gulp styles' -- creates a CSS file from your SASS, adds prefixes and
// creates a Sourcemap
// 'gulp styles --prod' -- creates a CSS file from your SASS, adds prefixes and
// then minifies, gzips and cache busts it. Does not create a Sourcemap
gulp.task('styles', () =>
  gulp.src('src/assets/scss/style.scss')
    .pipe($.if(!argv.prod, $.sourcemaps.init()))
    .pipe($.sass({
      precision: 10,
      includePaths: neat.includePaths
    }).on('error', $.sass.logError))
    .pipe($.postcss([
      autoprefixer({browsers: 'last 2 versions'})
    ]))
    .pipe($.size({
      title: 'styles',
      showFiles: true
    }))
    .pipe($.if(argv.prod, $.rename({suffix: '.min'})))
    .pipe($.if(argv.prod, $.if('*.css', $.cssnano({autoprefixer: false}))))
    .pipe($.if(argv.prod, $.size({
      title: 'minified styles',
      showFiles: true
    })))
    // .pipe($.if(argv.prod, $.rev()))
    .pipe($.if(!argv.prod, $.sourcemaps.write('.')))
    .pipe($.if(argv.prod, gulp.dest('.tmp/assets/stylesheets')))
    .pipe($.if(argv.prod, gulp.dest('src/assets/stylesheets'))) // for cloudcannon
    .pipe($.if(argv.prod, $.if('*.css', $.gzip({append: true}))))
    .pipe($.if(argv.prod, $.size({
      title: 'gzipped styles',
      gzip: true,
      showFiles: true
    })))
    .pipe(gulp.dest('.tmp/assets/stylesheets'))
    .pipe(gulp.dest('src/assets/stylesheets')) // for cloudcannon
    .pipe($.if(!argv.prod, browserSync.stream({match: '**/*.css'})))
);

// 'gulp scripts' -- creates a index.js file from your JavaScript files and
// creates a Sourcemap for it
// 'gulp scripts --prod' -- creates a index.js file from your JavaScript files,
// minifies, gzips and cache busts it. Does not create a Sourcemap
gulp.task('scripts', () =>
  // NOTE: The order here is important since it's concatenated in order from
  // top to bottom, so you want vendor scripts etc on top
  gulp.src([
    'node_modules/jquery/dist/jquery.js',
    'node_modules/imgix.js/dist/imgix.js',
    'node_modules/enquire.js/dist/enquire.js',
    'src/assets/javascript/dev/flickity.min.js',
    'src/assets/javascript/dev/vendor.js',
    'src/assets/javascript/dev/main.js'
  ])
    .pipe($.newer('.tmp/assets/javascript/index.js', {dest: '.tmp/assets/javascript', ext: '.js'}))
    .pipe($.if(!argv.prod, $.sourcemaps.init()))
    .pipe($.concat('index.js'))
    .pipe($.size({
      title: 'scripts',
      showFiles: true
    }))
    .pipe($.if(argv.prod, $.rename({suffix: '.min'})))
    .pipe($.if(argv.prod, $.if('*.js', $.uglify({preserveComments: 'some'}))))
    .pipe($.if(argv.prod, $.size({
      title: 'minified scripts',
      showFiles: true
    })))
    // .pipe($.if(argv.prod, $.rev()))
    .pipe($.if(!argv.prod, $.sourcemaps.write('.')))
    .pipe($.if(argv.prod, gulp.dest('.tmp/assets/javascript')))
    .pipe($.if(argv.prod, gulp.dest('src/assets/javascript'))) // for cloud cannon
    .pipe($.if(argv.prod, $.if('*.js', $.gzip({append: true}))))
    .pipe($.if(argv.prod, $.size({
      title: 'gzipped scripts',
      gzip: true,
      showFiles: true
    })))
    .pipe(gulp.dest('.tmp/assets/javascript'))
    .pipe(gulp.dest('src/assets/javascript')) // for cloud cannon
    .pipe($.if(!argv.prod, browserSync.stream({match: '**/*.js'})))
);

// 'gulp inject:head' -- injects our style.css file into the head of our HTML
gulp.task('inject:head', () =>
  gulp.src('src/_includes/global/head.html')
    .pipe($.inject(gulp.src('.tmp/assets/stylesheets/*.css',
                            {read: false}), {ignorePath: '.tmp'}))
    .pipe(gulp.dest('src/_includes/global'))
);

// inject index.js to necessary layouts
gulp.task('inject:default', () =>
  gulp.src('src/_layouts/default.html')
    .pipe($.inject(gulp.src('.tmp/assets/javascript/*.js',
                            {read: false}), {ignorePath: '.tmp'}))
    .pipe(gulp.dest('src/_layouts'))
);
gulp.task('inject:home', () =>
  gulp.src('src/_layouts/home.html')
    .pipe($.inject(gulp.src('.tmp/assets/javascript/*.js',
                            {read: false}), {ignorePath: '.tmp'}))
    .pipe(gulp.dest('src/_layouts'))
);
gulp.task('inject:project', () =>
  gulp.src('src/_layouts/project.html')
    .pipe($.inject(gulp.src('.tmp/assets/javascript/*.js',
                            {read: false}), {ignorePath: '.tmp'}))
    .pipe(gulp.dest('src/_layouts'))
);

// 'gulp images' -- optimizes and caches your images
gulp.task('images', () =>
  gulp.src('src/assets/images/**/*')
    // .pipe($.cache($.imagemin({
    //   progressive: true,
    //   interlaced: true
    // })))
    .pipe(gulp.dest('.tmp/assets/images'))
    .pipe(gulp.dest('src/assets/images')) // for cloud cannon
    // .pipe($.size({title: 'images'}))
);

// 'gulp uploads' -- copies uploads
gulp.task('uploads', () =>
  gulp.src('src/uploads/**/*')
    .pipe(gulp.dest('.tmp/uploads'))
    .pipe(gulp.dest('src/uploads')) // for cloud cannon
);

// 'gulp fonts' -- copies your fonts to the temporary assets folder
gulp.task('fonts', () =>
  gulp.src('src/assets/fonts/**/*')
    .pipe(gulp.dest('.tmp/assets/fonts'))
    .pipe(gulp.dest('src/assets/fonts')) // for cloud cannon
    .pipe($.size({title: 'fonts'}))
);

// 'gulp html' -- does nothing
// 'gulp html --prod' -- minifies and gzips our HTML files
gulp.task('html', () =>
  gulp.src('dist/**/*.html')
    .pipe($.if(argv.prod, $.htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true
    })))
    .pipe($.if(argv.prod, $.size({title: 'optimized HTML'})))
    .pipe($.if(argv.prod, gulp.dest('dist')))
    .pipe($.if(argv.prod, $.gzip({append: true})))
    .pipe($.if(argv.prod, $.size({
      title: 'gzipped HTML',
      gzip: true
    })))
    .pipe($.if(argv.prod, gulp.dest('dist')))
);

// 'gulp lint' -- check your JS for formatting errors using XO Space
gulp.task('lint', () =>
  gulp.src([
    'gulpfile.babel.js',
    '.tmp/assets/javascript/*.js',
    '!.tmp/assets/javascript/*.min.js'
  ])
  .pipe($.eslint())
  .pipe($.eslint.formatEach())
  .pipe($.eslint.failOnError())
);

// 'gulp serve' -- open up your website in your browser and watch for changes
// in all your files and update them when needed
gulp.task('serve', () => {
  browserSync({
    // tunnel: true,
    // open: false,
    server: {
      baseDir: ['.tmp', 'dist']
    }
  });

  // Watch various files for changes and do the needful
  gulp.watch(['src/**/*.md', 'src/**/*.html', 'src/**/*.yml'], gulp.series('jekyll', reload));
  gulp.watch(['src/**/*.xml', 'src/**/*.txt'], gulp.series('jekyll'));
  gulp.watch('src/assets/javascript/**/*.js', gulp.series('scripts'));
  gulp.watch('src/assets/scss/**/*.scss', gulp.series('styles'));
  gulp.watch('src/assets/images/**/*', reload);
  gulp.watch('src/uploads/**/*', reload);
});

// 'gulp assets' -- cleans out your assets and rebuilds them
// 'gulp assets --prod' -- cleans out your assets and rebuilds them with
// production settings
gulp.task('assets', gulp.series(
  gulp.series('clean:assets', 'clean:uploads'),
  gulp.parallel('styles', 'scripts', 'fonts', 'images', 'uploads')
));

// 'gulp assets:copy' -- copies the assets into the dist folder, needs to be
// done this way because Jekyll overwrites the whole folder otherwise
gulp.task('assets:copy', () =>
  gulp.src('.tmp/assets/**/*')
    .pipe(gulp.dest('dist/assets'))
);

// 'gulp' -- cleans your assets and gzipped files, creates your assets and
// injects them into the templates, then builds your site, copied the assets
// into their directory and serves the site
// 'gulp --prod' -- same as above but with production settings
gulp.task('default', gulp.series(
  gulp.series('clean:assets', 'clean:gzip'),
  gulp.series('assets', 'inject:head', 'inject:default', 'inject:home', 'inject:project'),
  gulp.series('jekyll', 'assets:copy', 'html'),
  gulp.series('serve')
));

// 'gulp build' -- same as 'gulp' but doesn't serve your site in your browser
// 'gulp build --prod' -- same as above but with production settings
gulp.task('build', gulp.series(
  gulp.series('clean:assets', 'clean:gzip'),
  gulp.series('assets', 'inject:head', 'inject:default', 'inject:home', 'inject:project'),
  gulp.series('CNAME','jekyll', 'assets:copy', 'html')
));

// 'gulp clean' -- erases your assets and gzipped files
gulp.task('clean', gulp.series('clean:assets', 'clean:gzip'));

// 'gulp rebuild' -- WARNING: Erases your assets and built site, use only when
// you need to do a complete rebuild
gulp.task('rebuild', gulp.series('clean:dist', 'clean:assets',
'clean:images', 'clean:uploads', 'clean:metadata'));

// 'gulp check' -- checks your Jekyll configuration for errors and lint your JS
gulp.task('check', gulp.series('jekyll:doctor', 'lint'));


//
// FOR CLOUDCANNON
//

// 'gulp deploy' -- copy to dropbox (or another dir/repo) for cloud cannon
// gulp.task('deploy', () =>
//   gulp.src(['src/**/*', '!src/assets/scss', '!src/assets/scss/**/*', '!src/assets/javascript/dev', '!src/assets/javascript/dev/**/*'])
//     .pipe(gulp.dest('/Users/ryanaponte/Dropbox/Apps/Cloud\ Cannon/audiovideosystems'))
// );

// 'gulp deploy' -- build and copy to dropbox for cloud cannon
// gulp.task('deploy', gulp.series(
//   gulp.series('clean:assets', 'clean:gzip'),
//   gulp.series('assets', 'inject:head', 'inject:footer'),
//   gulp.series('jekyll', 'src:cloudcannon')
// ));
