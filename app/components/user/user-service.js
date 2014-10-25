angular.module('userModule', ['backendModule'])
  .factory('userService', ['backendUserService', 'alertService', '$location', 'dataService',
    function (backendUserService, alertService, $location, dataService) {
      var userService = {
        account: {}
      };

      initProperties();

      function initProperties() {
        userService.account.username = "";
        userService.account.email = "";
        userService.authenticated = false;
      }

      userService.init = function (initialUser) {
        userService.account = angular.extend({}, initialUser);
        userService.authenticated = true;
        dataService.init(userService.account);
      };

      userService.register = function (credentials) {
        alertService.addWaiting();
        var promise = backendUserService.register(credentials);
        promise.then(
          function () {
            userService.init(credentials);
            dataService.save(credentials.username);
            alertService.removeWaiting();
            alertService.add({
              type: "success",
              msg: "You are now logged in. Please remember to complete your profile.",
              timeout: 5000
            });
            $location.path('user/' + userService.account.username);
          },
          function (error) {
            alertService.removeWaiting();
            alertService.addServerError(error);
          }
        );
        return promise;
      };

      userService.exists = function (username) {
        return backendUserService.exists(username);
      };

      userService.login = function (provider, credentials) {
        alertService.closeAll();
        alertService.addWaiting();
        var promise = backendUserService.login(provider, credentials);
        promise.then(function (accountData) {
          userService.init(accountData);
          alertService.removeWaiting();
          alertService.add({
            type: "success",
            msg: "You are now logged in. Please remember to complete your profile.",
            timeout: 5000
          });
          $location.path('user/' + userService.account.username);
        }, function (error) {
          alertService.removeWaiting();
          alertService.addServerError(error);
        });
        return promise;
      };

      userService.logout = function () {
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

      userService.save = function (newUserData) {
        alertService.addWaiting();
        var promise = backendUserService.update(newUserData);
        promise.then(
          function (success) {
            if (newUserData.username !== userService.account.username) {
              dataService.usersObject[newUserData.username] = dataService.usersObject[userService.username];
              delete dataService.usersObject[userService.username];
            }
            angular.extend(userService.account, newUserData);
            alertService.removeWaiting();
          },
          function (error) {
            alertService.removeWaiting();
            alertService.addServerError(error);
            console.log("For faen!?");
          }
        );
      };

      return userService;

    }
  ])
;
