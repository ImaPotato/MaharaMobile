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
      controller: "FileCtrl"
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

/**
 * Controls all other Pages
 */
app.controller('PageCtrl', function() {

});

FastClick.attach(document.body);
