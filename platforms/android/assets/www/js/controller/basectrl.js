angular.module('Mahara').controller('BaseCtrl', function($scope, SaveService, LoadService) {

  $scope.settings = { };

  $scope.loadSettings = function(){
    $scope.settings = LoadService.loadSettings();
  }

  $scope.saveSettings = function(){
    SaveService.saveSettings($scope.settings);
  }

  $scope.hack = function(dropdown1, dropdown2){

      console.log(dropdown1, dropdown2);
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

  }

  $scope.registerDropdown = function(dropdown1, dropdown2) {
    $('#' + dropdown1).on('click', function(){
      console.log(dropdown1, dropdown2);
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
  };
});
