angular.module('Mahara').controller('SettingsCtrl', function($scope, $location, SyncService, SettingsService) {

  $scope.pageClass = 'settings';

  $scope.load = function() {
    // folder
    var folder = JSON.parse(localStorage.getItem('activity'));
    $scope.uploadfolder = (folder == null || folder == '') ? [] : folder;
    // blogs
    var blogs = JSON.parse(localStorage.getItem('blogs'));
    $scope.blogs = (blogs == null || blogs == '') ? [] : blogs;
    // tags
    var tags = JSON.parse(localStorage.getItem('tags'));
    $scope.tags = (tags == null || tags == '') ? [] : tags;
    $scope.settings = SettingsService.getSettings();
  }

  $scope.load();

  $scope.save = function(settings) {
    // store everything
    SettingsService.saveSettings(settings);
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

  // unlocks the sync and upload settings
  $scope.unlock = function() {
    $(':disabled').prop('disabled', false);
  }

  $scope.setConnectionType = function(type) {
    $scope.settings.connection.connectiontype = type.text;
  }

  registerDropdown('journal-dropdown', 'journal-dropdown-content');
  registerDropdown('upload-dropdown', 'upload-dropdown-content');
  registerDropdown('tag-dropdown', 'tag-dropdown-content');
  registerDropdown('connection-dropdown', 'connection-dropdown-content');

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
