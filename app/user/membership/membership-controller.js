angular.module('app.controllers')
  .controller('MembershipCtrl', ['$scope','commonService',
    function ($scope, commonService) {
      commonService.setScopeAndMore($scope,"membership");
    }]);
