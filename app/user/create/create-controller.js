angular.module('app.controllers')
  .controller('CreateCtrl', ['$scope','userService','alertService','$location', function($scope,userService,alertService,$location) {
    var user = userService;
    var alerts = alertService;
    $scope.userForm = {
      email: "",
      username: "",
      password: "",
      repeatPassword: ""
    };

    $scope.createUser = function () {
      var alertId = alerts.add({type: "info", msg: "Wait while registering..."});
      var promise = user.register($scope.userForm);
      promise.then(
        function(success) {
          alerts.close(alertId);
          alerts.add({type: "success", msg: "Success registering your account. Please check your email and follow the instructions to confirm correct address."});
          console.log("changing path");
          $location.path('user/');
          console.log("new path",$location.path());
        },
        function(error) {
          alerts.close(alertId);
          alerts.addServerError(error);
        }
      );
    };
  }]);
