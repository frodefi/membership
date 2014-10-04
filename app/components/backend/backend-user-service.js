angular.module('backendModule')
  .factory('backendUserService', ['$kinvey','$q',
    function ($kinvey, $q) {
      var user = {};
      user.account = {};

      user.init = function () {
      };

      /*
       user.checkAuthenticated = function() {
       var activeUser = $kinvey.getActiveUser();
       if(null === activeUser) {
       return false;
       } else {
       return true;
       }
       };
       */

      user.exists = function (username) {
        return promise = $kinvey.User.exists(username);
      };

      user.register = function (credentials) {
        var promise = $kinvey.User.signup(credentials);
        var deferred = $q.defer();
        promise.then(function (userData) {
          console.log("backend",userData);
          angular.copy(userData,user.account);
          delete user.account.password;
          user.account.createdAt = new Date(userData._kmd.ect);
          user.account.lastModified = new Date(userData._kmd.lmt);
          deferred.resolve(user.account);
        }, function (error) {
          deferred.reject(error);
        });
        return deferred.promise;
      };

      user.sendConfirmationEmail = function (username) {
        return $kinvey.User.verifyEmail(username);
      };

      user.login = function (provider, credentials) {
        var promise = {};
        if (provider === 'local') {
          promise = $kinvey.User.login(credentials);
          var deferred = $q.defer();
          promise.then(function (userData) {
            angular.copy(userData,user.account);
            user.account.createdAt = new Date(userData._kmd.ect);
            user.account.lastModified = new Date(userData._kmd.lmt);
            deferred.resolve(user.account);
          }, function (error) {
            deferred.reject(error);
          });
        }
        return deferred.promise;
      };

      user.logout = function () {
        var user = $kinvey.getActiveUser();
        if (null !== user) {
          return $kinvey.User.logout();
        }
        angular.copy({},user.account);
      };

      user.update = function (newUserData) {
        return promise = $kinvey.User.update(newUserData);
      };

      return user;

    }
  ]);
