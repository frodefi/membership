angular.module('app.controllers')
  .controller('NavCtrl', ['$scope','$rootScope','$location','userService','alertService',function($scope,$rootScope,$location,userService,alertService) {
    $scope.user = userService;
    $scope.alerts = alertService;
    $scope.logout = function() {
      if ($scope.user.authenticated) {
        var promise = $scope.user.logout();
        promise.then(
          function () {
            $scope.user = {};
            $location.path('/');
          },
          function(error) {
            $scope.error = error;
            alerts.addServerError(error);
          }
        );
      }
    };

    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };

/*
    $scope.$watch("$scope.user.checkAuthenticated()", function(newValue,oldValue) {
      $scope.user.authenticated = newValue;
      console.log("----------------navbarctrl-watch",newValue,oldValue);
    },true);
*/

  }]);
