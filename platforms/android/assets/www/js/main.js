var app = angular.module('tutorialWebApp', [
  'ngRoute', 'ngCordova', 'uuid4'
]);

app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when("/login", {templateUrl: "partials/login.html", controller: "LoginCtrl"})
    .when("/camera", {templateUrl: "partials/camera.html", controller: "CameraCtrl"})
    .when("/gallery", {templateUrl: "partials/gallery.html", controller: "LoginCtrl"})
    .when("/", {templateUrl: "partials/home.html", controller: "LoginCtrl"})
    .when("/journal", {templateUrl: "partials/journal.html", controller: "JournalCtrl"})
    .when("/settings", {templateUrl: "partials/settings.html", controller: "LoginCtrl"})
    .otherwise("/404", {templateUrl: "partials/404.html", controller: "PageCtrl"});
}]);


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
      $scope.connection = {uploaduri : user.connection.uploaduri, syncuri : user.connection.syncuri, connectiontype : user.connection.connectiontype};
      $scope.login = {username : user.login.username, token : user.login.token, url : user.login.url};
    } else {
      $scope.connection = { uploaduri : '/api/mobile/upload.php', syncuri : '/api/mobile/sync.php', connectiontype : 'Default'};
      $scope.login = {username : '', token : '', url : ''};
    }
  }

  load();

  $scope.update = function(login, connection) {
    var user =  { 'login' : 
                  {
                    'username' : login.username, 'token' : login.token, 'url': login.url 
                  },
                  'connection' : {
                    'uploaduri' : connection.uploaduri, 'syncuri' : connection.syncuri, 'connectiontype' : connection.connectiontype
                  }
                };
    
    localStorage.setItem('user', JSON.stringify(user));

    // validate
  };

  $scope.unlock = function(){
    $(':disabled').prop('disabled', false);
  }

  $scope.reset = function() {
    load();
  };

  $scope.reset();

});

app.controller('JournalCtrl', function($scope, Camera){
    $scope.objects = [];
    //$scope.networkstate = navigator.connection.type;
    var obj = {
            title:'',
            tags:'',
            desc:''
        };
        $scope.objects.push(obj);

    $scope.addObject = function () {
        var obj = {
            title:'',
            tags:'',
            desc:''
        };
        $scope.objects.push(obj);
    };

    $scope.removeObject = function (id) {
        $scope.objects.splice(id, 1);
    };
      
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

    $scope.update = function(){

    }

    $scope.removeObject = function (id) {
        $scope.objects.splice(id, 1);
    };
      
    $scope.reset = function () {
        $scope.objects = [];
    };

});

