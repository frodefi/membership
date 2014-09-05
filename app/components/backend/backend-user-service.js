angular.module('backendModule')
  .factory('backendUserService', ['$rootScope', '$kinvey',
    function($rootScope, $kinvey) {
      var user = {};

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

      user.exists = function (username)  {
        return promise = $kinvey.User.exists(username);
      };

      user.register = function (credentials) {
        console.log("backend-user register...",credentials);
        return $kinvey.User.signup(credentials);
      };

      user.sendConfirmationEmail = function (username) {
        console.log("backend-user email...",username);
        return $kinvey.User.verifyEmail(username);
      };

      user.login = function (provider, credentials) {
//      $kinvey.User.logout({ force: true });
        var promise = {};
        if (provider === 'local') {
          promise = $kinvey.User.login(credentials);
        }
        return promise;
      };

      user.logout = function () {
        var user = $kinvey.getActiveUser();
        if (null !== user) {
          return $kinvey.User.logout();
        }
      };

      user.update = function (newUserData) {
        return promise = $kinvey.User.update(newUserData);
      };

      return user;
    }
  ]);