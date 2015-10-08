angular.module('Mahara').factory('SyncService', ['UuidGenerator', 'MimeGenerator', '$cordovaFile', '$q', '$cordovaFileTransfer', function(UuidGenerator, MimeGenerator, $cordovaFile, $q, $cordovaFileTransfer) {
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

      xhr.open("POST", user.login.url + settings.connection.syncuri, true);
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

      xhr.open("POST", user.login.url + settings.connection.uploaduri, true);
      xhr.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + bound);
      xhr.send(res);

      return q.promise;

    },
    sendImage: function(image) {

      var q = $q.defer();
      var user = JSON.parse(localStorage.getItem('user'));
      var settings = JSON.parse(localStorage.getItem('settings'));
      image.uri = image.uri.replace('file://', '');
      $cordovaFileTransfer.upload( user.login.url + settings.connection.uploaduri /*'http://10.22.33.121/~potato/mahara/htdocs/api/mobile/upload.php' */, image.uri, {

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
