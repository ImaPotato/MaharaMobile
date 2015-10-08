angular.module('Mahara').controller('HistoryCtrl', function($scope, $q, SyncService) {

  $scope.pending = [];
  $scope.history = [];
  $scope.pageClass = 'history';

  function checkAllFiles(currentIndex, q) {
    if ($scope.pending.length > currentIndex) {
        checkFileURI($scope.pending[currentIndex]).then(function() {
        checkAllFiles(currentIndex + 1, q);
      }, function() {
        $scope.pending[currentIndex].uri = 'css/white.jpg';
        checkAllFiles(currentIndex + 1, q);
      });
    } else {
      q.resolve();
    }
  }

  function checkAllHistory(currentIndex, q) {
    if ($scope.history.length > currentIndex) {
        checkFileURI($scope.history[currentIndex]).then(function() {
        checkAllHistory(currentIndex + 1, q);
      }, function() {
        $scope.history[currentIndex].uri = 'css/white.jpg';
        checkAllHistory(currentIndex + 1, q);
      });
    } else {
      q.resolve();
    }
  }

  function checkFileURI(pending) {
    var q = $q.defer();
    if (pending.type == 'journal') {
      //journals don't have files attached so we good.
      q.resolve();
    } else if (pending.uri == 'css/white.jpg') {
      // change this dude. This is not good...
      q.reject();
    } else {
      window.resolveLocalFileSystemURL(pending.uri, function(fileEntry) {
        q.resolve();
      }, function(error) {
        q.reject();
      });
    }
    return q.promise;
  }

  function uploadPendingImages() {
    var pending = localStorage.getItem('pending');
    if (pending == null || pending == '') {
      return;
    }

    pending = JSON.parse(pending);
    if (pending.length >= 1) {
      // check again before sending
      var filePromise = checkFileURI(pending[0]);
      filePromise.then(function() {
        // need to check if we're sending a journal or an image
        var promise = (pending[0].type == 'image' || pending[0].type == 'file') ? SyncService.sendImage(pending[0]) : SyncService.sendJournal(pending[0]);
        // tell user we've started to upload something.
        Materialize.toast('Uploading ' + pending[0].type, 4000);

        promise.then(function() {
            // we're done.
            Materialize.toast('Finished uploading ' + pending[0].type, 4000);
            // remove first element as it was successfully sent.
            var first = pending.shift();
            // update UI
            $scope.history.push(first);
            $scope.pending = pending;
            // save
            localStorage.setItem('pending', JSON.stringify(pending));
            localStorage.setItem('history', JSON.stringify($scope.history));
            // keep going untill there is no more images to process.
            uploadPendingImages();
          },
          function() {
            Materialize.toast('Failed to upload ' + pending[0].type, 4000);
          });

      }, function() {
        Materialize.toast(pending[0].type + ' does not exist', 4000);
        // remove item from pending
        var first = pending.shift();
        // update ui
        $scope.pending = pending;
        $scope.history.push(first);
        // save
        localStorage.setItem('pending', JSON.stringify(pending));
        localStorage.setItem('history', JSON.stringify($scope.history));
        // try next file
        uploadPendingImages();
      });
    }
  }

  $scope.init = function() {
    var pending = localStorage.getItem('pending');
    var history = localStorage.getItem('history');
    if (pending == null || pending == '') {
      pending = [];
    } else {
      pending = JSON.parse(pending);
    }
    if (history == null || history == '') {
      history = [];
    } else {
      history = JSON.parse(history);
    }

    for (var p = 0; p < pending.length; p++){
      console.log(pending[p].type);
      console.log(pending[p].uri);
    }

    $scope.pending = pending;
    $scope.history = history;
    var q = $q.defer();
    var check = q.promise;
    checkAllFiles(0, q);

    // this is going to be a little gross but we need to check every image in pending to make sure the file still exists
    check.then(function() {
      uploadPendingImages();
    });

    var user = JSON.parse(localStorage.getItem('user'));
    /*
        if (user != null && user != '') {
          if (user.connection.connectiontype == 'Mobile and Wifi' || (user.connection.connectiontype == 'Wifi only' && true device connetion  )) {
            // this is going to be a little gross but we need to check every image in pending to make sure the file still exists
            check.then(function() {
              uploadPendingImages();
            });
          }
        }
    */
  }
  $scope.init();
});
