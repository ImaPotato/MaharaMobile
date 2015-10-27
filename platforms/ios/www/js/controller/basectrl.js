angular.module('Mahara').controller('BaseCtrl', function($scope, SaveService, LoadService) {

  $scope.settings = { };

  $scope.loadSettings = function(){
    $scope.settings = LoadService.loadSettings();
  }

  $scope.saveSettings = function(){
    SaveService.saveSettings($scope.settings);
  }

});
