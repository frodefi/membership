angular.module('alertModule').directive('ffAlert',function() {
  return {
    templateUrl: 'components/alert/ff-alert-directive.html',
    controller: ['$scope','alertService',function($scope,alertService) {
      $scope.alerts = alertService;
    }]
  }
});