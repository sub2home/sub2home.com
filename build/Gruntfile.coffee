backboneModules = ["main", "models/clientModel", "views/header/HeaderView", "views/header/ClientView", "views/home/home/MainView", "views/home/info/MainView", "views/home/404/MainView", "views/client/login/MainView", "views/client/dashboard/MainView", "views/client/config/MainView", "views/store/home/MainView", "views/store/info/MainView", "views/store/selection/MainView", "views/store/tray/MainView", "views/store/checkout/MainView", "views/store/dashboard/MainView", "views/store/assortment/MainView", "views/store/config/MainView"]
config =
  dist: "../dist"
  src: "../src"
  test: "../test"

module.exports = (grunt) ->
  require("load-grunt-tasks") grunt
  require("time-grunt") grunt
  grunt.initConfig
    config: config

    coffee:
      src:
        files: [
          expand: true
          cwd: "<%= config.src %>/coffee"
          src: "**/*.coffee"
          dest: "<%= config.src %>/js"
          ext: ".js"
        ]

      test:
        files: [
          expand: true
          cwd: "<%= config.test %>"
          src: "**/*.coffee"
          dest: "<%= config.test %>/.tmp"
          ext: ".js"
        ]

      options:
        sourceMap: true
        sourceRoot: ''
        bare: true

    jshint:
      options:
        jshintrc: ".jshintrc"

      all: ["Gruntfile.js", "<%= config.src %>/js/main.js", "<%= config.src %>/js/config.js", "<%= config.src %>/js/services/*.js", "<%= config.src %>/js/models/*.js", "<%= config.src %>/js/collections/*.js", "<%= config.src %>/js/views/**/*.js", "test/spec/**/*.js"]

    requirejs:
      dist:
        options:
          optimize: "uglify"
          baseUrl: "<%= config.src %>/js"
          mainConfigFile: "<%= config.src %>/js/config.js"
          preserveLicenseComments: false
          include: backboneModules
          out: "<%= config.dist %>/js/main.js"

    rev:
      dist:
        files:
          src: ["<%= config.dist %>/js/main.js", "<%= config.dist %>/css/main.css"]

    usemin:
      html: ["<%= config.dist %>/index.html"]
      options:
        dirs: ["<%= config.dist %>"]

    open:
      server:
        path: "https://sub2home.dev"
        app: "Google Chrome Canary"

    htmlmin:
      dist:
        options:
          collapseWhitespace: true

        files: ["<%= config.dist %>/index.html": "<%= config.dist %>/index.html"]

    clean:
      dist: "<%= config.dist %>"
      test: "<%= config.test %>/.tmp"
      options:
        force: true

    copy:
      dist:
        files: [
          expand: true
          dot: true
          cwd: "<%= config.src %>"
          dest: "<%= config.dist %>"
          src: [
            "index.html"
            "sitemap.xml"
            "robots.txt"
            "favicon.ico"
            "components/requirejs/require.js"
            "mobile/*"
            "browser/*"
          ]
        ]

    less:
      src:
        files:
          "<%= config.src %>/css/main.css": "<%= config.src %>/less/main.less"

      dist:
        options:
          yuicompress: true

        files:
          "<%= config.dist %>/css/main.css": "<%= config.src %>/less/main.less"

    watch:
      coffeeSrc:
        files: ["<%= config.src %>/coffee/**/*.coffee"]
        tasks: ["newer:coffee:src"]

      coffeeTest:
        files: ["<%= config.test %>/spec/**/*.coffee"]
        tasks: ["newer:coffee:test"]

      less:
        files: ["<%= config.src %>/less/*.less"]
        tasks: ["less:src"]

      livereload:
        files: ["<%= config.src %>/js/**/*.js", "<%= config.src %>/templates/**/*.html", "<%= config.src %>/css/*.css"]
        options:
          livereload: true

    karma:
      unit:
        configFile: "<%= config.test %>/karma.conf.js"
        singleRun: true

  grunt.registerTask "server", [
    "clean:test"
    "less"
    "newer:coffee"
    "watch"
  ]

  grunt.registerTask "test", [
    "jshint"
    "karma:unit"
  ]

  grunt.registerTask "build", [
    "coffee:src"
    "clean:dist"
    "copy:dist"
    "requirejs:dist"
    "less:dist"
    "rev:dist"
    "usemin"
    "htmlmin"
  ]

  grunt.registerTask "default", [
    "build"
  ]