function file($cordovaCamera, $cordovaFileTransfer, $q, FileService, UuidGenerator) {

  this.uuid = UuidGenerator.generate();
  this.uri = '';
  this.type = '';
  this.title = '';
  this.tags = [];
  this.desc = '';
  this.edit = false;
  this.percentage = 0;

  function getUri(path) {
    var q = $q.defer();
    // android seems to like to give us content url's instead of file urls, this should fix that.
    if (path.substring(0, 10) == "content://") {
      window.FilePath.resolveNativePath(path,
        function(result) {
          q.resolve(result);
        },
        function() {
          q.reject();
        }
      );
    } else {
      q.resolve(path);
    }
    return q.promise;
  }

  this.init = function(item) {
    this.uuid = item.uuid;
    this.uri = item.uri;
    this.type = item.type;
    this.title = item.title;
    this.tags = item.tags
    this.desc = item.desc;
    this.edit = item.edit;

    return this;
  }

  this.getPicture = function() {

    var q = $q.defer();

    var options = {
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: this.edit
    };

    navigator.camera.getPicture(onSuccess, onFail, options);

    function onSuccess(imageURI) {
      q.resolve({
        path: imageURI,
        type: 'image'
      });
    }

    function onFail(message) {
      console.log(message);
    }
    return q.promise;

  }

  this.getPictureFromLibrary = function() {

    var q = $q.defer();

    var options = {
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    };


    navigator.camera.getPicture(onSuccess, onFail, options);

    function onSuccess(imageURI) {
      q.resolve({
        path: imageURI,
        type: 'image'
      });
    }

    function onFail(message) {
      console.log(message);
    }

    return q.promise;

  }

  this.getFile = function() {

    var q = $q.defer();

    FileService.GetFile().then(function(uri) {
      getUri(uri).then(function(fileUri) {
        var extensions = ['png', 'jpg', 'jpeg', 'tif'];
        var fileType = fileUri.substring(fileUri.lastIndexOf('.') + 1, fileUri.length);
        var isImage = false;

        for (var i = 0; i < extensions.length; i++) {
          if (extensions[i] == fileType) {
            isImage = true;
          }
        }

        var uri = 'file://' + fileUri;
        var type = isImage ? 'image' : 'file';

        q.resolve({
          path: uri,
          type: type
        });

      });
    });
    return q.promise;
  }

  this.validate = function() {
    var q = $q.defer();

    window.resolveLocalFileSystemURL(this.uri, function(file) {
      q.resolve();
    }, function(error) {
      q.reject();
    });

    return q.promise;
  }

  this.send = function(settings) {

    var q = $q.defer();
    var u = this.uri.replace('file://', '');

    //still need to add in defaults...

    var params = {
      params: {
        allowcomments: 'true',
        description: this.desc,
        foldername: settings,
        tags: this.tags.join(", "),
        title: this.title,
        username: settings.connection.username,
        token: settings.connection.token
      },
      headers: {
        Connection: "Keep-Alive"
      },
      chunkedMode: false,
      fileKey: "userfile",
      fileName: u.substr(u.lastIndexOf('/') + 1),
      mimeType: "application/octet-stream"
    };

    $cordovaFileTransfer.upload(settings.connection.maharauri + settings.connection.uploaduri, u, params)
      .then(function(r) {
        var response = r.response.substring(1, r.response.length - 1);
        var res = JSON.parse(response);
        console.log(res);
        if ((res.error != null && res.error != '') || (res.fail != null && res.fail != '')) {
          Materialize.toast("Error uploading file :'(", 4000);
          q.reject();
        } else {
          q.resolve(r.response);
        }
      }, function(error) {
        q.reject();
      }, function(progress) {
        this.percentage = (progress.loaded / progress.total) * 100;
      });
    return q.promise;
  }
}
