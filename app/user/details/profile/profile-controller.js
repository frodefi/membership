angular.module('app.controllers')
  .controller('ProfileCtrl', ['$scope', 'userService', function ($scope, userService) {
    var user = userService;
    $scope.userForm = {
      fullName: user.fullName
    };
    $scope.update = function () {
      var id = alerts.add({type: "info", msg: "Updating..."});
      var promise = user.update($scope.userForm);
      promise.then(
        function(success) {
          alerts.close(id);
          alerts.add({type: "success", msg: "Profile details updated."});
        },
        function(error) {
          alerts.close(id);
          alerts.addServerError(error);
        }
      );
    };

  }]);
