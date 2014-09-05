angular.module('userModule', ['backendModule'])
  .factory('userService', ['$rootScope', 'backendUserService',
    function($rootScope,backendUserService) {
      var user = {
        _id: "",
        username: "",
        email: "",
        name: "",
        initiated: false,
        authenticated: false
      };

      user.init = function(initialUser) {
        if (initialUser) {
          for (var property in initialUser) user[property] = initialUser[property];
          user.authenticated = true;
          user.initiated = true;
        }
      };

/*
      user.checkAuthenticated = function() {
        if (user.initiated) {
          return backendUserService.checkAuthenticated();
        } else {
          return false;
        }
      };
*/

      user.register = function(credentials) {
        var promise = backendUserService.register(credentials);
        promise.then(
          function (newUser) {
            console.log("user-service register success: ",newUser);
            user.authenticated = true;
            user.init(newUser,true);
          },
          function (error) {
            console.log("userService-login error:",credentials,error);
          }
        );
        return promise;
      };

      user.exists = function(username) {
        return backendUserService.exists(username);
      };

      user.login = function (provider, credentials) {
        console.log("userService-login creds:",credentials);
        var promise = backendUserService.login(provider, credentials);
        promise.then(function (success){
          console.log("userService-login success :",success);
          user.authenticated = true;
          for (var property in success) user[property] = success[property];
        }, function (error) {
          console.log("userService-login error:",credentials,error);
        });
        return promise;
      };

      user.logout = function() {
        user.authenticated = false;
        return promise = backendUserService.logout();
      };

      user.update = function(newUserData) {
        return backendUserService.update(newUserData);
      };

      return user;
    }
  ]);
