angular.module('alertModule').factory('alertService', ['$timeout',function($timeout) {
  var alerts = {
    list: [],
    waiting: 0
  };
  var id = 1;

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
//  alerts.add({type: "info", msg:"This is a test alert message..."});

  alerts.addServerError = function(error) {
    return alerts.add({type: "warning", msg: "Server-related errormessage: " + error.description});
  };

  alerts.addWaiting = function () {
    alerts.waiting++;
  };

  alerts.removeWaiting = function () {
    if (alerts.waiting > 0) {
      alerts.waiting--;
    }
  };

  alerts.close = function(id) {
    if(id >= 0) {
      for (var i = 0; i < alerts.list.length; i++) {
        if (alerts.list[i].id == id) {
          alerts.list.splice(i, 1);
        }
      }
    }
  };

  alerts.closeAll = function() {
    alerts.list = [];
    alerts.waiting = 0;
  };

  return alerts;

}]);
