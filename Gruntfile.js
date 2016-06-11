module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jsbeautifier: {
            files: [
                "static/script/appui/**",
                "restapi/history.js",
                "Gruntfile.js"
            ],
        }
    });

    grunt.loadNpmTasks("grunt-jsbeautifier");

    // Default task(s).
    grunt.registerTask('default', ['jsbeautifier']);

};
