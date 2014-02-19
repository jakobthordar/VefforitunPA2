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
    },
    concat: {
        dist: {
            src: [
            'src/js/app.js', 
            'src/js/controllers/login.js',
            'src/js/controllers/room.js',
            'src/js/services/socket.js'
            ],
            dest: 'build/production.js',
        }
    },
    uglify: {
        build: {
            src:    'build/production.js',
            dest:   'build/chatapp.min.js',
        }
    },
    connect: { 
        server: { 
            options: { 
                port: 8081, 
                keepalive:  true, 
                livereload: false, 
                open:       true, 
            }
        }
    },
    /*
    watch: {
        scripts: {
            files: ['js/*.js'],
            tasks: ['concat', 'uglify'],
            options: {
                spawn: false,
            },
        }
    }*/
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  //grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'uglify', 'concat', 'connect'/*'watch'*/]);
};
