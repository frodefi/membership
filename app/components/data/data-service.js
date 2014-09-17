angular.module('dataModule')
  .factory('dataService', ['backendDataService',
    function(backendDataService) {
      var data = {};
      data.collections = {
        membership: [],
        boat: []
      };

      data.init = function() {
        for(collectionName in data.collections) {
          (function(collectionName) {
            var promise = backendDataService.loadCollection(collectionName);
            promise.then(
              function (success) {
                console.log("data init success:",collectionName,success);
                data.collections[collectionName] = success;
              },
              function (error) {
                console.log("data-init-error: ",error);
              }
            );
          })(collectionName);
        }
      };

      data.save = function(name,data) {
        return backendDataService.save(name,data);
      };

      return data;
    }
  ]);
