angular.module('alertModule').directive('ffAlert',function() {
  return {
    templateUrl: 'components/alert/ff-alert-directive.html',
    controller: ['$scope','alertService',function($scope,alertService) {
      $scope.alerts = alertService;
    }],
    link: function (scope, elem, attrs, ctrl) {
/*
      function myTimeoutFunction(i) {
        return function (){
          console.log("Heeeeeiiiii",i);
          scope.alerts.list[i].isVisible = false;
        }
      }
      scope.$watch('alerts.list', function () {
        console.log("alerts is now:",scope.alerts.list.length, scope.alerts);
        if(scope.alerts.list.length === 0) return;
        for(var i = 0; i < scope.alerts.list.length; i++) {
          console.log("i:",i);
          if (scope.alerts.list[i].timeout > 0) {
            console.log("Heeeeeyyyyyy",i,scope.alerts.list[i].timeout);
            $timeout(myTimeoutFunction(i), scope.alerts.list[i].timeout);
            scope.alerts.list[i].timeout = 0;
          }
        }
      }, true);
*/
    }
  }
});