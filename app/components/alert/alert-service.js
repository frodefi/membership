angular.module('alertModule').factory('alertService', ['$timeout',function($timeout) {
  var alerts = {};
  var id = 1;

  alerts.list = [];

  alerts.add = function(alert) {
    alert.id = id;
    alerts.list.push(alert);
    function timeoutCallback(id) {
      return function (){
        alerts.close(id);
      }
    }
    if (alert.timeout > 0) {
      $timeout(timeoutCallback(id), alert.timeout);
    }
    id += 1;
    return alert.id;
  };

//  alerts.add({type: "info", msg:"This is a test alert message...",timeout: 5000});

  alerts.addServerError = function(error) {
    return alerts.add({type: "warning", msg: "Server-related errormessage: " + error.description});
  };

  alerts.close = function(id) {
    for(var i = 0; i<alerts.list.length; i++) {
      if (alerts.list[i].id == id) {
        alerts.list.splice(i, 1);
      }
    }
  };

  alerts.closeAll = function() {
    alerts.list = [];
  };

  return alerts;

}]);
