require.config

  paths:
    async: "../components/requirejs-plugins/src/async"
    text: "../components/requirejs-text/text"
    jquery: "../components/jquery/jquery"
    jqueryRotate: "../components/jquery-rotate/jquery.rotate"
    jqueryEasing: "../components/jquery.easing/js/jquery.easing"
    jqueryColor: "../components/jquery-color/jquery.color"
    jqueryLazyload: "libs/jquery-lazyload"
    jqueryOverscroll: "../components/jquery-overscroll/src/jquery.overscroll"
    jqueryBrowserDetection: "../components/jquery-browser-detection/src/jquery.browser.detection"
    jqueryPlaceholder: "../components/jquery-placeholder/jquery.placeholder"
    jqueryHiddenHeight: "../components/jquery-hidden-height/src/jquery.hidden.height"
    tooltipster: "../components/tooltipster/js/jquery.tooltipster"
    underscore: "../components/underscore-amd/underscore"
    backbone: "../components/backbone-amd/backbone"
    backboneLocalStorage: "../components/backbone.localStorage/backbone.localStorage"
    backboneAnalytics: "../components/backbone.analytics/backbone.analytics"
    moment: "../components/moment/moment"
    templates: "../templates"

  shim:
    tooltipster:
      deps: ["jquery"]