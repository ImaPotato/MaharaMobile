angular.module('Mahara').controller('HistoryCtrl', function($scope, $controller, LoadService, SaveService, SyncService) {
  $controller('BaseCtrl', { $scope: $scope });

  $scope.pending = [ ];
  $scope.history = [ ];

  $scope.getPending = function(){
    $scope.pending = LoadService.loadPending();
    $scope.history = LoadService.loadHistory();
    load($scope.pending, $scope.history);
  }

  $scope.processItem = function(i){

  }

  $scope.deleteItem = function(item){
    var index = $scope.pending.indexOf(item);
    $scope.pending.splice(index, 1);
    SaveService.setPending($scope.pending);
  }

  function load(pending, history){
    if(pending.length != 0)
      SyncService.syncPending(pending, history);
  }

  $scope.getPending();

});
