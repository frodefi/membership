angular.module('app.controllers')
  .controller('BoatCtrl', ['$scope','commonService',
    function ($scope, commonService) {
      commonService.setScopeAndMore($scope,"boat");

    }]);
