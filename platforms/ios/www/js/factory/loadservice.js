angular.module('Mahara').factory('LoadService', function($cordovaCamera, $cordovaFileTransfer, $q, FileService, UuidGenerator) {

  var service = {
    loadFile: function() {
      return new file($cordovaCamera, $cordovaFileTransfer, $q, FileService, UuidGenerator);
    },
    loadJournal: function() {
      return new journal($q, UuidGenerator);
    },
    loadPending: function() {
      var p = localStorage.getItem('pending');
      p = (p != null && p != '') ? JSON.parse(p) : [];
      //map back to dem sexy objects.
      return p.map(mapToObjects);

    },
    loadHistory: function() {
      var h = localStorage.getItem('history');
      h = (h != null && h != '') ? JSON.parse(h) : [];
      //map back to dem sexy objects.
      return h.map(mapToObjects);
    },
    loadSettings: function() {
      var s = localStorage.getItem('settings');
      return (s != null && s != '') ? new settings($q).init(JSON.parse(s)) : new settings($q);
    },
    loadSync: function(){
      return new sync($q, UuidGenerator);
    }
  };

  function mapToObjects(item) {
    if (item.type == 'journal') {
      return service.loadJournal().init(item);
    }
    return service.loadFile().init(item);
  }

  return service;

});
