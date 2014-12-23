/* global module:false */
module.exports = function(grunt) {

	var fs, files, opts, spawn, builds = {};

	opts = {
		baseUrl: "src",
		name: "../build/REPLACE",
		out: "dist/REPLACE.js",
		mainConfigFile: "build/config/production.js"
	};

	fs = require( 'fs' );
	files = fs.readdirSync( "build/custom/" );

	files.forEach(function( file ) {
		if( /\.js$/.test(file) ){
			var name = file.replace(/\.js$/, ""),
				o = Object.create(opts);

			builds[name] = {
				options: o
			};

			builds[name].options.name = o.name.replace("REPLACE", "custom/" + name );
			builds[name].options.out = o.out.replace("REPLACE", name );
		}
	});

	builds.production = {
		options: {
			baseUrl: "src",
			name: "../build/production",
			out: "dist/production.js",
			mainConfigFile: "build/config/production.js"
		}
	};

	// NOTE config includes development
	builds.development = {
		options: {
			baseUrl: "src",
			// NOTE uses the same meta-module as production
			name: "../build/development",
			out: "dist/development.js",
			mainConfigFile: "build/config/development.js"
		}
	};

	// Project configuration.
	grunt.initConfig({
		meta: {
			version: '1.0.2',
			banner: '/*! Shoestring - v<%= meta.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'* http://github.com/filamentgroup/shoestring/\n' +
				'* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
				'Scott Jehl, Filament Group, Inc; Licensed MIT & GPLv2 */ \n'
		},

		qunit: {
			files: ['test/unit/*.html']
		},

		requirejs: builds,

		// NOTE purely for the banner
		concat: {
			options: {
				banner: '<%= meta.banner %>',
				stripBanners: true
			},

			production: {
				src: ['dist/production.js'],
				dest: 'dist/shoestring.js'
			},

			development: {
				src: ['dist/development.js'],
				dest: 'dist/shoestring-dev.js'
			}
		},

		uglify: {
			all: {
				options: {
					banner: '<%= meta.banner %>',
					report: 'gzip'
				},

				files: {
					'dist/shoestring.min.js': ['dist/shoestring.js'],
					'dist/shoestring-dev.min.js': ['dist/shoestring-dev.js']
				}
			}
		},

		jshint: {
			all: {
				options: {
					jshintrc: ".jshintrc",
				},

				src: ['Gruntfile.js', 'src/shoestring.js', 'src/extensions/**/*.js']
			}
		}
	});

	spawn = require('child_process').spawn;

	grunt.registerTask('docs', function() {
		var doxx, srcs, args = [], done = this.async();

		for(var i in arguments){
			args.push(arguments[i]);
		}

		srcs = args.length ? srcs = args.join(":") : "src";

		doxx = spawn( 'node', ['node_modules/.bin/doxx', '--source', srcs, '--target', 'dist/docs']);

		doxx.on( 'close', function( code ) {
			console.log( "doxx completed with exit code: "	+ code );
			done();
		});
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-requirejs');

	// Default task.
	grunt.registerTask('build', 'requirejs concat uglify'.split(' ') );
	grunt.registerTask('test', 'jshint qunit'.split(' ') );
	grunt.registerTask('default', 'build test'.split(' ') );
};
