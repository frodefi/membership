angular.module('app.controllers')
  .controller('CreateCtrl', ['$scope','userService','commonService','$location',
    function ($scope, userService, commonService, $location) {
      var user = userService;
      var common = commonService;
      common.setScopeAndMore($scope,"account");
      $scope.model.viewMode = false;

      $scope.model.create = function () {
        var userData = $scope.model.data;
        delete userData.confirmPassword;
        var promise = user.register(userData);
        promise.then(
          function (newUser) {
            common.cancelPreventAccidentalPathChange($scope);
            $location.path('user/');
          },
          function (error) {
          }
        );
      };

    }]);
