angular.module('backendModule')
  .factory('backendDataService', ['$kinvey', '$q',
    function ($kinvey, $q) {
      var backendDataService = {};

      backendDataService.loadAllUsersPublicData = function () {
        var query = new $kinvey.Query();
        query.descending('_kmd.lmt'); // Last modified first
        var promise = $kinvey.DataStore.find('data',query);
        var deferred = $q.defer();
        promise.then(function (data) {
          if(data.length > 0) {
            convertKinveySpecialProperties(data);
          }
          deferred.resolve(data);
        }, function (error) {
          deferred.reject(error);
        });
        return deferred.promise;
      };

      backendDataService.save = function (collectionName, data) {
        console.log("backend:",collectionName, data);
        delete data.createdAt;
        delete data.lastModified;
        delete data.creatorId;
        var promise = $kinvey.DataStore.save(collectionName, data);
        var deferred = $q.defer();
        promise.then(function (data) {
          convertKinveySpecialProperties(data);
          deferred.resolve(data);
        }, function (error) {
          deferred.reject(error);
        });
        return deferred.promise;
      };

      return backendDataService;

      function convertKinveySpecialProperties(data) {
        console.log("data",data);
        data.creatorId = data._acl.creator;
        data.createdAt = new Date(data._kmd.ect);
        data.lastModified = new Date(data._kmd.lmt);
      }
    }
  ]);
