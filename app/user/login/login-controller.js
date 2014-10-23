angular.module('app.controllers')
  .controller('LoginCtrl', ['$scope', 'userService',
    function ($scope, userService) {
      $scope.model = {};
      $scope.model.credentials = {
        username: "",
        password: ""
      };

      $scope.model.login = function () {
        userService.login('local', $scope.model.credentials);
      };

    }]);
