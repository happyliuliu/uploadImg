'use strict';
//var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function(connect, dir) {
	console.log(require('path').resolve(dir));
	return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {
	// load all grunt tasks
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		watch: {
			options: {
	      		livereload: true
	    	},
			scripts: {
				files: ['app/**/*.{js,css,png,jpg,jpeg,webp}'],
				tasks: ['jshint','copy:debug']
			},
			less: {
				files: ['app/**/*.less'],
				tasks: ['less:debug']
			},
			jade: {
				files: ['app/**/*.jade'],
				tasks: ['jade:debug']
			},
			html: {
				files: ['app/**/*.html'],
				tasks: ['jade:debug','copy:debug']
			},
			coffee: {
				files: ['app/scripts/{,*/}*.coffee'],
				tasks: ['coffee:debug']
			}
		},

		// 开启本地服务
		connect: {
			options: {
				port: '9876',
				hostname: '0.0.0.0'
			},
			debug: {
				options: {
					middleware: function(connect) {
						return [
						mountFolder(connect, '.tmp'),
						require("./app.js")
						];
					}
				}
			},
			dist: {
				options: {
					middleware: function(connect) {
						return [
						mountFolder(connect, 'dist')];
					}
				}
			}
		},

		// 自动在浏览器打开
		open: {
			server: {
				path: 'http://localhost:<%= connect.options.port %>'
			}
		},

		// 删除
		clean: {
			debug: '.tmp',
			dist: ['dist/*'],
		},

		// 检查js文件语法错误
		jshint: {
			options: {
				jshintrc: true
			},
			all: ['app/scripts/{,*/}*.js']
		},

		coffee: {
			debug: {
				files: [{
					expand: true,
					cwd: 'app/scripts',
					src: '{,*/}*.coffee',
					dest: '.tmp/scripts',
					ext: '.js'
				}]
			},
			dist:{
				files: [{
					expand: true,
					cwd: 'app/scripts',
					src: '{,*/}*.coffee',
					dest: 'dist/scripts',
					ext: '.js'
				}]
			}
		},
		//  将less文件转化为css文件
		less: {
			debug: {
				options: {
                    compress: true,  //压缩去除空白
                    yuicompress: true,
                    optimization: 2
                },
                files: [{
                    expand: true,
                    cwd: 'app/',
                    src:['**/*.less'],
                    dest: '.tmp/',
                    ext: '.css'
                }]
			},
			dist: {
				options: {
                    compress: true,  //压缩去除空白
                    yuicompress: true,
                    optimization: 2
                },
                files: [{
                    expand: true,
                    cwd: 'app/',
                    src:['**/*.less'],
                    dest: '.tmp/',
                    ext: '.css'
                }]
			}
		},

		jade: {
			debug: {
				options: {
					data: {
						debug: true
					},
					pretty: true
				},
				files: [{
					expand: true,
					cwd: 'app/',
					src: ['**/*.jade'],
					dest: '.tmp/',
					ext: '.html'
				}]
			},
			dist: {
				options: {
					data: {
						debug: true
					},
					pretty: true
				},
				files: [{
					expand: true,
					cwd: 'app/',
					src: ['**/*.jade'],
					dest: 'dist/',
					ext: '.html'
				}]
			}
		},

		// 压缩js文件
		uglify: {
			dist: {
				options:{
                    compress : true
                }
			}
		},

		// 压缩图片
		imagemin: {
			dist: {
				files: [{
					expand: true,
					cwd: 'app/images',
					src: '**/*.{png,jpg,jpeg}',
					dest: 'dist/images'
				}]
			}
		},

		// 复制
		copy: {
			debug: {
				files: [{
					expand: true,
					cwd: 'app',
					src: ['**/*.{css,js,png,JPG,jpg,jpeg,html,svg,eot,ttf,woff}'],
					dest: '.tmp'
				}]
			},
			dist: {
				files: [{
					expand: true,
					cwd: 'app',
					src: ['**/*.{css,js,png,jpg,jpeg,svg,eot,ttf,woff}'],
					dest: 'dist'
				}]
			}
		}
	});


	grunt.registerTask('server', function(target) {
		if (target === 'dist') {
			return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
		}

		grunt.task.run([
			'clean:debug',
			'less:debug',
			'coffee:debug',
			'jade:debug',
			'connect:debug',
			'copy:debug',
			// 'open',
			'watch'
			]);
	});

	grunt.registerTask('test', [

	]);

	grunt.registerTask('build', [
		'clean:dist',
		'compass:dist',
		'jade:dist',
		'coffee:dist',
		'imagemin',
		'uglify',
		'copy:dist']);

	grunt.registerTask('default', ['jshint',
		'server']);
};