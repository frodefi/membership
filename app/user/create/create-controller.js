angular.module('app.controllers')
  .controller('CreateCtrl', ['$scope', 'userService',
    function ($scope, userService) {

      $scope.model = {};
      $scope.model.user = userService;
      $scope.model.viewMode = false;
      $scope.model.unsavedChanges = true;
      $scope.model.showHelp = {};
      $scope.model.submitText = "Create user";

      $scope.model.create = function () {
        var credentials = $scope.model.user.account;
        delete credentials.confirmPassword;
        userService.register(credentials);
      };

      $scope.model.setShowHelp = function (field) {
        angular.forEach($scope.model.showHelp, function (value, key) {
          $scope.model.showHelp[key] = false;
        });
        if (field) {
          $scope.model.showHelp[field] = true;
        }
      };

    }]);
