'use strict';

module.exports = function(grunt) {

	var jsFiles = [
		'src/tables.js',
		'src/tables.stack.js',
		'src/tables.btnmarkup.js',
		'src/tables.columntoggle.js',
		'src/tables.sortable.js',
		'src/tables.swipetoggle.js',
		'src/tables.minimap.js',
		'src/tables.modeswitch.js',
		'src/tables.checkall.js',
		'src/tables.outro.js'
	];

	var jsStackOnlyFiles = [
		'src/tables.js',
		'src/tables.stack.js',
		'src/tables.outro.js'
	];

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.company %>;' +
			' Licensed <%= pkg.license %> */\n',
		// Task configuration.
		clean: {
			dependencies: ['dist/dependencies/'],
			post: ['dist/tmp/', 'dist/**/*.min.*']
		},
		copy: {
			jquery: {
				src: 'node_modules/jquery/dist/jquery.js',
				dest: 'dist/dependencies/jquery.js'
			},
			naturalsort: {
				src: 'node_modules/javascript-natural-sort/naturalSort.js',
				dest: 'dist/dependencies/naturalsort.js'
			},
			qunit: {
				files: [{
					expand: true,
					flatten: true,
					src: [ 'node_modules/qunitjs/qunit/*' ],
					dest: 'dist/dependencies/',
					filter: 'isFile'
				}]
			}
		},
		concat: {
			options: {
				banner: '<%= banner %>',
				stripBanners: true
			},
			jsautoinit: {
				src: ['src/tables-init.js'],
				dest: 'dist/<%= pkg.name %>-init.js'
			},
			jsall: {
				src: [
					'src/lib/shoestring-custom.js',
					'src/tables.intro.shoestring.js'
				].concat( jsFiles ),
				dest: 'dist/<%= pkg.name %>.js'
			},
			jsjquery: {
				src: [
					'src/tables.intro.jquery.js'
				].concat( jsFiles ),
				dest: 'dist/<%= pkg.name %>.jquery.js'
			},
			jsstack: {
				src: [
					'src/lib/shoestring-custom.js',
					'src/tables.intro.shoestring.js'
				].concat( jsStackOnlyFiles ),
				dest: 'dist/stackonly/<%= pkg.name %>.stackonly.js'
			},
			jsstackjquery: {
				src: [
					'src/tables.intro.jquery.js'
				].concat( jsStackOnlyFiles ),
				dest: 'dist/stackonly/<%= pkg.name %>.stackonly.jquery.js'
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
					'src/tables.minimap.css'
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
				dest: 'dist/stackonly/<%= pkg.name %>.stackonly.scss'
			}
		},
		qunit: {
			files: ['test-qunit/**/*.html']
		},
		run: {
			ava: {
				exec: "./node_modules/.bin/ava"
			}
		},
		watch: {
			src: {
				files: [
					'<%= concat.jsall.src %>',
					'<%= concat.jsautoinit.src %>',
					'<%= concat.cssall.src %>'
				],
				tasks: ['src']
			},
			test: {
				files: ['dist/<%= pkg.name %>.js'],
				tasks: ['test']
			}
		},
		uglify: {
			js: {
				files: {
					'dist/<%= pkg.name %>.min.js': [ 'dist/<%= pkg.name %>.js' ],
					'dist/<%= pkg.name %>.jquery.min.js': [ 'dist/<%= pkg.name %>.jquery.js' ],
					'dist/stackonly/<%= pkg.name %>.stackonly.min.js': [ 'dist/stackonly/<%= pkg.name %>.stackonly.js' ],
					'dist/stackonly/<%= pkg.name %>.stackonly.jquery.min.js': [ 'dist/stackonly/<%= pkg.name %>.stackonly.jquery.js' ]
				}
			}
		},
		cssmin: {
			css: {
				files: {
					'dist/<%= pkg.name %>.min.css': [ 'dist/<%= pkg.name %>.css' ],
					'dist/stackonly/<%= pkg.name %>.stackonly.min.css': [ 'dist/stackonly/<%= pkg.name %>.stackonly.css' ]
				}
			}
		},
		bytesize: {
			dist: {
				src: [
					'dist/<%= pkg.name %>.min.css',
					'dist/<%= pkg.name %>.min.js',
					'dist/<%= pkg.name %>.jquery.min.js',
					'dist/stackonly/<%= pkg.name %>.stackonly.min.css',
					'dist/stackonly/<%= pkg.name %>.stackonly.min.js',
					'dist/stackonly/<%= pkg.name %>.stackonly.jquery.min.js'
				]
			}
		},
		'gh-pages': {
			options: {},
			src: ['dist/**/*', 'demo/**/*', 'test/**/*']
		},
		myth: {
			dist: {
				files: {
					'dist/<%= pkg.name %>.css': '<%= concat.cssall.dest %>',
					'dist/stackonly/<%= pkg.name %>.stackonly.css': '<%= concat.cssstack.dest %>',
					'dist/tmp/<%= pkg.name %>.stackonly-sans-mixin.scss': '<%= concat.cssstackmixinpre.dest %>'
				}
			}
		},
		compress: {
			main: {
				options: {
					archive: 'dist/tablesaw-<%= pkg.version %>.zip',
					mode: 'zip',
					pretty: true
				},
				files: [
					{expand: true, cwd: 'dist/', src: ['*'], dest: 'tablesaw/'},
					{expand: true, cwd: 'dist/', src: ['dependencies/*'], dest: 'tablesaw/'},
					{expand: true, cwd: 'dist/', src: ['stackonly/*'], dest: 'tablesaw/'}
				]
			}
		}
	});

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// Default task.
	grunt.registerTask('test', ['qunit', 'run:ava']);
	grunt.registerTask('concat-pre', ['concat:jsautoinit', 'concat:jsall', 'concat:jsjquery', 'concat:jsstack', 'concat:jsstackjquery', 'concat:cssall', 'concat:cssstack', 'concat:cssstackmixinpre']);
	grunt.registerTask('concat-post', ['concat:cssstackmixinpost']);
	grunt.registerTask('src', ['concat-pre', 'myth', 'concat-post', 'clean:dependencies', 'copy', 'clean:post']);
	grunt.registerTask('filesize', ['uglify', 'cssmin', 'bytesize', 'clean:post']);

	grunt.registerTask('default', ['src', 'test', 'filesize']);

	// Deploy
	grunt.registerTask('deploy', ['default', 'gh-pages']);

};
