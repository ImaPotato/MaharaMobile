angular.module('Mahara').controller('LoginCtrl', function($scope, $location, SyncService, AlertGenerator){

  $scope.load = function(){

    var user = JSON.parse(localStorage.getItem('user'));

    if (user != null && user != ''){
      // load user from memory
      $scope.connection = {uploaduri : user.connection.uploaduri, syncuri : user.connection.syncuri, connectiontype : user.connection.connectiontype};
      $scope.login = {username : user.login.username, token : user.login.token, url : user.login.url};
    } else {
      // default values
      $scope.connection = { uploaduri : '/api/mobile/upload.php', syncuri : '/api/mobile/sync.php', connectiontype : 'Default'};
      $scope.login = {username : '', token : '', url : ''};
    }

  }

  $scope.load();

  $scope.update = function(login, connection) {

    // error checking
    if (login.username == ''){

    }

    if (login.token == ''){

    }

    if (login.url == ''){

    } else {
      // remove http:// | https:// if it exists, we will add this back on later.
      // login.url = login.url.replace(/^https?:\/\//,'')
    }

    if (connection.uploaduri == ''){

    }

    if (connection.syncuri == ''){

    }

    if (connection.connectiontype == ''){

    }

    // cool, we can now update the users login settings
    var user =  { 'login' :
                  {
                    'username' : login.username, 'token' : login.token.toLowerCase(), 'url': login.url
                  },
                  'connection' : {
                    'uploaduri' : connection.uploaduri, 'syncuri' : connection.syncuri, 'connectiontype' : connection.connectiontype
                  }
                };

    // store everything
    localStorage.setItem('user', JSON.stringify(user));

    // sync notifications
    SyncService.sync();

    // create a new alert, this will be displayed on the next page and then removed
    var alert = { type: "success", msg: "Settings successfully updated." };
    AlertGenerator.addAlert(alert);

    // redirect back to main page when ready
    _.defer( function(){ $scope.$apply(function() { $location.path("/"); });});

  };

  // unlocks the sync and upload settings
  $scope.unlock = function(){
    $(':disabled').prop('disabled', false);
  }

  // reload the user, angular will do the rest for us
  $scope.reset = function() {
    load();
  };

});
