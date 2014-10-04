angular.module('app.controllers')
  .controller('LoginCtrl', ['$scope', 'userService',
    function ($scope, userService) {
      $scope.model = {};
      $scope.model.data = {
        username: "",
        password: ""
      };

      $scope.model.login = function () {
        userService.login('local', $scope.model.data);
      };

    }]);
