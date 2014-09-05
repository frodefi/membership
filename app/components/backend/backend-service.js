angular.module('backendModule')
  .factory('backendService', ['$kinvey', function($kinvey) {
    var backend = {};

    backend.init = function(appCredentials) {
      console.log("backendService", appCredentials);
      var promise = $kinvey.init(appCredentials);
      promise.then(function (user) {
        console.log("backendService.init - User:", user);
        promise = $kinvey.ping();
        promise.then(function (response) {
          console.log('Kinvey Ping Success. Kinvey Service is alive, version: ' + response.version + ', response: ' + response.kinvey);
        }, function (error) {
          console.log('Kinvey Ping Failed. Response: ' + error.description);
        });
      }, function (error) {
        console.log("Kinvey init Error:", error);
      });
      return promise;
    };

    return backend;
  }]);
