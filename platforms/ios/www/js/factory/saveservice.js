angular.module('Mahara').factory('SaveService', function() {
  return {
      savePending: function(pending){
        var p = localStorage.getItem('pending');

        p = (p != null && p != '') ? JSON.parse(p) : [];
        p = p.concat(pending);
        p = JSON.stringify(p);

        localStorage.setItem('pending', p);
      },
      setPending: function(pending){
        var p = JSON.stringify(pending);
        localStorage.setItem('pending', p);
      },
      saveHistory: function(history){
        var h = localStorage.getItem('history');
        h = (h != null && h != '') ? JSON.parse(h) : [];
        h = h.concat(history);
        while(h.length > 10)
          h.shift();

        h = JSON.stringify(h);
        localStorage.setItem('history', h);
      },
      saveSettings: function(settings){
        settings = JSON.stringify(settings);
        localStorage.setItem('settings', settings);
      }
   }
});
