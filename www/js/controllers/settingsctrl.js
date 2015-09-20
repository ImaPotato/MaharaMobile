angular.module('Mahara').controller('SettingsCtrl', function($scope, $location, SyncService) {
//    if(cordova != null)
//  $scope.device = cordova.platformId;

  $scope.pageClass = 'settings';

  $scope.load = function() {
    var settings = JSON.parse(localStorage.getItem('settings'));
    // folder
    var folder = JSON.parse(localStorage.getItem('folder'));
    $scope.folder = (folder == null || folder == '') ? [] : folder;
    console.log($scope.activity);
    // blogs
    var blogs = JSON.parse(localStorage.getItem('blogs'));
    $scope.blogs = (blogs == null || blogs == '') ? [] : blogs;
    console.log($scope.blogs);
    // tags
    var tags = JSON.parse(localStorage.getItem('tags'));
    $scope.tags = (tags == null || tags == '') ? [] : tags;
    console.log($scope.tags);

    if (settings != null && settings != '') {

      $scope.settings = {};
      $scope.settings.defaultjournalset = settings.defaultjournalset;
      $scope.settings.defaultjournal = settings.defaultjournal;

      $scope.settings.uploadfolderset = settings.uploadfolderset;
      $scope.settings.uploadfolder = settings.uploadfolder;

      $scope.settings.uploadtagsset = settings.uploadtagsset;
      $scope.settings.uploadtags = settings.uploadtags;

      $scope.settings.notification = {};
      $scope.settings.notification.user = settings.notification.user;
      $scope.settings.notification.feedback = settings.notification.feedback;
      $scope.settings.notification.posts = settings.notification.posts;
      $scope.settings.notification.mahara = settings.notification.mahara;

      $scope.settings.advanced = {};
      $scope.settings.advanced.periodicsync = settings.advanced.periodicsync;
      $scope.settings.advanced.lastsynctime = settings.advanced.lastsynctime;

    } else {

      // init

      $scope.settings = {};
      $scope.settings.defaultjournalset = false;
      $scope.settings.defaultjournal = '';

      $scope.settings.uploadfolderset = false;
      $scope.settings.uploadfolder = '';

      $scope.settings.uploadtagsset = false;
      $scope.settings.uploadtags = '';

      $scope.settings.notification = {};
      $scope.settings.notification.user = true;
      $scope.settings.notification.feedback = true;
      $scope.settings.notification.posts = true;
      $scope.settings.notification.mahara = true;

      $scope.settings.advanced = {};
      $scope.settings.advanced.periodicsync = 15;
      $scope.settings.advanced.lastsynctime = 0;

      localStorage.setItem('settings', JSON.stringify($scope.settings));

      _.defer(function() {
        $scope.$apply(function() {
          $location.path("/login");
        });
      });

    }
  }

  $scope.load();

  $scope.save = function(settings) {
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

  $scope.setDefaultTag = function(tag) {
    $scope.settings.uploadtags = tag.tag;
  }

  $scope.setDefaultJournal = function(journal) {
    $scope.settings.defaultjournal = journal.blog;
  }

  $scope.setUploadFolder = function(folder) {
    $scope.settings.uploadfolder = folder.folder;
  }

  $scope.reset = function() {
    $scope.load();
  }

  registerDropdown('journal-dropdown', 'journal-dropdown-content');
  registerDropdown('upload-dropdown', 'upload-dropdown-content');
  registerDropdown('tag-dropdown', 'tag-dropdown-content');

  // I'm not proud of myself but here's my way of making dropdows work with angular...
  // Did i mention I will need to do this three times?
  // Sorry.
  function registerDropdown(dropdown1, dropdown2) {
    $('#' + dropdown1).on('click', function() {
      // get the button
      var button = document.getElementById(dropdown1);
      var rect = button.getBoundingClientRect();
      // make the dropdown content visible, and then shift it up the hight of the button that was pressed
      $('#' + dropdown2).addClass('active');
      $('#' + dropdown2).css({
        opacity: '1',
        display: 'block',
        position: 'absolute',
        overflow: 'block',
        'width': (button.offsetWidth + 1),
        marginTop: ('-' + (button.offsetHeight) + 'px')
      });
      //wait a fraction of a second before add new click handler.
      setTimeout(function() {
        $(document.body).click(function() {
          // hide the things, hopefully the click event triggered and everything is going swimingly.
          $('#' + dropdown2).removeClass('active');
          $('#' + dropdown2).css({
            opacity: '0',
            display: 'none'
          });
          $(document.body).unbind("click");
        });
      }, 50);
    });
  }
})
