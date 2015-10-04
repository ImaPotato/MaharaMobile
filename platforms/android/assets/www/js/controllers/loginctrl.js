angular.module('Mahara').controller('LoginCtrl', function($scope, $rootScope, $location, $cordovaInAppBrowser, $q, SyncService) {

  $scope.pageClass = 'login';
//    if(cordova != null)
//      $scope.device = cordova.platformId;
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
    }
  }

  $scope.load();

  $scope.update = function(login, connection) {

    // error checking
    if (login.username == '') {
      return;
    }

    if (login.token == '') {
      return;
    }

    if (login.url == '') {
      return;
    } else {
      // remove http:// | https:// if it exists, we will add this back on later.
      // login.url = login.url.replace(/^https?:\/\//,'')
    }

    if (connection.uploaduri == '') {
      return;
    }

    if (connection.syncuri == '') {
      return;
    }

    if (connection.connectiontype == '') {
      return;
    }

    // cool, we can now update the users login settings
    var user = {
      'login': {
        'username': login.username,
        'token': login.token.toLowerCase(),
        'url': login.url.toLowerCase()
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

    if ($scope.login.url == null || $scope.login.url == '')
      return;

    // test url to make sure it's valid...

    var q = $q.defer();
    $.ajax({
      type: "GET",
      url: $scope.login.url + "/api/mobile/test.php",
      crossDomain: true,
      dataType: 'jsonp',
      success: function(msg) {
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

      var win = window.open($scope.login.url + "/api/mobile/login.php", "_blank", "EnableViewPortScale=yes,location=no,toolbar=no,clearcache=yes, clearsessioncache=yes");

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
              console.log($scope.login.token);
              $('#token').scope().$apply();
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

  $scope.setConnectionType = function(type) {
    $scope.connection.connectiontype = type.text;
  }

  registerDropdown('connection-dropdown', 'connection-dropdown-content');

  // Sorry.
  function registerDropdown(dropdown1, dropdown2) {
    $('#' + dropdown1).on('click', function() {
      // get the button
      var button = document.getElementById(dropdown1);
      var rect = button.getBoundingClientRect();
      // make the dropdown content visible, and then shift it up the hight of the button that was pressed
      $('#' + dropdown2).addClass('active');
      $('#' + dropdown2).css({
        opacity: '1',
        display: 'block',
        position: 'absolute',
        overflow: 'block',
        'width': (button.offsetWidth + 1),
        marginTop: ('-' + (button.offsetHeight) + 'px')
      });
      //wait a fraction of a second before add new click handler.
      setTimeout(function() {
        $(document.body).click(function() {
          // hide the things, hopefully the click event triggered and everything is going swimingly.
          $('#' + dropdown2).removeClass('active');
          $('#' + dropdown2).css({
            opacity: '0',
            display: 'none'
          });
          $(document.body).unbind("click");
        });
      }, 50);
    });
  }

  $('select').material_select();

});
