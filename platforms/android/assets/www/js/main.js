var app = angular.module('Mahara', [
  'ngRoute', 'ngCordova', 'uuid4', 'ngAnimate'
]);

// routing
app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "partials/home.html",
      controller: "HomeCtrl"
    })
    .when("/login", {
      templateUrl: "partials/login.html",
      controller: "LoginCtrl"
    })
    .when("/camera", {
      templateUrl: "partials/camera.html",
      controller: "CameraCtrl"
    })
    .when("/journal", {
      templateUrl: "partials/journal.html",
      controller: "JournalCtrl"
    })
    .when("/settings", {
      templateUrl: "partials/settings.html",
      controller: "SettingsCtrl"
    })
    .when("/history", {
      templateUrl: "partials/history.html",
      controller: "HistoryCtrl"
    })
    .otherwise("/404", {
      templateUrl: "partials/404.html"
    });
}]);

// so we can generate a unique uuid for each image and journal
app.factory('UuidGenerator', function(uuid4) {
  return {
    generate: function() {
      return uuid4.generate();
    }
  };
});

// I wonder if this works?
app.factory('VideoEditor', ['$q', function($q) {

  return {

    transcode: function(uri, output, quality, filetype, network, duration, save) {
      var q = $q.defer();

      function errorState() {
        q.reject();
      }

      function success() {
        q.resolve();
      }

      VideoEditor.transcodeVideo(
        success, // success cb
        error, // error cb
        {
          fileUri: uri, // the path to the video on the device
          outputFileName: output, // the file name for the transcoded video
          quality: quality, // High: 0, Medium: 1, Low: 2
          outputFileType: filetype, // M4V: 0, MPEG4: 1, M4A: 2, QUICK_TIME: 3
          optimizeForNetworkUse: network, // Yes: 0, No: 1
          duration: duration, // optional, specify duration in seconds from start of video
          saveToLibrary: save // optional, defaults to true
        }
      )

      return q.promise;

    }
  };

}]);

/**
 * Controls all other Pages
 */
app.controller('PageCtrl', function() {

});

FastClick.attach(document.body);
