angular.module('userModule', ['backendModule'])
  .factory('userService', ['backendUserService', 'dataService', 'alertService', '$location',
    function (backendUserService, dataService, alertService, $location) {
      var user = {
        details: {}
      };

      initProperties();

      function initProperties() {
        user.details.username = "";
        user.details.email = "";
        user.initiated = false;
        user.authenticated = false;
      }

      user.init = function (initialUser) {
        initProperties();
        angular.extend(user.details,initialUser);
        user.authenticated = true;
        user.initiated = true;
        dataService.init(user.details.username);
      };

      user.register = function (credentials) {
        alertService.addWaiting();
        var promise = backendUserService.register(credentials);
        promise.then(
          function (newUser) {
            user.init(newUser);
            alertService.removeWaiting();
          },
          function (error) {
            alertService.removeWaiting();
            alertService.addServerError(error);
          }
        );
        return promise;
      };

      user.exists = function (username) {
        return backendUserService.exists(username);
      };

      user.login = function (provider, credentials) {
        alertService.addWaiting();
        var promise = backendUserService.login(provider, credentials);
        promise.then(function (accountData) {
          user.init(accountData);
          alertService.removeWaiting();
          alertService.add({
            type: "success",
            msg: "You are now logged in. Please remember to complete your profile, it is mandatory for completing a project.",
            timeout: 5000
          });
          $location.path('user/' + user.details.username);
        }, function (error) {
          alertService.removeWaiting();
          alertService.addServerError(error);
        });
      };

      user.logout = function () {
        initProperties();
        dataService.logout();
        var promise = backendUserService.logout();
        promise.then(
          function () {
            $location.path('/');
          },
          function (error) {
            alertService.addServerError(error);
          }
        );
      };

      user.save = function (newUserData) {
        alertService.addWaiting();
        var promise = backendUserService.update(newUserData);
        promise.then(
          function (success) {
            if (newUserData.username !== user.details.username) {
              dataService.details.usersObject[newUserData.username] = dataService.details.usersObject[user.username];
              delete dataService.details.usersObject[user.username];
            }
            angular.extend(user.details,newUserData);
            alertService.removeWaiting();
          },
          function (error) {
            alertService.removeWaiting();
            alertService.addServerError(error);
          }
        );
      };

      return user;

    }
  ])
;
