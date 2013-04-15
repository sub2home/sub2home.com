module.exports = function (grunt) {

	var include = [
    'main',
    'models/clientModel',
    'views/header/HeaderView',
    'views/header/ClientView',
    'views/home/home/MainView',
    'views/home/info/MainView',
    'views/home/404/MainView',
    'views/client/login/MainView',
    'views/client/dashboard/MainView',
    'views/client/config/MainView',
    'views/store/home/MainView',
    'views/store/info/MainView',
    'views/store/selection/MainView',
    'views/store/tray/MainView',
    'views/store/checkout/MainView',
    'views/store/dashboard/MainView',
    'views/store/assortment/MainView',
    'views/store/config/MainView'
    ];

	var relativeServerDir = '../../../server/laravel/';

	// config
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			all: [
            'Gruntfile.js',
            '../src/js/main.js',
            '../src/js/config.js',
            '../src/js/modules/*.js',
            '../src/js/models/*.js',
            '../src/js/collections/*.js',
            '../src/js/views/**/*.js',
            'test/spec/**/*.js'
            ]
		},

		// kick off jasmine, showing results at the cli
		jasmine: {
			all: ['../test/runner.html']
		},

		requirejs: {
			development: {
				options: {
					optimize: 'none',
					baseUrl: '../src/js',
					mainConfigFile: '../src/js/config.js',
					preserveLicenseComments: false,
					include: include,
					out: relativeServerDir + 'public/js/main.js'
				}
			},
			production: {
				options: {
					optimize: 'uglify',
					baseUrl: '../src/js',
					mainConfigFile: '../src/js/config.js',
					preserveLicenseComments: false,
					include: include,
					out: relativeServerDir + 'public/js/main.js'
				}
			}
		},

		exec: {
			linkSrcJS: {
				command: 'ln -s $(pwd)/../src/js/ $(pwd)/' + relativeServerDir + 'public/js'
			},
			linkSrcTemplates: {
				command: 'ln -s $(pwd)/../src/templates/ $(pwd)/' + relativeServerDir + 'public/templates'
			},
			createRequireJsDir: {
				command: 'mkdir -p $(pwd)/' + relativeServerDir + 'public/js/vendor/requirejs'
			},
			copyRequireJs: {
				command: 'cp $(pwd)/../src/js/vendor/requirejs/require.js $(pwd)/' + relativeServerDir + 'public/js/vendor/requirejs/'
			}
		},

		less: {
			development: {
				files: {
					'../../../server/laravel/public/css/frontend.css': '../src/less/frontend/frontend.less'
				}
			},
			production: {
				options: {
					yuicompress: true
				},
				files: {
					'../../../server/laravel/public/css/frontend.css': '../src/less/frontend/frontend.less'
				}
			}
		}

	});

	// load tasks
	// grunt.loadNpmTasks('grunt-jasmine-task');
	grunt.loadNpmTasks('grunt-requirejs');
	grunt.loadNpmTasks('grunt-exec');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	// register tasks
	grunt.registerTask('prepareRequireJs', [
        'exec:createRequireJsDir',
        'exec:copyRequireJs'
    ]);

	grunt.registerTask('dev', [
        'exec:linkSrcJS',
        'exec:linkSrcTemplates'
    ]);

	grunt.registerTask('test', [
        'jshint'
    ]);

	grunt.registerTask('build:dev', [
        'test',
        'requirejs:development',
        'less:development',
        'prepareRequireJs'
    ]);

	grunt.registerTask('build:prod', [
        'test',
        'requirejs:production',
        'less:production',
        'prepareRequireJs'
    ]);

};