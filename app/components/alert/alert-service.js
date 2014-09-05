angular.module('alertModule').factory('alertService', ['$timeout',function($timeout) {
  var alerts = {};
  var id = 1;

  alerts.list = [];

  alerts.add = function(alert) {
    alert.id = id;
    alert.isVisible = true;
    alerts.list.push(alert);
    function timeoutCallback(id) {
      return function (){
        console.log("BBB",id);
        alerts.close(id);
      }
    }
    if (alert.timeout > 0) {
      console.log("AAA",id,alert.timeout);
      $timeout(timeoutCallback(id), alert.timeout);
    }
    id += 1;
    console.log("alertService.add: ",alert);
    return alert.id;
  };

  alerts.add({type: "info", msg:"This is a test alert message...",timeout: 5000});

  alerts.addServerError = function(error) {
    var id = alerts.add({type: "warning", msg: "Errormessage from server: " + error.description});
//    console.log("alertService: Server Error: ", error);
    return id;
  };

  alerts.close = function(id) {
    for(var i = 0; i<alerts.list.length; i++) {
      console.log("alert:",i,alerts.list[i].id);
      if (alerts.list[i].id == id) {
        console.log("Heey");
        alerts.list.splice(i, 1);
      }
    }
  };

  alerts.closeAll = function() {
    alerts.list = [];
  };

  return alerts;

}]);
