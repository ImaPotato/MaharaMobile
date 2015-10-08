angular.module('Mahara').factory('FileService', function($q) {

  return {
    GetFile: function() {

      var q = $q.defer();

      var success = function(data) {
        console.log(data.filepath);
      };

      var error = function(msg) {
        console.log(msg);
      };

      fileChooser.open(function(uri) {
          console.log(uri);
          q.resolve(uri);
      });

      return q.promise;
    }
  }
});
