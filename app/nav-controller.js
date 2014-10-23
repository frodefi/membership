angular.module('app.controllers')
  .controller('NavCtrl', ['$scope','$rootScope','$location','$timeout','userService','alertService',
    function ($scope, $rootScope, $location, $timeout, userService, alertService) {
      $scope.user = userService;
      $scope.alerts = alertService;
      $scope.nav = {};
      $scope.nav.showWaitingForServer = false;

      $scope.nav.logout = function () {
        if ($scope.user.authenticated) {
          $scope.user.logout();
        }
      };

      $scope.nav.isActive = function (viewLocation) {
        return viewLocation === $location.path();
      };

      // alters.waiting indicated that app is communicating with the server, we may be done very quickly.
      // Let us do the following to ensure that the spinning-wheel symbol does not disappear too quickly
      $scope.$watch('alerts.waiting', function (newValue, oldValue) {
        if (newValue === 0 && oldValue > 0) {
          $timeout(function () {
            $scope.nav.showWaitingForServer = false;
          },500)
        } else if (newValue > 0) {
          $scope.nav.showWaitingForServer = true;
        }
      })

    }]);
