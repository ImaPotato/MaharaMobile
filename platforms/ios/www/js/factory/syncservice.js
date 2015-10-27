angular.module('Mahara').factory('SyncService', function(LoadService, SaveService) {
  var result = {
    sync: function() {
      var s = LoadService.loadSync();
      s.sync().then(function(result){
        parseSync(result);
      });
    },
    syncPending: function(pending, history) {
      console.log(pending, history);
      if (pending[0].type != 'journal') {
        //check if file still exists...
        pending[0].validate().then(function() {
          process(pending[0], pending, history);
        }, function(){
          //couldn't find file
        });
      } else {
        process(pending[0], pending, history);
      }
    },
    syncSingleItem: function(item, pending, history) {

    }
  };

  function process(item, pending, history) {
    console.log(pending.length, history.length);
    item.send(LoadService.loadSettings()).then(function(token){
      var first = pending.shift();
      history.push(first);

      SaveService.setPending(pending);
      SaveService.saveHistory(history);
      parseSync(token);
      if(pending.length != 0)
        result.syncPending(pending, history);
    });
  }

  function parseSync(response) {
      response = JSON.parse(response.substring(1, response.length - 1));
      if ((response.error != null && response.error != '') || (response.fail != null && response.fail != '')) {
        return;
      }
      var settings = LoadService.loadSettings();
      settings.connection.token = response.success;
      SaveService.saveSettings(settings);
  }

  return result;
});
