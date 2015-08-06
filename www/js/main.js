var app = angular.module('Mahara', [
  'ngRoute', 'ngCordova', 'uuid4'
]);

app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when("/", {templateUrl: "partials/home.html", controller: "LoginCtrl"})
    .when("/login", {templateUrl: "partials/login.html", controller: "LoginCtrl"})
    .when("/camera", {templateUrl: "partials/camera.html", controller: "CameraCtrl"})
    .when("/journal", {templateUrl: "partials/journal.html", controller: "JournalCtrl"})
    .when("/settings", {templateUrl: "partials/settings.html", controller: "LoginCtrl"})
    .otherwise("/404", {templateUrl: "partials/404.html", controller: "PageCtrl"});
}]);

// so we can generate a unique uuid for each image and journal
app.factory('UuidGenerator', function(uuid4){
  return {
    generate: function() {
      return  uuid4.generate();
    }
  };
});

/**
 * Controls all other Pages
 */
app.controller('PageCtrl', function (/* $scope, $location, $http */) {
  
});

app.controller('LoginCtrl', function($scope, $location){
  $scope.master = {};

  function load(){
    var user = JSON.parse(localStorage.getItem('user'));

    if (user != null && user != ''){
      // if we have something stored we should probably show that
      $scope.connection = {uploaduri : user.connection.uploaduri, syncuri : user.connection.syncuri, connectiontype : user.connection.connectiontype};
      $scope.login = {username : user.login.username, token : user.login.token, url : user.login.url};
    } else {
      // default values
      $scope.connection = { uploaduri : '/api/mobile/upload.php', syncuri : '/api/mobile/sync.php', connectiontype : 'Default'};
      $scope.login = {username : '', token : '', url : ''};
    }
  }

  load();

  $scope.update = function(login, connection) {
    // update the users connection settings
    var user =  { 'login' : 
                  {
                    'username' : login.username, 'token' : login.token, 'url': login.url 
                  },
                  'connection' : {
                    'uploaduri' : connection.uploaduri, 'syncuri' : connection.syncuri, 'connectiontype' : connection.connectiontype
                  }
                };
    
    localStorage.setItem('user', JSON.stringify(user));

    // validate user
    
  };

  $scope.unlock = function(){
    // unlocks the sync and upload settings
    $(':disabled').prop('disabled', false);
  }

  $scope.reset = function() {
    // reload the user, angular will do the rest for us
    load();
  };

  $scope.reset();

});

app.controller('JournalCtrl', function($scope, UuidGenerator){
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

app.controller('CameraCtrl', function($scope, $cordovaCamera, UuidGenerator){

    $scope.objects = [];

    var obj = {
            uuid: UuidGenerator.generate(),
            uri: '//:0',
            title:'',
            tags:'',
            desc:''
        };

        $scope.objects.push(obj);

    $scope.addObject = function () {
        var obj = {
            uuid: UuidGenerator.generate(),
            uri: '//:0',
            title:'',
            tags:'',
            desc:''
        };

        $scope.objects.push(obj);
    };

    $scope.getPicture = function (id) {

      console.log(id);

      var options = {
        destinationType: Camera.DestinationType.FILE_URL,
        sourceType: Camera.PictureSourceType.CAMERA
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {

        $.each($scope.objects, function(index, value){
          if (value.uuid == id){
            value.src = imageData;
          }
        });

        var image = document.getElementById(id);
        image.src = imageData;
        image.style.display = 'block';

      }, function(err) {

      });
    };

    $scope.getPictureFromLibrary = function (id) {

      var options = {
        destinationType: Camera.DestinationType.FILE_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {

        if (imageData.substring(0,21)=="content://com.android") {
          var photo_split=imageData.split("%3A");
          imageData="content://media/external/images/media/"+photo_split[1];
        }

        $.each($scope.objects, function(index, value){
          if (value.uuid == id){
            value.src = imageData;
          }
        });

        var image = document.getElementById('image'+id);
        image.src = imageData;
        image.style.display = 'block';

      }, function(err) {

      });

    };

    $scope.update = function(objects){

      var pending = JSON.parse(localStorage.getItem('pending'));
      
      pending = (pending != null && pending != '') ? pending : [];

      console.log(pending);

      // might need to load settings as well
      $.each(objects, function(index, value){
        pending.push({
          'uuid' : value.uuid,
          'title' : value.title,
          'desc' : value.desc,
          'tags' : value.tags,
          'uri' : value.uri
        });
      });

      console.log(pending);

      // update list of pending uploads
      localStorage.setItem('pending', JSON.stringify(pending));

      // trigger upload
      var user = JSON.parse(localStorage.getItem('user'))

      console.log(user.login.url + user.connection.syncuri)

      var data =  {
            'token' : '28cdd218f7ec5616df9949066881ce23',
            'username' : user.login.username,
            'lastsync' : '0',
            'notifications' : 'feedback,newpost,maharamessage,usermessages'
          };

        $.ajax({
          type: "POST",
          dataType: 'jsonp',
          url: user.login.url + user.connection.syncuri + '/',
          data: data,

          success: function (data) {
            console.log(data);
          }

        });
    };

    $scope.removeObject = function (id) {
        $.each($scope.objects, function(index, value){
          if (value.uuid == id){
            $scope.objects.splice(index, 1);
          }
        });
    };

      
    $scope.reset = function () {
        $scope.objects = [];
    };

});

