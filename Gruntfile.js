'use strict';

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON('tablesaw.json'),
		banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
			' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
		// Task configuration.
		clean: {
			files: ['dist']
		},
		concat: {
			options: {
				banner: '<%= banner %>',
				stripBanners: true
			},
			js: {
				src: [
					'src/globalenhance.js',
					'src/tables.js',
					'src/tables.navigable.js',
					'src/tables.swipetoggle.js',
					'src/tables.sortable.js',
					'src/tables.stickyheaders.js',
					'src/tables.minimap.js',
					'src/tables.modeswitch.js'
				],
				dest: 'dist/<%= pkg.name %>.js'
			},
			css: {
				src: [
					'src/tables.css',
					'src/tables.swipetoggle.css',
					'src/tables.stickyheaders.css',
					'src/tables.columntoggle.css',
					'src/tables.sortable.css',
					'src/tables.navigable.css',
					'src/tables.minimap.css',
					'src/tables.modeswitch.css'
				],
				dest: 'dist/<%= pkg.name %>.css'
			}
		},
		uglify: {
			options: {
				banner: '<%= banner %>'
			},
			dist: {
				src: '<%= concat.js.dest %>',
				dest: 'dist/<%= pkg.name %>.min.js'
			},
		},
		qunit: {
			files: ['test/**/*.html']
		},
		jshint: {
			gruntfile: {
				options: {
					jshintrc: '.jshintrc'
				},
				src: 'Gruntfile.js'
			},
			src: {
				options: {
					jshintrc: 'src/.jshintrc'
				},
				src: ['src/**/*.js']
			},
			test: {
				options: {
					jshintrc: 'test/.jshintrc'
				},
				src: ['test/**/*.js']
			},
		},
		watch: {
			gruntfile: {
				files: '<%= jshint.gruntfile.src %>',
				tasks: ['jshint:gruntfile']
			},
			src: {
				files: '<%= jshint.src.src %>',
				tasks: ['jshint:src', 'qunit']
			},
			test: {
				files: '<%= jshint.test.src %>',
				tasks: ['jshint:test', 'qunit']
			},
		},
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Default task.
	grunt.registerTask('default', ['jshint', 'qunit', 'clean', 'concat', 'uglify']);

};
