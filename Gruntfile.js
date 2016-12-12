const jitGrunt = require('jit-grunt');
const path = require('path');
const timeGrunt = require('time-grunt');

const currentDirectory = path.resolve();
const distDirectory = 'dist';

module.exports = function(grunt) {
  timeGrunt(grunt);
  jitGrunt(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    buildDir: '',

    // Removes build directory
    clean: {
      dist: [distDirectory],
      all: [
        'docs',
        'app.*',
        '<%= pkg.name %>.*',
      ]
    },

    env: {
      prod: {
        NODE_ENV: 'production',
      },
    },

    // filerev?
    filerev: {
      options: {
        encoding: 'utf8',
        algorithm: 'md5',
        length: 8
      },
      source: {
        files: [{
          src: [
            'app.js*',
            '<%= pkg.name %>.*',
          ],
          dest: distDirectory
        }]
      }
    },

    filerev_assets: {
      dist: {
        options: {
          dest: distDirectory + '/versioned-assets.json',
          cwd: '/',
        }
      }
    },

    // Checks dependencies and loads appropriate files
    browserify: {
      build: { // Same as browserify:dev but without watch and keepAlive options
        src: 'index.jsx',
        dest: 'app.js',
        options: {
          transform: [['babelify', {
            presets: ['react', 'es2015'],
            plugins: ['syntax-object-rest-spread'],
            ignore: ['geoParser.js', 'plotParser.js'],
          }]],
          browserifyOptions: {
            extensions: ['.jsx', '.js'],
            paths: [currentDirectory],
            debug: true // Adds source maps to output
          },
        },
      },
      dev: { // Same as browserify:build but with watch and keepAlive options
        src: 'index.jsx',
        dest: 'app.js',
        options: {
          transform: [['babelify', {
            presets: ['react', 'es2015'],
            plugins: ['syntax-object-rest-spread'],
            ignore: ['geoParser.js', 'plotParser.js'],
          }]],
          browserifyOptions: {
            extensions: ['.jsx'],
            paths: [currentDirectory],
            debug: true // Adds source maps to output
          },
          watch: true,
          keepAlive: true,
        }
      },
    },

    // Pulls inline sourcemaps into an external file for uglify
    exorcise: {
      app: {
        options: {},
        files: [{
          src: 'app.js',
          dest: 'app.js.map'
        }]
      }
    },

    // Uglify minifies our javascript
    uglify: {
      compile: {
        options: {
          compress: {},
          sourceMap: true,
          sourceMapIn: 'app.js.map'
        },
        files: [{
          src: 'app.js',
          dest: '<%= pkg.name %>.min.js'
        }]
      }
    },

    // Runs multiple tasks in parallel
    concurrent: {
      dev: {
        tasks: ['watch:styles', 'browserify:dev'],
        options: { logConcurrentOutput: true },
      },
    },

    // Runs tasks when files update
    watch: {
      options: {
        interrupt: true,
        atBegin: true,
      },
      styles: {
        files: ['apps/**/*.less'],
        tasks: ['less:dev', 'postcss:dev'],
      },
    },
  });

  // See top of file for usage
  grunt.registerTask('dev', ['clean:dist', 'concurrent:dev']);
  grunt.registerTask('init:dev', [
    'clean',
    'build:dev',
  ]);
  grunt.registerTask('build:dev', [
    'clean:dist',
    'browserify:build',
    'versionify',
  ]);
  grunt.registerTask('build:prod', [
    'clean',
    'env:prod',
    'browserify:build',
    'exorcise:app',
    'uglify:compile',
    'versionify',
  ]);
  grunt.registerTask('versionify', [
    'filerev',
    'filerev_assets',
  ]);

};
