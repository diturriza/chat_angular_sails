var gulp = require('gulp');
var clear = require('del');
var path = require('path');
var less = require('gulp-less');
var open = require('gulp-open');
var watch = require('gulp-watch');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var notify = require('gulp-notify');
var annotate = require('gulp-ng-annotate')
var minifycss = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var parallelize = require("concurrent-transform");
var livereload = require('gulp-livereload');

// App Files
var appScripts = [
  'app/app/app.module.js',
  'app/app/app.constants.js',
  'app/app/app.config.js',
  'app/app/app.routes.js',
  'app/app/app.run.js',
  'app/app/**/**.js',
  'app/app/**/**/**.js',
];

var appStyles = [
  'app/app/**.less'
];

var appViews = [
  'app/app/**/**.html'
];

var appImages = [
  'app/app/images/**'
];
var appFonts = [
  'app/app/fonts/**'
];
var appTemplates = [
  'app/app/**/**/**.html'
];

var BaseVendors = 'bower_components/';
// Vendor Files
var vendorScripts = [
  BaseVendors + 'jquery/dist/jquery.min.js',
  BaseVendors + 'lodash/lodash.min.js',
  BaseVendors + 'angular/angular.min.js',
  BaseVendors + 'angular-sanitize/angular-sanitize.min.js',
  BaseVendors + 'angular-cookies/angular-cookies.min.js',
  BaseVendors + 'angular-ui-router/release/angular-ui-router.min.js',
  BaseVendors + 'bootstrap/dist/js/bootstrap.min.js',
  BaseVendors + 'angular-breadcrumb/dist/angular-breadcrumb.min.js',
  BaseVendors + 'angular-toastr/dist/angular-toastr.min.js',
  BaseVendors + 'angular-animate/angular-animate.js',
  BaseVendors + 'angular-messages/angular-messages.js',
  BaseVendors + 'bootstrap/dist/js/bootstrap.min.js',
  BaseVendors + 'spin.js/spin.min.js',
  BaseVendors + 'angular-spinner/angular-spinner.min.js'
];
var vendorStyles = [
  BaseVendors + 'bootstrap/dist/css/bootstrap.min.css',
  BaseVendors + 'font-awesome/css/font-awesome.min.css'
  BaseVendors + 'angular-toastr/dist/angular-toastr.min.css',
];

var vendorFonts = [
  BaseVendors + 'font-awesome/fonts/*.*'
]



// Start the server
gulp.task('server', ['default'], function() {
  connect.server({
    root: "assets",
    port: 2000,
    host: '127.0.0.1',
    livereload: true
  });
});

// Clean
gulp.task('clean', function(cb) {
  clear(['assets/', 'assets/', 'assets/'], cb);
});

// Scripts
gulp.task('scripts', function() {
  gulp.src(appScripts)
    //.pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    //.pipe(annotate())
    //.pipe(uglify())
    //.pipe(sourcemaps.write())
    .pipe(gulp.dest('assets/js/'))
    .pipe(livereload());
  gulp.src(BaseVendors + 'sails.io.js/dist/sails.io.js')
    .pipe(gulp.dest('assets/js/dependencies/'))
});

// Styles
gulp.task('styles', function() {
  gulp.src(appStyles)
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(concat('app.css'))
    .pipe(gulp.dest('assets/styles/'))
    .pipe(livereload());
});

// Images
gulp.task('images', function() {
  gulp.src(appImages)
    .pipe(gulp.dest('assets/images/'))
});

// Fonts
gulp.task('fonts', function() {
  gulp.src(appFonts)
    .pipe(gulp.dest('assets/fonts/'))
});

// Vendor
gulp.task('vendors', function() {
  gulp.src(vendorScripts)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('assets/js/'))
  gulp.src(vendorStyles)
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('assets/styles/'))
  gulp.src(vendorFonts)
    .pipe(gulp.dest('assets/fonts/'))
});

// Views
gulp.task('views', function() {
  gulp.src('app/index.html')
    .pipe(gulp.dest('assets/'));
  gulp.src(appViews)
    .pipe(gulp.dest('assets/app'))
    .pipe(livereload());
});

// Templates
gulp.task('templates', function() {
  gulp.src(appTemplates)
    .pipe(gulp.dest('assets/app/'))
    .pipe(livereload());
});

// Default task
gulp.task('default', function() {
  gulp.start('scripts', 'vendors', 'views', 'styles', 'images', 'templates', 'fonts');
});


// Watch
gulp.task('watch', ['server'], function() {
  var appStyles2 = ['app/app/**.less', 'app/app/**/*.less', 'app/app/**/**/*.less'];
  // Watch app style and JS files
  gulp.watch(appScripts, ['scripts']);
  gulp.watch(appStyles2, ['styles']);
  gulp.watch(appTemplates, ['templates']);

  // Watch HTML files
  gulp.watch(['index.html', appViews], ['views']);

  // Watch any files in assets/, reload on change
  watch("assets/**").pipe(connect.reload());

});
