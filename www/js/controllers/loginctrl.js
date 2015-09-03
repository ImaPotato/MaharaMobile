angular.module('Mahara').controller('LoginCtrl', function($scope, $rootScope, $location, $cordovaInAppBrowser, $q, SyncService, AlertGenerator) {

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
    // create a new alert, this will be displayed on the next page and then removed

    Materialize.toast('Updated settings', 4000);

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
    var options = {
      location: 'yes',
      clearcache: 'yes',
      location: 'no',
      toolbar: 'no'
    };

    $cordovaInAppBrowser.open('http://10.22.33.121/~potato/mahara/htdocs/api/mobile/login.php', '_blank', options);

    $rootScope.$on('$cordovaInAppBrowser:loadstart', function(e, event) {
      console.log('started loading');
    });

    $rootScope.$on('$cordovaInAppBrowser:loadstop', function(e, event) {
      console.log('finished loading');

      var q = $q.defer();

      $.ajax({
        type: "GET",
        url: "js/controllers/inject/login.js",
        dataType: "text",
        success: function(msg) {
          $cordovaInAppBrowser.executeScript({
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
        $cordovaInAppBrowser.executeScript({
          code: 'getLoginStatus()'
        }, function(values) {
          var result = values[0];
          alert(result);
        }, function() {
          alert('failed');
        });
      });
    });

    $rootScope.$on('$cordovaInAppBrowser:exit', function(e, event) {
      alert('closed');
    });


  }

  // reload the user, angular will do the rest for us
  $scope.reset = function() {
    load();
  };

  $('select').material_select();

});
