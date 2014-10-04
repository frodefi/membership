angular.module('app.controllers')
  .controller('RolesCtrl', ['$scope','commonService',
    function ($scope, commonService) {
      commonService.setScopeAndMore($scope,"roles");
    }]);
