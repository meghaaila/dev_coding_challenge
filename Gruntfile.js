/*
module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),


        clean: ["dist", '.tmp'],
        copy: {
            main: {
                expand: true,
                cwd: 'app/',
                src: ['**', '!js/!**', '!lib/!**', '!**!/!*.css'],
                dest: 'dist/'
            },
            shims: {
                expand: true,
                cwd: 'app/lib/webshim/shims',
                src: ['**'],
                dest: 'dist/js/shims'
            }
        },
        connect: {
            server: {
                options: {
                    hostname: 'localhost',
                    port: 8080
                }
            }
        },
        rev: {
            files: {
                src: ['dist/!**!/!*.{js,css}', '!dist/js/shims/!**']
            }
        },

        useminPrepare: {
            html: 'index.html'
        },

        usemin: {
            html: ['dist/index.html']
        },

        uglify: {
            options: {
                report: 'min',
                mangle: false
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-rev');
    grunt.loadNpmTasks('grunt-usemin');

    // Tell Grunt what to do when we type "grunt" into the terminal
    grunt.registerTask('default', [
        'copy', 'useminPrepare','uglify',  'rev', 'usemin'
    ]);
};*/

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: [ 'app/app.js', 'app/controller.js' ],
                dest: 'dist/app.js'
            }
        },
        bower: {
            install: {
                options: {
                    install: true,
                    copy: false,
                    targetDir: './bower_components',
                    cleanTargetDir: true
                }
            }
        },

        uglify: {
            dist: {
                files: {
                    'dist/app.js': [ 'dist/app.js' ]
                },
                options: {
                    mangle: false
                }
            }
        },


        clean: ["dist", 'bower_components'],


        jshint: {
            all: [ 'Gruntfile.js', 'app/*.js' ]
        },
        connect: {
            server: {
                options: {
                    hostname: 'localhost',
                    port: 8080
                }
            }
        },
        watch: {
            dev: {
                files: [ 'Gruntfile.js', 'app/*.js' ],
                tasks: [ 'jshint', 'concat:dist', 'clean:temp' ],
                options: {
                    atBegin: true
                }
            },
            min: {
                files: [ 'Gruntfile.js', 'app/*.js' ],
                tasks: [ 'jshint', 'karma:unit',  'concat:dist', 'clean:temp', 'uglify:dist' ],
                options: {
                    atBegin: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('dev', [ 'bower', 'concat:dist','connect:server', 'watch:dev' ]);
};