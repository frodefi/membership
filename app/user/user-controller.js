angular.module('app.controllers')
  .controller('UserCtrl', ['$scope', 'userService', 'alertService', function ($scope, userService, alertService) {
    var user = userService;
    var alerts = alertService;

  }]);
