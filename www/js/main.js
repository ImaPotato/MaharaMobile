if (window.openDatabase) {

    var dbSize = 5 * 1024 * 1024; // 5MB

    db = openDatabase("MaharaDB", "", "Mahara", dbSize);

    db.transaction(function (t) {
      /*
        t.executeSql("CREATE TABLE IF NOT EXISTS user
          (
            id INTEGER UNIQUE ASC, 
            username TEXT PRIMARY KEY, 
            token TEXT, 
            url TEXT,
            sync_uri TEXT,
            upload_uri TEXT,
            connection_type
            )"
        );

        t.executeSql("CREATE TABLE IF NOT EXISTS pending
          (
            id INTEGER UNIQUE ASC,
            image_uri,
            title TEXT,
            description TEXT,
            tags TEXT,
            status BIT
          )"
        );

        t.executeSql("CREATE TABLE IF NOT EXISTS history
          (
            id INTEGER UNIQUE ASC,
            image_uri,
            title TEXT,
            description TEXT,
            tags TEXT,
            status BIT
          )"
        );

        t.executeSQL("CREATE TABLE IF NOT EXISITS settings
          (
            id INTEGER UNIQUE ASC,
            username TEXT
          )"
        );
  */
    });


} else {
    alert("WebSQL is not supported by your browser!");
}

var app = angular.module('tutorialWebApp', [
  'ngRoute', 'ngCordova'
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

/**
 * Controls all other Pages
 */
app.controller('PageCtrl', function (/* $scope, $location, $http */) {
  
});

app.controller('LoginCtrl', function($scope, $location){
    $scope.master = {};

    db.transaction(function (t) {
    
      t.executeSql('SELECT TOP 1 * FROM user', [], function (tx, result) {
        if(result.rows.length == 0){
          
        } else {
          
        }
      };
    });

    $scope.update = function(login) {
      if(db){

      }
    };

    $scope.reset = function() {

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

app.controller('CameraCtrl', function($scope, $cordovaCamera){

    $scope.objects = [];

    var obj = {
            uri: '',
            title:'',
            tags:'',
            desc:''
        };
        $scope.objects.push(obj);

    $scope.addObject = function () {
        var obj = {
            uri: '',
            title:'',
            tags:'',
            desc:''
        };
        $scope.objects.push(obj);
    };

    $scope.getPicture = function (id) {

      var options = {
        destinationType: Camera.DestinationType.FILE_URL,
        sourceType: Camera.PictureSourceType.CAMERA
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {
        var image = document.getElementById('image'+id);
        image.src = "" + imageData;
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

        var image = document.getElementById('image'+id);
        image.src = imageData;
        image.style.display = 'block';
      }, function(err) {

      });

    };


    $scope.removeObject = function (id) {
        $scope.objects.splice(id, 1);
    };
      
    $scope.reset = function () {
        $scope.objects = [];
    };

});

