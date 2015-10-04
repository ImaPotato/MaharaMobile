angular.module('Mahara').controller('SettingsCtrl', function($scope, $location, SyncService) {

  $scope.pageClass = 'settings';
  $scope.load = function(){
    var settings = JSON.parse(localStorage.getItem('settings'));
    //localStorage.setItem('settings', JSON.stringify(''));
    console.log(settings);

    if (settings != null && settings != '') {
      $scope.settings = { };
      $scope.settings.defaultjournalset = settings.defaultjournalset;
      $scope.settings.defaultjournal = settings.defaultjournal;

      $scope.settings.uploadfolderset = settings.uploadfolderset;
      $scope.settings.uploadfolder = settings.uploadfolder;

      $scope.settings.uploadtagsset = settings.uploadtagsset;
      $scope.settings.uploadtags = settings.uploadtags;

      $scope.settings.notification = { };
      $scope.settings.notification.user = settings.notification.user;
      $scope.settings.notification.feedback = settings.notification.feedback;
      $scope.settings.notification.posts = settings.notification.posts;
      $scope.settings.notification.mahara = settings.notification.mahara;

      $scope.settings.advanced = { };
      $scope.settings.advanced.periodicsync = settings.advanced.periodicsync;
      $scope.settings.advanced.lastsynctime = settings.advanced.lastsynctime;

    } else {
      $scope.settings = { };
      $scope.settings.defaultjournalset = false;
      $scope.settings.defaultjournal = '';

      $scope.settings.uploadfolderset = false;
      $scope.settings.uploadfolder = '';

      $scope.settings.uploadtagsset = false;
      $scope.settings.uploadtags = '';

      $scope.settings.notification = { };
      $scope.settings.notification.user = true;
      $scope.settings.notification.feedback = true;
      $scope.settings.notification.posts = true;
      $scope.settings.notification.mahara = true;

      $scope.settings.advanced = { };
      $scope.settings.advanced.periodicsync = 15;
      $scope.settings.advanced.lastsynctime = '';
    }
  }

  $scope.load();

  $scope.save = function(settings){
    // cool, we can now update the users login settings

    console.log(settings);

    // store everything
    localStorage.setItem('settings', JSON.stringify(settings));
    
    // sync notifications
    SyncService.sync();

    Materialize.toast('Updated settings', 4000);

    // redirect back to main page when ready
    _.defer(function() {
      $scope.$apply(function() {
        $location.path("/");
      });
    });

  }

  $scope.reset = function(){
    $scope.load();
  }

})
