angular.module('Mahara').factory('InitService', function() {
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
        },
        'connection': {
          'uploaduri': '/api/mobile/upload.php',
          'syncuri': '/api/mobile/sync.php',
          'connectiontype': 'Mobile and Wifi'
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
