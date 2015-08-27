var app = angular.module('Mahara', [
  'ngRoute', 'ngCordova', 'uuid4', 'ui.bootstrap'
]);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "partials/home.html",
      controller: "HomeCtrl"
    })
    .when("/login", {
      templateUrl: "partials/login.html",
      controller: "LoginCtrl"
    })
    .when("/camera", {
      templateUrl: "partials/camera.html",
      controller: "CameraCtrl"
    })
    .when("/journal", {
      templateUrl: "partials/journal.html",
      controller: "JournalCtrl"
    })
    .when("/settings", {
      templateUrl: "partials/settings.html",
      controller: "SettingsCtrl"
    })
    .otherwise("/404", {
      templateUrl: "partials/404.html",
      controller: "PageCtrl"
    });
}]);

// so we can generate a unique uuid for each image and journal
app.factory('UuidGenerator', function(uuid4) {
  return {
    generate: function() {
      return uuid4.generate();
    }
  };
});


// To do make sure this actually works
app.factory('VideoEditor', ['$q', function($q) {

  return {

    transcode: function(uri, output, quality, filetype, network, duration, save) {
      var q = $q.defer();

      function errorState() {
        q.reject();
      }

      function success() {
        q.resolve();
      }

      VideoEditor.transcodeVideo(
        success, // success cb
        error, // error cb
        {
          fileUri: uri, // the path to the video on the device
          outputFileName: output, // the file name for the transcoded video
          quality: quality, // High: 0, Medium: 1, Low: 2
          outputFileType: filetype, // M4V: 0, MPEG4: 1, M4A: 2, QUICK_TIME: 3
          optimizeForNetworkUse: network, // Yes: 0, No: 1
          duration: duration, // optional, specify duration in seconds from start of video
          saveToLibrary: save // optional, defaults to true
        }
      )

      return q.promise;

    }
  };

}]);

app.factory('AlertGenerator', function() {

  return {
    addAlert: function(alert) {
      var alerts = JSON.parse(localStorage.getItem('alerts'));
      if (alerts == null || alerts == '') {
        alerts = [];
      }
      alerts.push(alert);
      localStorage.setItem('alerts', JSON.stringify(alerts));
    },
    getAlerts: function() {
      var alerts = JSON.parse(localStorage.getItem('alerts'));
      alerts = alerts != null ? alerts : [];
      return alerts;
    },
    removeAllAlerts: function() {
      var alerts = [];
      localStorage.setItem('alerts', JSON.stringify(alerts));
    }
  }
});

app.factory('MimeGenerator', function() {
  return {
    generateForm: function(data, uuid) {
      var form = "";

      $.each(data, function(index, value) {
        form += uuid + "\n" + value.contentdisposition + "\n" +
          value.contenttype + "\n" + value.contenttransfer + "\n\n" +
          value.value + "\n";
      })

      form += uuid + "--"

      return form;
    }
  };
});

app.factory('SyncService', ['UuidGenerator', 'MimeGenerator', function(UuidGenerator, MimeGenerator) {

  function parseSync(response, user) {

    response = response.substring(1, response.length - 1);

    var res = JSON.parse(response);

    // update token
    user.login.token = res.success;

    // activity
    var activity = JSON.stringify(res.sync.activity);
    localStorage.setItem('activity', activity);

    // blogs
    var blogs = JSON.stringify(res.sync.blogs);
    localStorage.setItem('blogs', blogs);

    // tags
    var tags = JSON.stringify(res.sync.tags);
    localStorage.setItem('tags', tags);

    // time
    user.login.lastsync = res.sync.lastsync

    localStorage.setItem('user', JSON.stringify(user));
  }

  return {
    sync: function() {
      var user = JSON.parse(localStorage.getItem('user'))
      var xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {

          parseSync(xhr.responseText, user);

          return xhr.responseText;
        } else {
          return xhr.responseText;
        }
      }

      var data = [];

      data.push({
        contentdisposition: 'Content-Disposition: form-data; charset=UTF-8; name="username"',
        contenttype: "Content-Type: text/plain; charset=UTF-8",
        contenttransfer: "Content-Transfer-Encoding: 8bit",
        value: user.login.username
      });

      data.push({
        contentdisposition: 'Content-Disposition: form-data; charset=UTF-8; name="token"',
        contenttype: "Content-Type: text/plain; charset=UTF-8",
        contenttransfer: "Content-Transfer-Encoding: 8bit",
        value: user.login.token
      });

      data.push({
        contentdisposition: 'Content-Disposition: form-data; charset=UTF-8; name="notifications"',
        contenttype: "Content-Type: text/plain; charset=UTF-8",
        contenttransfer: "Content-Transfer-Encoding: 8bit",
        value: 'feedback,newpost,maharamessage,usermessages'
      });

      data.push({
        contentdisposition: 'Content-Disposition: form-data; charset=UTF-8; name="lastsync"',
        contenttype: "Content-Type: text/plain; charset=UTF-8",
        contenttransfer: "Content-Transfer-Encoding: 8bit",
        value: '1439259919620'
      });

      var bound = UuidGenerator.generate()

      var res = MimeGenerator.generateForm(data, '--' + bound);

      xhr.open("POST", user.login.url + user.connection.syncuri, true);
      xhr.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + bound);
      xhr.send(res);
    },
    sendImages: function(){
      // for each image in image log
      
    }
  }
}]);

/**
 * Controls all other Pages
 */
app.controller('PageCtrl', function( /* $scope, $location, $http */ ) {

});
