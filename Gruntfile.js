module.exports = function (grunt) {
    grunt.initConfig({
        execute: {
            target: {
                src: ['starcrossed.js']
            }
        },
        watch: {
            scripts: {
                files: ['starcrossed.js'],
                tasks: ['execute'],
            },
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-execute');
};