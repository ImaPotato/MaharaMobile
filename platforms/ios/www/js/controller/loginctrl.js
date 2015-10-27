angular.module('Mahara').controller('LoginCtrl', function($scope, $controller, LoadService, SaveService) {
  $controller('BaseCtrl', { $scope: $scope });

  $scope.settings = { };

  $scope.save = function(){
    $('#savebutton').attr('disabled', true);
    //disable the save button till the sync has been completed.
    var s = LoadService.loadSync();
    s.send($scope.settings).then(function(success){
      SaveService.saveSettings($scope.settings);
      $('#savebutton').attr('disabled', false);
    });
  }

  $scope.reset = function(){
    $scope.settings = LoadService.loadSettings();
  }

  $scope.webAuthentication = function(){
    if ($scope.settings.connection.maharauri == null || $scope.settings.connection.maharauri== '')
      return;

    $scope.settings.webAuthentication().then(function(){
      SaveService.saveSettings($scope.settings);
    });
  }

  $scope.reset();

});
