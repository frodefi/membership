angular.module('userModule', ['backendModule'])
  .factory('userService', ['backendUserService','dataService',
    function(backendUserService, dataService) {
      var user = {
        _id: "",
        initiated: false,
        authenticated: false
      };

      // Perhaps email property belongs in profile instead? I have leaned towards account, because I
      // want all changes in account to be verified by the user by entering current password,
      // which is not needed for profile fields changes
      user.account = {
        username: "",
        email: ""
      };

      user.profile = {
        name: ""
      };


      user.init = function(initialUser) {
        if (initialUser) {
          copyProperties(initialUser);
          user.authenticated = true;
          user.initiated = true;
          dataService.init();
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
            user.init(newUser,true);
          },
          function (error) {
            console.log("userService-login error:",error);
          }
        );
        return promise;
      };

      user.exists = function(username) {
        return backendUserService.exists(username);
      };

      user.login = function (provider, credentials) {
        var promise = backendUserService.login(provider, credentials);
        promise.then(function (success){
          user.init(newUser,true);
        }, function (error) {
          console.log("userService-login error:",error);
        });
        return promise;
      };

      user.logout = function() {
        user.authenticated = false;
        return promise = backendUserService.logout();
        dataService.logout();
      };

      user.update = function(newUserData) {
        return backendUserService.update(newUserData);
      };

      return user;

      function copyProperties (userDetails) {
        for (var property in userDetails) {
          if (['username','email'].indexOf(property) >= 0) {
            user.account[property] = userDetails[property];
          } else if (['fullName','address'].indexOf(property) >= 0) {
            user.profile[property] = userDetails[property];
          } else {
            user[property] = userDetails[property];
          }
        }
      }
    }
  ]);
