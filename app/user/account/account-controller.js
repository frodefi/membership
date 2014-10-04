angular.module('app.controllers')
  .controller('AccountCtrl', ['$scope','userService','commonService',
    function ($scope, userService, commonService) {
      var passwordNotUpdated = "Passw0rdNotUpdated!";
      var user = userService;
      var common = commonService;
      common.setScopeAndMore($scope,"account");
      $scope.model.data.password = passwordNotUpdated;
      $scope.model.data.confirmPassword = passwordNotUpdated;

      $scope.model.save = function (form) {
        if (form.$invalid) {
          console.log("++++++++++++++++++",form.$invalid,form);
          return;
        }
        var data = $scope.model.data;
        // Todo: Add current password verification (for any changes of any account-fields)
        delete data.confirmPassword;
        if (data.password === passwordNotUpdated) {
          delete data.password;
        }
        console.log("++++++++++++++++++-------------",data);
        user.update(data);
      };

      $scope.model.resetPasswords = function () {
        angular.forEach(['password','confirmPassword'], function (property) {
          if ($scope.model.data[property] === passwordNotUpdated) {
            $scope.model.data[property] = "";
          }
        });
      };

      $scope.$watch(function () {
        return user.account;
      }, function (newValue, oldValue) {
        if (newValue && !angular.equals(newValue, oldValue)) {
          newValue.password = passwordNotUpdated;
          newValue.confirmPassword = passwordNotUpdated;
          common.setModelData($scope,newValue);
        }
      }, true);

    }]);
