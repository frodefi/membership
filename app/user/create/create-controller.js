angular.module('app.controllers')
  .controller('CreateCtrl', ['$scope','userService','alertService','$location', function($scope,userService,alertService,$location) {
    var user = userService;
    var alerts = alertService;
    $scope.details.account = {
      email: "",
      username: "",
      password: "",
      confirmPassword: ""
    };

    $scope.details.createUser = function () {
      var alertId = alerts.add({type: "info", msg: "Wait while registering..."});
      var userDetails = $scope.details.account;
      delete userDetails.repeatPassword;
      var promise = user.register(userDetails);
      promise.then(
        function(success) {
          alerts.close(alertId);
          alerts.add({type: "success", msg: "Success registering your account. Please check your email and follow the instructions to confirm correct address."});
          $location.path('user/');
        },
        function(error) {
          alerts.close(alertId);
          alerts.addServerError(error);
        }
      );
    };
  }]);
