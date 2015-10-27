function settings($q) {
  this.defaultjournalset = '';
  this.defaultjournal = '';
  this.uploadfolderset = '';
  this.uploadfolder = '';
  this.uploadtagsset = '';
  this.uploadtags = '';
  this.notification = {
    user: true,
    feedback: true,
    posts: true,
    mahara: true
  };

  this.advanced = {
    periodicsync: 15,
    lastsynctime: 0
  };

  this.connection = {
    maharauri: '',
    username: '',
    token: '',
    uploaduri: '/api/mobile/upload.php',
    syncuri: '/api/mobile/sync.php',
    connectiontype: 'Mobile and Wifi'
  };

  this.blogposts = [];
  this.blogs = [];
  this.folders = [];
  this.tags = [];

  this.defaulttag = '';
  this.defaultjournal = '';
  this.defaultfolder = '';

  this.init = function(s) {
    this.defaultjournalset = s.defaultjournalset;
    this.defaultjournal = s.defaultjournal;
    this.uploadfolderset = s.uploadfolderset;
    this.uploadfolder = s.uploadfolder;
    this.uploadtagsset = s.uploadtagsset;
    this.uploadtags = s.uploadtags;
    this.notification = s.notification;
    this.advanced = s.advanced;
    this.connection = s.connection;
    this.blogposts = s.blogposts;
    this.blogs = s.blogs;
    this.folders = s.folders;
    this.tags = s.tags;
    this.defaulttag = s.defaulttag;
    this.defaultjournal = s.defaultjournal;
    this.defaultfolder = s.defaultfolder;
    return this;
  }

  this.webAuthentication = function() {
    return checkUrl(this.connection).then(openBrowser);
  }

  function checkUrl(connection) {
    var q = $q.defer();
    $.ajax({
      type: "GET",
      url: connection.maharauri + "/api/mobile/test.php",
      crossDomain: true,
      dataType: 'jsonp',
      success: function(msg) {
        if (msg.valid == 'true') {
          q.resolve(connection);
        } else {
          Materialize.toast('URL is invalid', 4000);
          q.reject();
        }
      },
      error: function() {
        Materialize.toast('URL is invalid', 4000);
        q.reject();
      }
    });
    return q.promise
  }

  function openBrowser(connection) {

    var qt = $q.defer();

    var win = window.open(connection.maharauri + "/api/mobile/login.php", "_blank", "EnableViewPortScale=yes,location=no,toolbar=yes,clearcache=yes,clearsessioncache=yes");
    win.addEventListener("loadstop", function() {
      var q = $q.defer();
      $.ajax({
        type: "GET",
        url: "js/controller/inject/login.js",
        dataType: "text",
        success: function(msg) {
          win.executeScript({
            code: msg
          });
          q.resolve();
        },
        error: function() {
          q.reject();
        }
      });

      q.promise.then(function() {
        win.executeScript({
          code: "getLoginStatus();"
        }, function(values) {
          if (values[0].loggedin == 1) {
            connection.token = JSON.parse(values[0].token).token;
            connection.username = JSON.parse(values[0].token).user;
            win.close();
            Materialize.toast('Logged in!', 4000);
            qt.resolve();
          }
        });
      });
    });
    return qt.promise;
  }
}
