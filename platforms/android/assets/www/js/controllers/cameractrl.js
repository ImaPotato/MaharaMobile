angular.module('Mahara').controller('CameraCtrl', function(
  $scope, $cordovaCamera, $cordovaLocalNotification, $q,
  $location, UuidGenerator, MimeGenerator, VideoEditor,
  SyncService, FileService) {

  $scope.objects = [];
  $scope.pageClass = 'camera';
  $scope.postStatus = '';

  $scope.addObject = function() {

    var obj = {
      uuid: UuidGenerator.generate(),
      uri: '//:0',
      type: 'image',
      title: '',
      tags: '',
      desc: '',
      edit: false
    };
    $scope.objects.push(obj);
  };

  //this is the default object
  $scope.addObject();

  /*
  Will need to come up with a better solution that will work with both ios and android
  but I guess i'll cross that bridge when I come to it...
  */

  $scope.getFileUri = function(imageData) {
    var q = $q.defer();
    // android seems to like to give us content url's instead of file urls, this should fix that.
    if (imageData.substring(0, 10) == "content://") {
      window.FilePath.resolveNativePath(imageData,
        function(result) {
          q.resolve(result);
        },
        function() {
          q.reject('something went wrong');
        }
      );
    } else {
      q.resolve(imageData.replace('content://', ''));
    }

    return q.promise;
  }

  $scope.getPicture = function(id, obj) {

    var options = {
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit : obj.edit
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.getFileUri(imageData).then(
        function(fileUri) {
          imageData = fileUri;
          for (var i = 0; i < $scope.objects.length; i++) {
            if ($scope.objects[i].uuid == id) {
              $scope.objects[i].uri = imageData;
            }
          }

          var image = document.getElementById(id);
          image.src = imageData;
          image.style.display = 'block';

        },
        function() {
          Materialize.toast('Error getting image', 4000);
        });

    }, function(err) {

    });
  };

  $scope.getFile = function(id){
    FileService.GetFile().then(function(uri){
      $scope.getFileUri(uri).then(function(fileUri){
        console.log(fileUri);
        var extensions = ['png', 'jpg', 'jpeg'];
        var fileType = fileUri.substring(fileUri.lastIndexOf('.') + 1, fileUri.length);
        console.log(fileType);
        var image = document.getElementById(id);
        var isImage = false;
        for (var i = 0; i < extensions.length; i++){
          if(extensions[i] == fileType){
            isImage = true;
          }
        }

        if(isImage){
          image.src = fileUri;
        } else {
          image.src = 'css/folder.png';
        }
        image.style.display = 'block';
        for (var i = 0; i < $scope.objects.length; i++) {
          if ($scope.objects[i].uuid == id) {
            $scope.objects[i].uri = 'file://' + fileUri;
            $scope.objects[i].type = isImage ? 'image' : 'file';

            console.log($scope.objects[i].type);
          }
        }
      });
    });
  }

  $scope.update = function() {
    var pending = localStorage.getItem('pending');
    pending = (pending != null && pending != '') ? JSON.parse(pending) : [];
    for (var i = 0; i < $scope.objects.length; i++) {
      if ($scope.objects[i].uri != '//:0') {
        pending.push({
          'uuid': $scope.objects[i].uuid,
          'type': $scope.objects[i].type,
          'title': $scope.objects[i].title,
          'desc': $scope.objects[i].desc,
          'tags': $scope.objects[i].tags,
          'uri': $scope.objects[i].uri
        });
      }
    }

    // update list of pending uploads
    localStorage.setItem('pending', JSON.stringify(pending));

    _.defer(function() {
      $scope.$apply(function() {
        $location.path("/history");
      });
    });

  };

  $scope.removeObject = function(id) {
    $.each($scope.objects, function(index, value) {
      if (value != null && value.uuid == id) {
        $scope.objects.splice(index, 1);
      }
    });
  };

  $scope.reset = function() {
    $scope.objects = [];
    $scope.addObject();
  };

});
