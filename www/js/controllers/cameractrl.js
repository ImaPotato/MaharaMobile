angular.module('Mahara').controller('CameraCtrl', function($scope, $cordovaCamera, $cordovaLocalNotification, UuidGenerator, MimeGenerator, VideoEditor, SyncService) {

  $scope.objects = [];

  $scope.postStatus = '';

  $scope.addObject = function() {
    var obj = {
      uuid: UuidGenerator.generate(),
      uri: '//:0',
      title: '',
      tags: '',
      desc: ''
    };

    $scope.objects.push(obj);
  };

  //this is the default object
  $scope.addObject();

  $scope.getPicture = function(id) {

    var options = {
      destinationType: Camera.DestinationType.FILE_URL,
      sourceType: Camera.PictureSourceType.CAMERA
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {

      $.each($scope.objects, function(index, value) {
        if (value.uuid == id) {
          value.src = imageData;
        }
      });

      var image = document.getElementById(id);
      image.src = imageData;
      image.style.display = 'block';

    }, function(err) {

    });
  };

  $scope.getPictureFromLibrary = function(id) {

    var options = {
      destinationType: Camera.DestinationType.FILE_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {

      if (imageData.substring(0, 21) == "content://com.android") {
        var photo_split = imageData.split("%3A");
        imageData = "content://media/external/images/media/" + photo_split[1];
      }

      $.each($scope.objects, function(index, value) {
        if (value.uuid == id) {
          value.src = imageData;
        }
      });

      var image = document.getElementById(id);
      image.src = imageData;
      image.style.display = 'block';

    }, function(err) {

    });

  };

  $scope.update = function(objects) {

    var pending = JSON.parse(localStorage.getItem('pending'));

    pending = (pending != null && pending != '') ? pending : [];

    console.log(pending);

    // might need to load settings as well
    $.each(objects, function(index, value) {
      pending.push({
        'uuid': value.uuid,
        'title': value.title,
        'desc': value.desc,
        'tags': value.tags,
        'uri': value.uri
      });
    });

    console.log(pending);
    // update list of pending uploads
    localStorage.setItem('pending', JSON.stringify(pending));
    console.log(SyncService.sync(UuidGenerator, MimeGenerator));

  };

  $scope.removeObject = function(id) {
    $.each($scope.objects, function(index, value) {
      if (value.uuid == id) {
        $scope.objects.splice(index, 1);
      }
    });
  };

  $scope.reset = function() {
    $scope.objects = [];
  };

});
