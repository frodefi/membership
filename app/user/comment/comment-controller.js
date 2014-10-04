angular.module('app.controllers')
  .controller('CommentCtrl', ['$scope','commonService',
    function ($scope, commonService) {
      commonService.setScopeAndMore($scope,"comment");
    }]);
