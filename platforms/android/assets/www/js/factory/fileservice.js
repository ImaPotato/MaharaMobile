angular.module('Mahara').factory('FileService', function($q) {
  return {
    GetFile: function() {
      var q = $q.defer();
      fileChooser.open(function(uri) {
          q.resolve(uri);
      });
      return q.promise;
    }
  }
});
