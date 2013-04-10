module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('component.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'build/output.js', //'src/<%= pkg.name %>.js',
                dest: 'build/output-1.js'//'build/<%= pkg.name %>.min.js'
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: '.',
                    paths: {
                        'jquery': 'components/jquery/jquery',
                        'mout': 'components/mout/src/',
                        'requireLib': 'components/requirejs/require'
                    },
                    include: 'requireLib',
                    name: 'global',
                    out: 'build/output.js',
                    optimize: 'uglify'
                }
            }
        },
        clean: {
            report: [
                'report/'
            ],
            deploy: ['build/']
        },
        copy: {
            deploy: {
                files: {
                    'build/': ['index.html', 'global.css']
                }
            }
        },
        plato: {
            default_options: {
                files: {
                    'report': ['**/*.js', '!**/node_modules/**',
                        '!**/components/**', '!**/build/**', '!**/report/**',
                        '!**/projectFilesBackup/**', '!**/.git/**',
                        'Gruntfile.js']
                }
            }
        },
        useminPrepare: {
            html: ['build/index.html']
        },
        usemin: {
            html: ['build/index.html']
        }
    });

// Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-plato');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib');

// Default task(s).
    grunt.registerTask('default', ['useminPrepare', 'requirejs', 'clean', 'plato']);
    grunt.registerTask('deploy', ['clean:deploy', 'copy', 'useminPrepare', 'requirejs', 'usemin']);

};


