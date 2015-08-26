angular.module('Mahara').controller('JournalCtrl', function($scope, UuidGenerator){
    $scope.objects = [];
    //$scope.networkstate = navigator.connection.type;
    var obj = {
            uuid: UuidGenerator.generate(),
            title:'',
            tags:'',
            desc:''
        };
    // automatially create the first image
    $scope.objects.push(obj);

    // add another photo
    $scope.addObject = function () {
        var obj = {
            uuid: UuidGenerator.generate(),
            title:'',
            tags:'',
            desc:''
        };

        $scope.objects.push(obj);
    };

    $scope.removeObject = function (id) {
        $.each($scope.objects, function(index, value){
          if (value.uuid == id){
            $scope.objects.splice(index, 1);
          }
        });
    };

    $scope.update = function(objects){

      var pending = JSON.parse(localStorage.getItem('pending'));

      pending = (pending != null && pending != '') ? pending : [];

      console.log(pending);

      // might need to load settings as well
      // add each journal the list of pending posts
      $.each(objects, function(index, value){
        pending.push({
          'uuid' : value.uuid,
          'title' : value.title,
          'desc' : value.desc,
          'tags' : value.tags
        });
      });

      console.log(pending);

      // update list of pending uploads
      localStorage.setItem('pending', JSON.stringify(pending));

      // trigger upload

    }

    $scope.reset = function () {
        $scope.objects = [];
    };

});
