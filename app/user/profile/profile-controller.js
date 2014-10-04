angular.module('app.controllers')
  .controller('ProfileCtrl', ['$scope','commonService',
    function ($scope, commonService) {
      commonService.setScopeAndMore($scope,"profile");

      }]);
