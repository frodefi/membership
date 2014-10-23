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
            data[i] = convertKinveySpecialProperties(data[i]);
          }
          deferred.resolve(data);
        }, function (error) {
          deferred.reject(error);
        });
        return deferred.promise;
      };

      backendDataService.save = function (data) {
        console.log("backend-save:",data);
        delete data.createdAt;
        delete data.lastModified;
        delete data.creatorId;
        // todo: set up security on the server (admin can read and write all), that will probably also involve change this code a tiny bit...
        // todo: set up role of admin that can read/write all data
        // todo: set up role of board that can read all data
        var promise = $kinvey.DataStore.save("usersPublic", data,{
          relations: {
            limited: "usersLimited",
            admin: "usersAdmin"
          }
        });
        var deferred = $q.defer();
        promise.then(function (data) {
          data = convertKinveySpecialProperties(data);
          deferred.resolve(data);
        }, function (error) {
          deferred.reject(error);
        });
        return deferred.promise;
      };

      return backendDataService;

      function convertKinveySpecialProperties(data) {
        data.creatorId = data._acl.creator;
        data.createdAt = new Date(data._kmd.ect);
        data.lastModified = new Date(data._kmd.lmt);
        return data;
      }
    }
  ]);
