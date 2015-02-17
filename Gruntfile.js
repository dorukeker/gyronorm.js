module.exports = function(grunt) {
  
  // Do grunt-related things in here

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
			// define a string to put between each file in the concatenated output
				separator: ' '
			},
			dist: {
				// the files to concatenate
				src: ['bower_components/es6-promise/promise.min.js','bower_components/fulltilt/dist/fulltilt.min.js','gyronorm.min.js'],
				// the location of the resulting JS file
				dest: 'gyronorm.min.js'
			}
		},
		uglify: {
			options: {
				// the banner is inserted at the top of the output
				banner: '\n/* gyronorm.js v2.0.0 - https://github.com/dorukeker/gyronorm.git*/\n'
			},
			dist: {
				files: {
					'gyronorm.min.js': ['gyronorm.js']
				}
			}
		},
		clean: {
			start: 'gyronorm.min.js'
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');

	// grunt.registerTask('build', ['clean:start' , 'uglify' , 'concat']);

		grunt.registerTask('build', ['clean:start' , 'uglify' , 'concat']);

};