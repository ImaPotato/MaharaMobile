angular.module('Mahara').controller('JournalCtrl', function($scope, $controller, $location, SaveService, LoadService) {
  $controller('BaseCtrl', {
    $scope: $scope
  });

  $scope.journals = [];

  $scope.loadSettings();

  $scope.addJournal = function() {
    $scope.journals.push(LoadService.loadJournal());
  }

  $scope.addTag = function(tag, journal) {
    var index = journal.tags.indexOf(tag);
    if (index == -1)
      journal.tags.push(tag);
  }

  $scope.removeTag = function(tag, journal) {
    var index = journal.tags.indexOf(tag);
    journal.tags.splice(index, 1);
  }

  $scope.save = function() {
    var filtered = $scope.journals;
    SaveService.savePending(filtered);

    _.defer(function() {
      $scope.$apply(function() {
        $location.path("/history");
      });
    });
  }

  $scope.remove = function(journal) {
    var index = $scope.journals.indexOf(journal);
    $scope.journals.splice(index, 1);
  }

  $scope.reset = function() {
    $scope.journals = [];
    $scope.addJournal();
  }

  $scope.addJournal();

});
