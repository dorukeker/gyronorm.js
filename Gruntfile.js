module.exports = function(grunt) {

  // Do grunt-related things in here

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
      // define a string to put between each file in the concatenated output
        separator: ' '
      },
      core: {
        src: ['lib/gyronorm.js'],
        dest: 'dist/gyronorm.js'
      },
      complete: {
        src: ['bower_components/es6-promise/promise.js', 'bower_components/fulltilt/dist/fulltilt.js', 'lib/gyronorm.js'],
        dest: 'dist/gyronorm.complete.js'
      },
      complete_minified: {
        src: ['bower_components/es6-promise/promise.min.js', 'bower_components/fulltilt/dist/fulltilt.min.js', 'dist/gyronorm.min.js'],
        dest: 'dist/gyronorm.complete.min.js'
      }
    },
    uglify: {
      options: {
        // the banner is inserted at the top of the output
        banner: '\n/* gyronorm.js v2.0.4 - https://github.com/dorukeker/gyronorm.git*/\n'
      },
      dist: {
        files: {
          'dist/gyronorm.min.js': ['lib/gyronorm.js']
        }
      }
    },
    clean: {
      core: 'dist/gyronorm.js',
      core_min: 'dist/gyronorm.min.js',
      complete: 'dist/gyronorm.complete.js',
      complete_min: 'dist/gyronorm.complete.min.js'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('build', ['clean' , 'uglify' , 'concat']);
};
