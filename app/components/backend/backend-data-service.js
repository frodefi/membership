angular.module('backendModule')
  .factory('backendDataService', ['$kinvey','$q',
    function($kinvey,$q) {
      var data = {};

      data.loadCollection = function(collectionName) {
        var promise  = $kinvey.DataStore.find(collectionName);
        var deferred = $q.defer();
        promise.then( function(data) {
          for(var i=0; i<data.length; i++) {
            data[i].createdAt    = new Date(data[i]._kmd.ect);
            data[i].lastModified = new Date(data[i]._kmd.lmt);
          }
          deferred.resolve(data);
        }, function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      };

      data.save = function(collectionName,data) {
        var promise  = $kinvey.DataStore.save(collectionName,data);
        var deferred = $q.defer();
        promise.then( function(data) {
          data.createdAt    = new Date(data._kmd.ect);
          data.lastModified = new Date(data._kmd.lmt);
          deferred.resolve(data);
        }, function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      };

      return data;
    }
  ]);
