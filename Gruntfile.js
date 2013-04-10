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
                    baseurl: '.',
                    paths: {
                        'jquery': 'components/jquery/jquery',
                        'mout': 'components/mout/src/'
                    },
                    name: 'global',
                    out: 'build/output.js'
                }
            }
        },
        clean: ['report/'],
        plato: {
            default_options: {
                files: {
                    'report': ['**/*.js', '!**/node_modules/**',
                        '!**/components/**', '!**/build/**', '!**/report/**',
                        '!**/projectFilesBackup/**', '!**/.git/**',
                        'Gruntfile.js']
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-plato');

    // Default task(s).
    grunt.registerTask('default', ['requirejs', 'uglify', 'clean', 'plato']);

};

