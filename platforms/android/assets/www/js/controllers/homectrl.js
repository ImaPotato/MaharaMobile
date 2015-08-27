angular.module('Mahara').controller('HomeCtrl', function($scope, AlertGenerator){

  $scope.load = function(){

    var user = JSON.parse(localStorage.getItem('user'));

    if (user == null || user == ''){

      // we should redirect them to the login page

      // maybe add an alert telling them to login :)
      // create a new alert, this will be displayed on the next page and then removed
      var alert = { type: "danger", msg: "Please log in" };
      AlertGenerator.addAlert(alert);

      // redirect back to the login page
      _.defer( function(){ $scope.$apply(function() { $location.path("/login"); });});

    } else {
      $scope.alerts = AlertGenerator.getAlerts();
      AlertGenerator.removeAllAlerts();
    }
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  $scope.load();


});
