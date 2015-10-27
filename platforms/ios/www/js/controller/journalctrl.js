angular.module('Mahara').controller('JournalCtrl', function($scope, $controller, $location, SaveService, LoadService) {
  $controller('BaseCtrl', { $scope: $scope });

  $scope.journals = [ ];

  $scope.addJournal = function(){
    $scope.journals.push(LoadService.loadJournal());
  }

  $scope.save = function(){
    var filtered = $scope.journals;
    SaveService.savePending(filtered);

    _.defer(function() {
      $scope.$apply(function() {
        $location.path("/history");
      });
    });
  }

  $scope.remove = function(journal){
    var index = $scope.journals.indexOf(journal);
    $scope.journals.splice(index, 1);
  }

  $scope.reset = function(){
    $scope.journals = [ ];
    $scope.addJournal();
  }

  $scope.addJournal();

});
