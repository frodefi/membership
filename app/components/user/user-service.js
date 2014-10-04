angular.module('userModule', ['backendModule'])
  .factory('userService', ['backendUserService','dataService','alertService','$location',
    function(backendUserService, dataService, alertService, $location) {
      var backend = backendUserService;
//      var account = backend.account;
      var user = {};
      user.initiated = false;
      user.authenticated = false;
      user.account = backend.account;

      var alerts = alertService;

      user.init = function(initialUser) {
        if (initialUser !== user.account) {
          angular.copy(initialUser,user.account);
        }
        user.authenticated = true;
        user.initiated = true;
        dataService.init(user.account._id);
      };

/*
      user.checkAuthenticated = function() {
        if (user.initiated) {
          return backend.checkAuthenticated();
        } else {
          return false;
        }
      };
*/

      user.register = function(credentials) {
        var alertId = alerts.add({type: "info", msg: "Wait while registering..."});
        var promise = backend.register(credentials);
        promise.then(
          function (newUser) {
            user.init(newUser);
            alerts.close(alertId);
            alerts.add({type: "success", msg: "Success registering your account. Please check your email and follow the instructions to confirm correct address."});
          },
          function (error) {
            alerts.close(alertId);
            alerts.addServerError(error);
          }
        );
        return promise;
      };

      user.exists = function(username) {
        return backend.exists(username);
      };

      user.login = function (provider, credentials) {
        var alertId = alerts.add({type: "info", msg: "Wait while logging in..."});
        var promise = backend.login(provider, credentials);
        promise.then(function (userData){
          user.init(userData);
          alerts.close(alertId);
          alerts.add({
            type: "success",
            msg: "You are now logged in. Please remember to complete your profile, it is mandatory for completing a project.",
            timeout: 5000
          });
          $location.path('user');
        }, function (error) {
          alerts.close(alertId);
          alerts.addServerError(error);
        });
      };

      user.logout = function() {
        user.initiated = false;
        user.authenticated = false;
        user.account = {};
        dataService.logout();
        var promise = backend.logout();
        promise.then(
          function () {
            $location.path('/');
          },
          function(error) {
            alerts.addServerError(error);
          }
        );
      };

      user.update = function(newUserData) {
        var id = alerts.add({type: "info", msg: "Updating..."});
        var promise = backend.update(newUserData);
        promise.then(
          function(success) {
            alerts.close(id);
            alerts.add({type: "success", msg: "Details have been updated.", timeout: 5000});
          },
          function(error) {
            alerts.close(id);
            alerts.addServerError(error);
          }
        );
      };

      return user;

/*
      function copyProperties (userDetails) {
        for (var property in userDetails) {
          if (['username','email'].indexOf(property) >= 0) {
            user.account[property] = userDetails[property];
          } else {
            user[property] = userDetails[property];
          }
        }
      }
*/
    }
  ]);
