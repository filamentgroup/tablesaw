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
					'src/tablesaw.js',
					'src/tables.js',
					'src/tables.btnmarkup.js',
					'src/tables.swipetoggle.js',
					'src/tables.sortable.js',
					'src/tables.minimap.js',
					'src/tables.modeswitch.js'
				],
				dest: 'dist/<%= pkg.name %>.js'
			},
			css: {
				src: [
					'src/tables.btnmarkup.css',
					'src/tables.controlgroup.css',
					'src/tables.css',
					'src/tables.swipetoggle.css',
					'src/tables.columntoggle.css',
					'src/tables.sortable.css',
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
				files: ['<%= concat.css.src %>', '<%= concat.js.src %>'],
				tasks: ['jshint:src', 'qunit', 'concat', 'uglify']
			},
			icons: {
				files: ['<%= grunticon.tablesaw.options.src %>/*'],
				tasks: ['grunticon:tablesaw']
			},
			test: {
				files: '<%= jshint.test.src %>',
				tasks: ['jshint:test', 'qunit']
			},
		},
		grunticon: {
			tablesaw: {
				files: [{
					expand: true,
					cwd: 'src/icons/',
					src: ['*.svg'],
					dest: 'dist/icons/'
				}],
				options: {
					loadersnippet: 'grunticon.loader.js',
					customselectors: {
						"arrow-gray-down": [".ui-table-bar .ui-table-columntoggle-btnwrap > a", ".enhanced .icon-arrow-gray-down"],
						"sort-ascending": [".sortable-head.sortable-ascending button:after"],
						"sort-descending": [".sortable-head.sortable-descending button:after"],
						"arrow-gray-right": [".ui-table-bar .tablesaw-advance > .btn.right", ".enhanced .icon-arrow-gray-right"],
						"arrow-gray-left": [".ui-table-bar .tablesaw-advance > .btn.left", ".enhanced .icon-arrow-gray-left"],
						"check": [".btn-selected.btn-checkbox:after"]
					}
				}
			}
		},
		bytesize: {
			dist: {
				src: [
					'dist/tablesaw.css',
					'dist/tablesaw.min.js'
				]
			}
		},
		'gh-pages': {
			options: {},
			src: ['dist/**/*', 'bower_components/**/*', 'demo/**/*']
		}
	});

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// Default task.
	grunt.registerTask('default', ['jshint', 'qunit', 'clean', 'concat', 'uglify', 'grunticon:tablesaw', 'bytesize']);

	// Deploy
	grunt.registerTask('deploy', ['default', 'gh-pages']);

};
