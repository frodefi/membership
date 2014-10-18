angular.module('dataModule')
  .factory('dataService', ['backendDataService', 'alertService',
    function (backendDataService, alertService) {
      var data = {
        details: {
          usersArray: {},
          usersObject: {}
        }
      };

      var newUserInitData = {
        memberTypes: {
          standard: "not active",
          renter: "not active",
          helper: "not active",
          house: "not active"
        },
        boat: {
          admin: "self"
        },
        limited: {}
      };

      data.init = function (username) {
        data.waiting = true;
        var promise = backendDataService.loadAllUsersData();
        promise.then(
          function (success) {
            if (success.length > 0) {
              angular.copy(success, data.details.usersArray);
              for (var i = 0; i < data.details.usersArray.length; i++) {
                data.details.usersObject[data.details.usersArray[i].account.username] = data.details.usersArray[i];
              }
            }
            if (!data.details.usersObject.hasOwnProperty(username)) {
              data.details.usersArray.unshift(newUserInitData);
              data.details.usersObject[username] = newUserInitData;
              data.save(username);
            }
            alertService.removeWaiting();
          },
          function (error) {
            alertService.removeWaiting();
            console.log("data-init-error: ", error);
          }
        );
      };

      data.save = function (username) {
        data.waiting = true;
        var promise = backendDataService.save(data.details.usersObject[username]);
        promise.then(
          function (success) {
            alertService.removeWaiting();
          },
          function (error) {
            alertService.removeWaiting();
            alertService.addServerError(error);
          }
        );
      };

      data.logout = function () {
        // todo: should probably do some deletion of data here...
      };

      return data;
    }
  ]);
