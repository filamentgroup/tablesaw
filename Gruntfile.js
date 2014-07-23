'use strict';

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.company %>;' +
			' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
		// Task configuration.
		clean: ['dist/tmp/'],
		concat: {
			options: {
				banner: '<%= banner %>',
				stripBanners: true
			},
			jsall: {
				src: [
					'src/tables-init.js',
					'src/tables.js',
					'src/tables.stack.js',
					'src/tables.btnmarkup.js',
					'src/tables.columntoggle.js',
					'src/tables.swipetoggle.js',
					'src/tables.sortable.js',
					'src/tables.minimap.js',
					'src/tables.modeswitch.js'
				],
				dest: 'dist/<%= pkg.name %>.js'
			},
			jsstack: {
				src: [
					'src/tables-init.js',
					'src/tablesaw.js',
					'src/tables.js',
					'src/tables.stack.js'
				],
				dest: 'dist/<%= pkg.name %>.stackonly.js'
			},
			cssall: {
				src: [
					'src/tables.css',
					'src/tables.toolbar.css',
					'src/tables.skin.css',
					'src/tables.stack.css',
					'src/tables.stack-default-breakpoint.css',
					'src/tables.swipetoggle.css',
					'src/tables.columntoggle.css',
					'src/tables.sortable.css',
					'src/tables.minimap.css',
					'src/tables.modeswitch.css'
				],
				dest: 'dist/tmp/<%= pkg.name %>.myth.css'
			},
			cssstack: {
				src: [
					'src/tables.css',
					'src/tables.stack.css',
					'src/tables.stack-default-breakpoint.css'
				],
				dest: 'dist/tmp/<%= pkg.name %>.stackonly.myth.css'
			},
			cssstackmixinpre: {
				src: [
					'src/tables.css',
					'src/tables.stack.css'
				],
				dest: 'dist/tmp/<%= pkg.name %>.stackonly.myth.scss'
			},
			cssstackmixinpost: {
				src: [
					'dist/tmp/<%= pkg.name %>.stackonly-sans-mixin.scss',
					'src/tables.stack-mixin.scss'
				],
				dest: 'dist/<%= pkg.name %>.stackonly.scss'
			}
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
				files: ['<%= concat.cssall.src %>', '<%= concat.jsall.src %>'],
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
						"arrow-gray-left": [".tablesaw-bar .tablesaw-advance > .btn.left"]
					}
				}
			}
		},
		bytesize: {
			dist: {
				src: [
					'dist/<%= pkg.name %>.css',
					'dist/<%= pkg.name %>.js'
				]
			},
			stackonly: {
				src: [
					'dist/<%= pkg.name %>.stackonly.css',
					'dist/<%= pkg.name %>.stackonly.js'
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
					'dist/<%= pkg.name %>.css': '<%= concat.cssall.dest %>',
					'dist/<%= pkg.name %>.stackonly.css': '<%= concat.cssstack.dest %>',
					'dist/tmp/<%= pkg.name %>.stackonly-sans-mixin.scss': '<%= concat.cssstackmixinpre.dest %>'
				}
			}
		}
	});

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// Default task.
	grunt.registerTask('travis', ['jshint', 'qunit']);
	grunt.registerTask('concat-pre', ['concat:jsall', 'concat:jsstack', 'concat:cssall', 'concat:cssstack', 'concat:cssstackmixinpre']);
	grunt.registerTask('concat-post', ['concat:cssstackmixinpost']);
	grunt.registerTask('src', ['concat-pre', 'myth', 'concat-post', 'clean']);

	grunt.registerTask('default', ['jshint', 'src', 'grunticon:tablesaw', 'qunit', 'bytesize']);

	// Deploy
	grunt.registerTask('deploy', ['default', 'gh-pages']);

};
