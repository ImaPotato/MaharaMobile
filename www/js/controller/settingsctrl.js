angular.module('Mahara').controller('SettingsCtrl', function($scope, $controller, SaveService, LoadService) {

  $controller('BaseCtrl', { $scope: $scope });

  $scope.loadSettings();

  $scope.utctime = new Date($scope.settings.advanced.lastsynctime * 1000).toUTCString();

  $scope.setDefaultJournal = function(value){
    $scope.settings.defaultjournal = value;
  }

  $scope.setDefaultFolder = function(value){
    $scope.settings.defaultfolder = value;
  }

  $scope.setDefaultTag = function(value){
    $scope.settings.defaulttag = value;
  }

  $scope.setConnectionType = function(type){
    $scope.settings.connection.connectiontype = type.text;
  }

  $scope.triggerSync = function(){
    $('#triggersync').attr('disabled', true);
    //disable the save button till the sync has been completed.
    var s = LoadService.loadSync();
    s.send($scope.settings).then(function(success){
      SaveService.saveSettings($scope.settings);
      $('#triggersync').attr('disabled', false);
    });
  }

  $scope.save = function(){
    SaveService.saveSettings($scope.settings);
  }

  $scope.registerDropdown('journal-dropdown', 'journal-dropdown-content');
  $scope.registerDropdown('upload-dropdown', 'upload-dropdown-content');
  $scope.registerDropdown('tag-dropdown', 'tag-dropdown-content');
  $scope.registerDropdown('connection-dropdown', 'connection-dropdown-content');

});
