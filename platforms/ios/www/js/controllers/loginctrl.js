angular.module('Mahara').controller('LoginCtrl', function($scope, $rootScope, $location, $cordovaInAppBrowser, $q, SyncService, UserService) {

  $scope.pageClass = 'login';
//    if(cordova != null)
//      $scope.device = cordova.platformId;
  $scope.load = function() {
    var user = UserService.getUser();
    $scope.login = user.login;
  }

  $scope.load();

  $scope.update = function(login) {
    // error checking
    if (login.username == '') {
      Materialize.toast('Check username', 4000);
      return;
    }

    if (login.token == '') {
      Materialize.toast('Check token', 4000);
      return;
    }

    if (login.url == '') {
      Materialize.toast('Check url', 4000);
      return;
    }

    UserService.saveUser(login)

    // sync notifications
    SyncService.sync();

    // redirect back to main page when ready
    _.defer(function() {
      $scope.$apply(function() {
        $location.path("/");
      });
    });
  };

  $scope.maharaLogin = function() {
    if ($scope.login.url == null || $scope.login.url == '')
      return;
    // test url to make sure it's valid...

    Materialize.toast('Checking URL', 4000);

    var q = $q.defer();
    $.ajax({
      type: "GET",
      url: $scope.login.url + "/api/mobile/test.php",
      crossDomain: true,
      dataType: 'jsonp',
      success: function(msg) {

        console.log(msg);

        if (msg.valid == 'true') {
          q.resolve();
        }
        q.reject();
        Materialize.toast('Enter a valid URL', 4000);
      },
      error: function() {
        q.reject();
        Materialize.toast('Enter a valid URL', 4000);
      }
    });

    q.promise.then(function() {
      var win = window.open($scope.login.url + "/api/mobile/login.php", "_system", "EnableViewPortScale=yes,location=no,toolbar=yes,clearcache=yes,clearsessioncache=yes");
      win.addEventListener("loadstop", function() {
        var q = $q.defer();
        $.ajax({
          type: "GET",
          url: "js/controllers/inject/login.js",
          dataType: "text",
          success: function(msg) {
            win.executeScript({
              code: msg
            });
            console.log('Injected code');
            q.resolve();
          },
          error: function() {
            console.log("Ajax Error");
            q.reject();
          }
        });

        q.promise.then(function() {
          win.executeScript({
            code: "getLoginStatus();"
          }, function(values) {
            if (values[0].loggedin == 1) {
              $scope.login.token = JSON.parse(values[0].token).token;
              $scope.login.username = JSON.parse(values[0].token).name;

              console.log($scope.login.token);
              console.log($scope.login.username);

              $('#token').scope().$apply();
              $('#username').scope().$apply();

              UserService.saveUser($scope.login)
              win.close();
            }
          });
        });
      });
    });
  }

  // reload the user, angular will do the rest for us
  $scope.reset = function() {
    load();
  };

  $('select').material_select();

});
