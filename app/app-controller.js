angular.module('app.controllers')
  .controller('AppCtrl', ['$scope','userService','dataService','$routeSegment',
    function ($scope, userService, dataService, $routeSegment) {
      $scope.model = {};
      $scope.model.query = "";
      $scope.model.sortField = "";
      $scope.model.reverse = false;
      $scope.model.showHelpQuery = false;
      $scope.model.data = dataService;
      $scope.model.user = userService;
    }]);
