angular.module('Mahara').controller('SettingsCtrl', function($scope, $controller, SaveService, LoadService) {

  $controller('BaseCtrl', { $scope: $scope });

  $scope.loadSettings();


  $scope.setConnectionType = function(type){
    $scope.settings.connection.connectiontype = type.text;
  }

  $scope.save = function(){
    SaveService.saveSettings($scope.settings);
  }

  registerDropdown('journal-dropdown', 'journal-dropdown-content');
  registerDropdown('upload-dropdown', 'upload-dropdown-content');
  registerDropdown('tag-dropdown', 'tag-dropdown-content');
  registerDropdown('connection-dropdown', 'connection-dropdown-content');

  // I'm not proud of myself but here's a way of making dropdows work with angular...
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


});
