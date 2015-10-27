angular.module('Mahara').controller('FileCtrl', function($scope, $controller, $location, SaveService, LoadService) {

  $controller('BaseCtrl', { $scope: $scope });

  if(typeof device !== 'undefined')
    $scope.dp = device.platform;

  console.log(device);

  $scope.files = [ ];

  $scope.addFile = function(){
    $scope.files.push(LoadService.loadFile());
  }

  $scope.getFile = function(file){
    var index = $scope.files.indexOf(file);
    var q = $scope.files[index].getFile();

    q.then(function(result){
      console.log(result);
      $scope.files[index].uri = result.path;
      $scope.files[index].type = result.type;
    })
  }

  $scope.getPicture = function(file){
    var index = $scope.files.indexOf(file);
    var q = $scope.files[index].getPicture();

    q.then(function(result){
      console.log(result);
      $scope.files[index].uri = result.path;
      $scope.files[index].type = result.type;
    })
  }

  $scope.getPictureFromLibrary = function(file){
    var index = $scope.files.indexOf(file);
    var q = $scope.files[index].getPictureFromLibrary();

    q.then(function(result){
      console.log(result);
      $scope.files[index].uri = result.path;
      $scope.files[index].type = result.type;
    })
  }

  $scope.remove = function(file){
    var index = $scope.files.indexOf(file);
    $scope.files.splice(index, 1);
  }

  $scope.save = function(){
    //filter empty files
    var filtered = $scope.files.filter(function(file){
      return file.uri != '';
    });

    SaveService.savePending(filtered);

    _.defer(function() {
      $scope.$apply(function() {
        $location.path("/history");
      });
    });

  }

  $scope.reset = function(){
    $scope.files = [ ];
    $scope.addFile();
  }

  $scope.addFile();

});
