angular.module('app.controllers')
  .controller('UserCtrl', ['$scope', '$window', 'dataService','$location',
    function ($scope,$window,dataService,$location) {
      $scope.overview = {};
      $scope.overview.data = dataService.collections;

      $scope.overview.add = function (model) {
        $location.path('user/'+model+"/");
      };

    }]);
