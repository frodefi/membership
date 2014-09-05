angular.module('app.controllers')
  .controller('DetailsCtrl', ['$scope', 'userService', 'alertService', function ($scope, userService, alertService) {
    var user = userService;
    var alerts = alertService;

  }]);
