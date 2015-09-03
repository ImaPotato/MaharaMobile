angular.module('Mahara').controller('HistoryCtrl', function($scope, $q, SyncService) {

  $scope.pending = [];
  $scope.history = [];

  function checkAllFiles(currentIndex, q) {
    if ($scope.pending.length > currentIndex) {
      checkFileURI($scope.pending[currentIndex]).then(function() {
        //nothing to do
        checkAllFiles(currentIndex + 1, q);
      }, function() {
        // might as well just set the src to jpg/white for now
        $scope.pending[currentIndex].uri = 'css/white.jpg';
        checkAllFiles(currentIndex + 1, q);
      });
    } else {
      q.resolve();
    }
  }

  function checkFileURI(image) {
    var q = $q.defer();
    if (image.uri == 'css/white.jpg') {
      // change this dude.
      q.reject();
    }

    window.resolveLocalFileSystemURL(image.uri, function(fileEntry) {
      console.log('File exists');
      q.resolve();

    }, function(error) {
      console.log('File does not exist');
      q.reject();
    });

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

        console.log('we have a valid file');

        var promise = SyncService.sendImage(pending[0]);
        promise.then(function() {

            console.log('sent image');

            // remove first element as it was successfully sent.
            var first = pending.shift();
            // save
            localStorage.setItem('pending', JSON.stringify(pending));
            $scope.pending = pending;
            $scope.history.push(first);
            localStorage.setItem('history', JSON.stringify($scope.history));
            // keep going untill there is no more images to process.
            uploadPendingImages();
          },
          function() {
            console.log('Could not send image');
            //fail
            // and stop because we probably have lost the network connection
          });

      }, function() {
        // don't upload as the file does not exists anymore.
        var first = pending.shift();
        console.log('failed to find file');
        // remove from pending
        console.log(first);
        localStorage.setItem('pending', JSON.stringify(pending));
        $scope.pending = pending;
        $scope.history.push(first);
        localStorage.setItem('history', JSON.stringify($scope.history));
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
    }

    $scope.pending = pending;

    var q = $q.defer();
    var check = q.promise;

    checkAllFiles(0, q);

    // this is going to be a little gross but we need to check every image in pending to make sure the file still exists
    check.then(function() {
      uploadPendingImages();
    });
  }

  $scope.init();

});
