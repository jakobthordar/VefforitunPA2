module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      foo: {
        src: [
          "src/js/*.js",
          "src/js/services/*.js",
          "src/js/directives/*.js",
          "src/js/controllers/*.js",
        ],
      },
    }
    /*
       The task to concatenate and minify the code has been removed
       You have to figure that one out yourself :)

       And since the index is referencing the file from that task
       it wont receive your updates until you figure this task out
       or reference the original src/ files
    */
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task(s).
  grunt.registerTask('default', ['jshint', /* more tasks here */]);
};