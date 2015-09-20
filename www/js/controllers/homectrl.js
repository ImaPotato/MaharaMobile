angular.module('Mahara').controller('HomeCtrl', function($scope, $location) {
  $scope.load = function() {
    $scope.pageClass = 'home';

    var user = JSON.parse(localStorage.getItem('user'));
    if (user == null || user == '') {
      // redirect back to the login page
      // sorry...
      // this is really bad but uh, on first login we redirect to the settings page to initialise the default settings before moving on to the login page
      // guess you could argue that is shows people how to get to the login page
      // sort of grasping at straws though
      // swear i'll make this better later... probably
      _.defer(function() {
        $scope.$apply(function() {
          $location.path("/settings");
        });
      });
    }

    /*
        // Android customization
            cordova.plugins.backgroundMode.setDefaults({ text:'Doing heavy tasks.'});
            // Enable background mode
            cordova.plugins.backgroundMode.enable();

            // Called when background mode has been activated
            cordova.plugins.backgroundMode.onactivate = function () {
                setTimeout(function () {
                    // Modify the currently displayed notification
                    cordova.plugins.backgroundMode.configure({
                        text:'Running in background for more than 5s now.'
                    });
                }, 5000);
            }
        */
  };

  $scope.load();

});
