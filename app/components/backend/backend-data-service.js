angular.module('backendModule')
  .factory('backendDataService', ['$kinvey', '$q',
    function ($kinvey, $q) {
      var data = {};

      data.loadCollection = function (collectionName,userId) {
        var query = new $kinvey.Query();
        query.descending('_kmd.lmt'); // Last modified first
        if(userId) {
          query.equalTo('_acl.creator', userId);
        }
        var promise = $kinvey.DataStore.find(collectionName,query);
        var deferred = $q.defer();
        promise.then(function (data) {
          for (var i = 0; i < data.length; i++) {
            convertKinveySpecialProperties(data[i]);
          }
          deferred.resolve(data);
        }, function (error) {
          deferred.reject(error);
        });
        return deferred.promise;
      };

      data.save = function (collectionName, data) {
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

      return data;

      function convertKinveySpecialProperties(model) {
        model.creatorId = model._acl.creator;
        model.createdAt = new Date(model._kmd.ect);
        model.lastModified = new Date(model._kmd.lmt);
//        return model;
      }
    }
  ]);
