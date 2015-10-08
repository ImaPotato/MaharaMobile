angular.module('Mahara').factory('SettingsService', function() {
  return {
    getSettings: function(){
      var settings = JSON.parse(localStorage.getItem('settings'));
      if (settings != null && settings != '') {
        var s = {};
        s.defaultjournalset = settings.defaultjournalset;
        s.defaultjournal = settings.defaultjournal;

        s.uploadfolderset = settings.uploadfolderset;
        s.uploadfolder = settings.uploadfolder;

        s.uploadtagsset = settings.uploadtagsset;
        s.uploadtags = settings.uploadtags;

        s.notification = {};
        s.notification.user = settings.notification.user;
        s.notification.feedback = settings.notification.feedback;
        s.notification.posts = settings.notification.posts;
        s.notification.mahara = settings.notification.mahara;

        s.advanced = {};
        s.advanced.periodicsync = settings.advanced.periodicsync;
        s.advanced.lastsynctime = settings.advanced.lastsynctime;

        s.connection = {};
        s.connection.syncuri = settings.connection.syncuri;
        s.connection.uploaduri = settings.connection.uploaduri;
        s.connection.connectiontype = settings.connection.connectiontype;
        
      }
      return s;
    },
    saveSettings: function(settings){
      localStorage.setItem('settings', JSON.stringify(settings));
    },
    resetSettings: function(){

    }
  }
});
