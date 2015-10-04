angular.module('Mahara').controller('HomeCtrl', function($scope, $location){

  $scope.load = function(){

    $scope.pageClass = 'home';

    var user = JSON.parse(localStorage.getItem('user'));
    localStorage.setItem('pending', []);

    if (user == null || user == ''){

      // redirect back to the login page
      _.defer( function(){ $scope.$apply(function() { $location.path("/login"); });});

    }
  };

  $scope.load();


});
