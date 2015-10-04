angular.module('Mahara').controller('HomeCtrl', function($scope, $location, InitService) {
  $scope.load = function() {
    $scope.pageClass = 'home';

    var user = JSON.parse(localStorage.getItem('user'));

    if (user == null || user == '') {

      InitService.init();

      _.defer(function() {
        $scope.$apply(function() {
          $location.path("/login");
        });
      });

    }
  };

  $scope.load();

});
