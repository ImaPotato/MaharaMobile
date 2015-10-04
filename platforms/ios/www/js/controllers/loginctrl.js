angular.module('Mahara').controller('LoginCtrl', function($scope, $rootScope, $location, $cordovaInAppBrowser, $q, SyncService) {

  $scope.pageClass = 'login';
  $scope.load = function() {
    var user = JSON.parse(localStorage.getItem('user'));
    if (user != null && user != '') {
      // load user from memory
      $scope.connection = {
        uploaduri: user.connection.uploaduri,
        syncuri: user.connection.syncuri,
        connectiontype: user.connection.connectiontype
      };
      $scope.login = {
        username: user.login.username,
        token: user.login.token,
        url: user.login.url
      };
    } else {
      // default values
      $scope.connection = {
        uploaduri: '/api/mobile/upload.php',
        syncuri: '/api/mobile/sync.php',
        connectiontype: 'Default'
      };
      $scope.login = {
        username: '',
        token: '',
        url: ''
      };
    }
  }

  $scope.load();

  $scope.update = function(login, connection) {

    console.log(login);
    console.log(connection);

    // error checking
    if (login.username == '') {

    }

    if (login.token == '') {

    }

    if (login.url == '') {

    } else {
      // remove http:// | https:// if it exists, we will add this back on later.
      // login.url = login.url.replace(/^https?:\/\//,'')
    }

    if (connection.uploaduri == '') {

    }

    if (connection.syncuri == '') {

    }

    if (connection.connectiontype == '') {

    }

    // cool, we can now update the users login settings
    var user = {
      'login': {
        'username': login.username,
        'token': login.token.toLowerCase(),
        'url': login.url
      },
      'connection': {
        'uploaduri': connection.uploaduri,
        'syncuri': connection.syncuri,
        'connectiontype': connection.connectiontype
      }
    };
    // store everything
    localStorage.setItem('user', JSON.stringify(user));
    // sync notifications
    SyncService.sync();

    // redirect back to main page when ready
    _.defer(function() {
      $scope.$apply(function() {
        $location.path("/");
      });
    });
  };

  // unlocks the sync and upload settings
  $scope.unlock = function() {
    $(':disabled').prop('disabled', false);
  }

  $scope.maharaLogin = function() {

    var win = window.open("http://10.22.33.121/~potato/mahara/htdocs/api/mobile/login.php", "_blank", "EnableViewPortScale=yes,location=no,toolbar=no,clearcache=yes, clearsessioncache=yes");
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

          if(values[0].loggedin == 1){

            $scope.login.token = JSON.parse(values[0].token).token;
            console.log($scope.login.token);
            $('#token').scope().$apply();
            win.close();
          }

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
