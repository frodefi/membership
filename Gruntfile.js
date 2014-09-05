// Based on a file generated using Yeoman generator-angular 0.8.0
// Altered for my needs... For now no testing...
'use strict';

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    project: {
      // configurable paths
      app: require('./bower.json').appPath || 'app',
      dist: 'dist'
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= project.app %>/scripts/**/*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: true
        }
      },
      compass: {
        files: ['<%= project.app %>/styles/**/*.{scss,sass}'],
        tasks: ['compass:server', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= project.app %>/**/*.html',
          '.tmp/styles/**/*.css',
          '<%= project.app %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            '<%= project.app %>'
          ]
        }
      },
      dist: {
        options: {
          base: '<%= project.dist %>'
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= project.dist %>/*',
            '!<%= project.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '**/*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['.tmp/index.html'],
        exclude: ['<%= project.app %>/bower_components/bootstrap-sass-official/vendor/assets/javascripts/',
                  '<%= project.app %>/bower_components/es5-shim',
                  '<%= project.app %>/bower_components/json3'],
        ignorePath: '<%= project.app %>/'
      },
      sass: {
        src: ['<%= project.app %>/**/*.scss'],
        ignorePath: '<%= project.app %>/bower_components/'
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '<%= project.app %>',
        cssDir: '.tmp/styles',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: '<%= project.app %>/images',
        javascriptsDir: '<%= project.app %>/scripts',
        fontsDir: '<%= project.app %>/styles/fonts',
        importPath: '<%= project.app %>/bower_components',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/styles/fonts',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {
        options: {
          generatedImagesDir: '<%= project.dist %>/images/generated'
        }
      },
      server: {
        options: {
          debugInfo: true
        }
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= project.dist %>/scripts/**/*.js',
            '<%= project.dist %>/styles/**/*.css',
            '<%= project.dist %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= project.dist %>/styles/fonts/*'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= project.app %>/index.html',
      options: {
        dest: '<%= project.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Yeoman includes own js-files in index.html, but since we do not use Yeoman:
    // Include own js-files in index.html
    includeSource: {
      options: {
        basePath: 'app'
      },
      dev: {
        ordering: 'top-down',
        files: {
          '.tmp/index.html': '<%= project.app %>/index.html'
        }
      },
      dist: {
        ordering: 'top-down',
        files: {
          '<%= project.dist %>/index.html': '<%= project.app %>/index.html'
        }
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= project.dist %>/**/*.html'],
      css: ['<%= project.dist %>/styles/**/*.css'],
      options: {
        assetsDirs: ['<%= project.dist %>']
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    cssmin: {
      options: {
        root: '<%= project.app %>'
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= project.app %>/images',
          src: '**/*.{png,jpg,jpeg,gif}',
          dest: '<%= project.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= project.dist %>',
          src: ['*.html', 'views/**/*.html'],
          dest: '<%= project.dist %>'
        }]
      }
    },

    // ngmin tries to make the code safe for minification automatically by
    // using the Angular long form for dependency injection. It doesn't work on
    // things like resolve or inject so those have to be done manually.
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= project.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= project.app %>',
          dest: '<%= project.dist %>',
          src: [
            '*.{ico,png,txt}',
            '**/*.html'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= project.dist %>/images',
          src: ['generated/*']
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= project.app %>/styles',
        dest: '.tmp/styles/',
        src: '**/*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'compass:server'
      ],
      dist: [
        'compass:dist',
        'imagemin'
      ]
    }
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'includeSource:dev',
      'wiredep',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

// after 'copy:dist':  'cdnify',
// before 'copy:dist':    'ngmin',
    grunt.registerTask('build', [
    'clean:dist',
    'includeSource:dev',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'copy:dist',
    'cssmin',
    'uglify',
    'rev',
    'usemin',
    'htmlmin'
  ]);

//  'newer:jshint',
    grunt.registerTask('default', [
    'build'
  ]);

};
