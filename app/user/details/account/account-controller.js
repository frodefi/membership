angular.module('app.controllers')
  .controller('AccountCtrl', ['$scope', 'userService', 'alertService', function ($scope, userService, alertService) {
    var user = userService;
    var alerts = alertService;
    $scope.userForm = {
      email: user.email,
      username: user.username,
      password: "Passw0rdNotUpdated",
      repeatPassword: "Passw0rdNotUpdated"
    };
    $scope.update = function () {
      // Todo: Add (current) password verification (for any changes of any account-fields)
      var id = alerts.add({type: "info", msg: "Updating..."});
      var userDetails = $scope.userForm.password;
      if(userDetails.password === "Passw0rdNotUpdated") {
        delete userDetails.password;
      }
      var promise = user.update(userDetails);
      promise.then(
        function(success) {
          alerts.close(id);
          alerts.add({type: "success", msg: "Account details updated."});
        },
        function(error) {
          alerts.close(id);
          alerts.addServerError(error);
        }
      );
    };
  }]);
