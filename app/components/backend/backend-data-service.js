angular.module('backendModule')
  .factory('backendDataService', ['$kinvey', '$q',
    function ($kinvey, $q) {
      var backendDataService = {};

      backendDataService.loadAllUsersData = function () {
        var query = new $kinvey.Query();
        query.descending('fullName'); // Last modified first
        var promise = $kinvey.DataStore.find('usersPublic',query);
        var deferred = $q.defer();
        promise.then(function (data) {
          for (var i = 0; i < data.length; i++) {
            convertKinveySpecialProperties(i);
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

      function convertKinveySpecialProperties(i) {
        console.log("convertkinvey-data".i,data[i]);
        data[i].creatorId = data[i]._acl.creator;
        data[i].createdAt = new Date(data[i]._kmd.ect);
        data[i].lastModified = new Date(data[i]._kmd.lmt);
      }
    }
  ]);
