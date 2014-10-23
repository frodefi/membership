angular.module('backendModule')
  .factory('backendUserService', ['$kinvey','$q',
    function ($kinvey, $q) {
      var backendUserService = {
        details: {}
      };

      backendUserService.exists = function (username) {
        return promise = $kinvey.User.exists(username);
      };

      backendUserService.register = function (credentials) {
        var promise = $kinvey.User.signup(credentials);
        var deferred = $q.defer();
        promise.then(function (userData) {
          delete backendUserService.details.password;
          deferred.resolve(backendUserService.details);
        }, function (error) {
          deferred.reject(error);
        });
        return deferred.promise;
      };

      backendUserService.sendConfirmationEmail = function (username) {
        return $kinvey.User.verifyEmail(username);
      };

      backendUserService.login = function (provider, credentials) {
        var promise = {};
        if (provider === 'local') {
          promise = $kinvey.User.login(credentials);
          var deferred = $q.defer();
          promise.then(function (userData) {
            angular.copy(userData,backendUserService.details);
            deferred.resolve(backendUserService.details);
          }, function (error) {
            deferred.reject(error);
          });
        }
        return deferred.promise;
      };

      backendUserService.logout = function () {
        var user = $kinvey.getActiveUser();
        if (null !== user) {
          return $kinvey.User.logout();
        }
        angular.copy({},user.details);
      };

      backendUserService.update = function (newUserData) {
        return promise = $kinvey.User.update(newUserData);
      };

      return backendUserService;

    }
  ]);
