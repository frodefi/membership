angular.module('app.controllers')
  .controller('LoginCtrl', ['$scope','userService','alertService','$location',function($scope,userService,alertService,$location) {
    var user = userService;
    var alerts = alertService;
    $scope.userForm = {
      username: "",
      password: ""
    };

    $scope.login = function () {
      var alertId = alerts.add({type: "info", msg: "Wait while logging in..."});
      var promise = user.login('local',$scope.userForm);
      promise.then(
        function(success) {
          alerts.close(alertId);
          alerts.add({type: "success", msg: "You are now logged in. Please remember to complete your profile, it is mandatory for completing a project."});
          $location.path('user');
        },
        function(error) {
          alerts.close(alertId);
          alerts.addServerError(error);
        }
      );
    };

  }]);
