angular.module('app.controllers')
  .controller('NavCtrl', ['$scope', '$rootScope', '$location', 'userService',
    function ($scope, $rootScope, $location, userService) {
      $scope.user = userService;
      $scope.nav = {};
      $scope.nav.logout = function () {
        if ($scope.user.authenticated) {
          $scope.user.logout();
        }
      };

      $scope.nav.isActive = function (viewLocation) {
        return viewLocation === $location.path();
      };

    }]);
