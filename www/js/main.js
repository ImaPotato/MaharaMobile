var app = angular.module('Mahara', [
  'ngRoute', 'ngCordova', 'uuid4', 'ngAnimate'
]);

// routing
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
    .when("/history", {
      templateUrl: "partials/history.html",
      controller: "HistoryCtrl"
    })
    .otherwise("/404", {
      templateUrl: "partials/404.html"
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

// I wonder if this works?
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

app.factory('SyncService', ['UuidGenerator', 'MimeGenerator', '$cordovaFile', '$q', '$cordovaFileTransfer', function(UuidGenerator, MimeGenerator, $cordovaFile, $q, $cordovaFileTransfer) {

  function parseSync(response, user) {

    response = response.substring(1, response.length - 1);

    var res = JSON.parse(response);

    if ((res.error != null && res.error != '') || (res.fail != null && res.fail != '')) {

      Materialize.toast('Check login details', 4000);
      //somethings gone wrong, show an error and return.
      return false;
    }

    // update token
    user.login.token = res.success;

    if (res.sync != null && res.sync.length != 0) {
      // if sync we also need to update a few other things.

      if (res.sync.id != null && res.sync.id != '') {
        // do something with the blog id...
      } else {
        // can probably just assume that at this point we've recieved a sync
        Materialize.toast('Synced', 4000);

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
        user.login.lastsync = res.sync.time
      }
    }

    localStorage.setItem('user', JSON.stringify(user));

    return true;
  }

  function getDataUri(path, name, image) {
    var q = $q.defer();

    $cordovaFile.readAsDataURL(path, name)
      .then(function(success) {
        console.log(image);
        image.uri = success;
        image.filename = name;
        q.resolve(image);
      }, function(error) {
        q.reject('error');
      });

    return q.promise;
  }

  return {

    sync: function() {

      var user = JSON.parse(localStorage.getItem('user'));

      // need to make sure this is populated...
      var settings = JSON.parse(localStorage.getItem('settings'));

      var xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function() {
        console.log(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == 200) {
          parseSync(xhr.responseText, user);
        } else {

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

      var notifications = [];

      if (settings != null) {
        if (settings.notification.user) notifications.push('usermessages');
        if (settings.notification.feedback) notifications.push('feedback');
        if (settings.notification.posts) notifications.push('newpost');
        if (settings.notification.mahara) notifications.push('maharamessage');
      }

      data.push({
        contentdisposition: 'Content-Disposition: form-data; charset=UTF-8; name="notifications"',
        contenttype: "Content-Type: text/plain; charset=UTF-8",
        contenttransfer: "Content-Transfer-Encoding: 8bit",
        value: (settings == null) ? notifications.join(", ") : 'feedback,newpost,maharamessage,usermessages'
      });

      data.push({
        contentdisposition: 'Content-Disposition: form-data; charset=UTF-8; name="lastsync"',
        contenttype: "Content-Type: text/plain; charset=UTF-8",
        contenttransfer: "Content-Transfer-Encoding: 8bit",
        value: (settings.advanced == null || settings.advanced.lastsynctime == null || settings.advanced.lastsynctime == '') ? 0 : settings.advanced.lastsynctime
      });

      var bound = UuidGenerator.generate();

      var res = MimeGenerator.generateForm(data, '--' + bound);

      xhr.open("POST", user.login.url + user.connection.syncuri, true);
      xhr.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + bound);
      xhr.send(res);
    },

    sendJournal: function(journal) {

      var q = $q.defer();

      var user = JSON.parse(localStorage.getItem('user'));
      // need to make sure this is populated...
      var settings = JSON.parse(localStorage.getItem('settings'));

      var xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function() {
        console.log(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == 200) {
          // when we get a message back but something went wrong...
          if (!parseSync(xhr.responseText, user)) {
            q.reject();
          }
          q.resolve();
        } else {
          // need to check for http error status
        }
      }

      var data = [];

      data.push({
        contentdisposition: 'Content-Disposition: form-data; charset=UTF-8; name="allowcomments"',
        contenttype: "Content-Type: text/plain; charset=UTF-8",
        contenttransfer: "Content-Transfer-Encoding: 8bit",
        value: journal.comments
      });

      // count number of blogs that have been sent so far.
      // this means we should probably do a sync before we start...

      data.push({
        contentdisposition: 'Content-Disposition: form-data; charset=UTF-8; name="blog"',
        contenttype: "Content-Type: text/plain; charset=UTF-8",
        contenttransfer: "Content-Transfer-Encoding: 8bit",
        value: 3
      });

      data.push({
        contentdisposition: 'Content-Disposition: form-data; charset=UTF-8; name="description"',
        contenttype: "Content-Type: text/plain; charset=UTF-8",
        contenttransfer: "Content-Transfer-Encoding: 8bit",
        value: journal.desc
      });

      data.push({
        contentdisposition: 'Content-Disposition: form-data; charset=UTF-8; name="draft"',
        contenttype: "Content-Type: text/plain; charset=UTF-8",
        contenttransfer: "Content-Transfer-Encoding: 8bit",
        value: journal.draft
      });

      data.push({
        contentdisposition: 'Content-Disposition: form-data; charset=UTF-8; name="foldername"',
        contenttype: "Content-Type: text/plain; charset=UTF-8",
        contenttransfer: "Content-Transfer-Encoding: 8bit",
        value: ''
      });

      data.push({
        contentdisposition: 'Content-Disposition: form-data; charset=UTF-8; name="tags"',
        contenttype: "Content-Type: text/plain; charset=UTF-8",
        contenttransfer: "Content-Transfer-Encoding: 8bit",
        value: journal.tags
      });

      data.push({
        contentdisposition: 'Content-Disposition: form-data; charset=UTF-8; name="title"',
        contenttype: "Content-Type: text/plain; charset=UTF-8",
        contenttransfer: "Content-Transfer-Encoding: 8bit",
        value: journal.title
      });

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

      var bound = UuidGenerator.generate()

      var res = MimeGenerator.generateForm(data, '--' + bound);

      xhr.open("POST", user.login.url + user.connection.uploaduri, true);
      xhr.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + bound);
      xhr.send(res);

      return q.promise;

    },
    sendImage: function(image) {
      var q = $q.defer();

      var user = JSON.parse(localStorage.getItem('user'));

      image.uri = image.uri.replace('file://', '');

      console.log(image.uri);

      $cordovaFileTransfer.upload( user.login.url + user.connection.uploaduri /*'http://10.22.33.121/~potato/mahara/htdocs/api/mobile/upload.php' */, image.uri, {

        params: {
          allowcomments: 'true',
          description: image.desc,
          foldername: '',
          tags: image.tags,
          title: image.title,
          username: user.login.username,
          token: user.login.token
        },

        headers: {
          Connection: "Keep-Alive"
        },

        chunkedMode: false,
        fileKey: "userfile",
        fileName: image.uri.substr(image.uri.lastIndexOf('/') + 1),
        mimeType: "application/octet-stream"

      }).then(function(r) {

        var response = r.response.substring(1, r.response.length - 1);
        var res = JSON.parse(response);

        console.log(res);

        if (res.error != null && res.error != '') {
          console.log('error sending');
          //somethings gone wrong, show an error and return.
          q.reject();
        } else if (res.fail != null && res.fail != '') {
          console.log('error sending');
          q.reject();
        } else {

          console.log('sent successfully');
          parseSync(r.response, user);
          q.resolve();

        }

      }, function(error) {
        q.reject();
      }, function(progress) {

      });

      return q.promise;

    }
  }
}]);

app.factory('InitService', function() {
  return {
    init: function(){
      var settings = {
        'defaultjournalset': false,
        'defaultjournal' : '',
        'uploadfolderset' : false,
        'uploadfolder' : '',
        'uploadtagsset' : false,
        'uploadtags' : '',
        'notification' : {
          'user' : true,
          'feedback' : true,
          'posts' : true,
          'mahara' : true
        },
        'advanced' : {
          'periodicsync' : 15,
          'lastsynctime' : 0
        }
      };

      localStorage.setItem('settings', JSON.stringify(settings));

      var user = {
        'login': {
          'username': ' ',
          'token': ' ',
          'url': ' '
        },
        'connection': {
          'uploaduri': '/api/mobile/upload.php',
          'syncuri': '/api/mobile/sync.php',
          'connectiontype': 'Mobile and Wifi'
        }
      };
      localStorage.setItem('user', JSON.stringify(user));
    }
  }
});


/**
 * Controls all other Pages
 */
app.controller('PageCtrl', function( /* $scope, $location, $http */ ) {

});

FastClick.attach(document.body);
