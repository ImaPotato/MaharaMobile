angular.module('Mahara').controller('JournalCtrl', function($scope, $location, UuidGenerator) {

//  if(cordova != null)
//    $scope.device = cordova.platformId;

  $scope.objects = [];

  $scope.pageClass = 'journal';

  $scope.addObject = function() {
    var obj = {
      uuid: UuidGenerator.generate(),
      title: '',
      tags: '',
      desc: '',
      draft: false,
      comments: true
    };

    $scope.objects.push(obj);
  };

  $scope.addObject();

  $scope.removeObject = function(id) {
    $.each($scope.objects, function(index, value) {
      if (value.uuid == id) {
        $scope.objects.splice(index, 1);
      }
    });
  };

  $scope.update = function() {

    var pending = localStorage.getItem('pending');

    pending = (pending != null && pending != '') ? JSON.parse(pending) : [];

    console.log(pending);

    // might need to load settings as well
    // add each journal the list of pending posts
    $.each($scope.objects, function(index, value) {
      pending.push({
        'uuid': value.uuid,
        'type': 'journal',
        'title': value.title,
        'desc': value.desc,
        'tags': value.tags,
        'draft': value.draft,
        'comments': value.comments
      });
    });

    console.log(pending);

    // update list of pending uploads
    localStorage.setItem('pending', JSON.stringify(pending));

    _.defer(function() {
      $scope.$apply(function() {
        $location.path("/history");
      });
    });

  }

  $scope.reset = function() {
    $scope.objects = [];
    $scope.addObject();
  };

});
