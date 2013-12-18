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
					'src/tables.css',
					'src/tables.swipetoggle.css',
					'src/tables.columntoggle.css',
					'src/tables.sortable.css',
					'src/tables.minimap.css',
					'src/tables.modeswitch.css'
				],
				dest: 'dist/<%= pkg.name %>.myth.css'
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
				tasks: ['src']
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
						"arrow-gray-down": [".tablesaw-bar .tablesaw-columntoggle-btnwrap > a.btn"],
						"sort-ascending": [".tablesaw-sortable .sortable-head.sortable-ascending button:after"],
						"sort-descending": [".tablesaw-sortable .sortable-head.sortable-descending button:after"],
						"arrow-gray-right": [".tablesaw-bar .tablesaw-advance > .btn.right"],
						"arrow-gray-left": [".tablesaw-bar .tablesaw-advance > .btn.left"],
						"check": [".tablesaw-bar .btn-selected.btn-checkbox:after"]
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
			src: ['dist/**/*', 'bower_components/**/*', 'demo/**/*', 'test/**/*']
		},
		myth: {
			dist: {
				files: {
					'dist/<%= pkg.name %>.css': '<%= concat.css.dest %>'
				}
			}
		}
	});

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// Default task.
	grunt.registerTask('src', ['jshint', 'concat', 'qunit', 'uglify', 'myth']);
	grunt.registerTask('default', ['src', 'grunticon:tablesaw', 'bytesize']);

	// Deploy
	grunt.registerTask('deploy', ['default', 'gh-pages']);

};
