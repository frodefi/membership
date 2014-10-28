angular.module('userModule', ['backendModule'])
  .factory('userService', ['backendUserService', 'alertService', '$location', 'dataService',
    function (backendUserService, alertService, $location, dataService) {
      var userService = {};

      initProperties();

      function initProperties() {
        userService.account = {};
        userService.account.username = "";
        userService.account.email = "";
        userService.authenticated = false;
      }

      userService.init = function (initialUser) {
        initProperties();
        angular.extend(userService.account, initialUser);
        userService.authenticated = true;
        dataService.init(userService.account);
      };

      userService.register = function (credentials) {
        alertService.addWaiting();
        var promise = backendUserService.register(credentials);
        promise.then(
          function () {
            userService.init(credentials);
            dataService.save();
            alertService.removeWaiting();
            alertService.add({
              type: "success",
              msg: "You are now logged in. Have fun!",
              timeout: 5
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
            msg: "You are now logged in. Have fun!",
            timeout: 5
          });
          $location.path('user/' + userService.account.username);
        }, function (error) {
          alertService.removeWaiting();
          if (error.name === "InvalidCredentials") {
            alertService.add({type: "warning", msg:"Wrong username and/or password. Please try again.",timeout: 5})
          } else {
            alertService.addServerError(error);
          }
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

      userService.save = function (newUserAccountData) {
        alertService.addWaiting();
        var promise = backendUserService.update(newUserAccountData);
        promise.then(
          function (success) {
            if (newUserAccountData.username !== userService.account.username) {
              dataService.usersObject[userService.account.username].profile.username = newUserAccountData.username;
              dataService.save(userService.account.username);
              dataService.usersObject[newUserAccountData.username] = dataService.usersObject[userService.account.username];
              delete dataService.usersObject[userService.account.username];
            }
            angular.extend(userService.account, newUserAccountData);
            alertService.removeWaiting();
          },
          function (error) {
            alertService.removeWaiting();
            alertService.addServerError(error);
          }
        );
      };

      return userService;

    }
  ])
;
