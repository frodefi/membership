angular.module('dataModule')
  .factory('dataService', ['backendDataService', 'alertService',
    function (backendDataService, alertService) {
      var dataService = {
        details: {
          usersArray: [],
          usersObject: {}
        }
      };

      var newUserInitData = {
        profile: {
          username: "",
          fullName: "",
          email: "",
          phone: "",
          address: "",
          email2: "",
          phone2: "",
          address2: ""
        },
        memberships: {
          standard: "not active",
          renter: "not active",
          helper: "not active",
          house: "not active"
        },
        boat: {
          admin: "self",
          name: "",
          width: "",
          length: "",
          berth: ""
        },
        note: "",
        limited: {
          notes: {
            toAdmin: "",
            fromAdmin: ""
          }
        }
      };

      dataService.initThisUserData = function (user) {
        if (!dataService.details.usersObject[user.username]) {
          newUserInitData.profile.username = user.username;
          newUserInitData.profile.email = user.email || "";
          dataService.details.usersObject[user.username] = newUserInitData;
        }
      };

      dataService.init = function (user) {
        dataService.initThisUserData(user);
        alertService.addWaiting();
        var promise = backendDataService.loadAllUsersData();
        promise.then(
          function (success) {
            var thisUserDataExists = false;
            if (success.length > 0) {
              angular.copy(success, dataService.details.usersArray);
              for (var i = 0; i < dataService.details.usersArray.length; i++) {
                dataService.details.usersObject[dataService.details.usersArray[i].profile.username] = dataService.details.usersArray[i];
              }
            }
            alertService.removeWaiting();
          },
          function (error) {
            alertService.removeWaiting();
            alertService.addServerError(error);
          }
        )
        ;
      };

      dataService.save = function (username) {
        alertService.addWaiting();
        console.log("hmmmm",dataService.details.usersObject[username]);
        var promise = backendDataService.save(dataService.details.usersObject[username]);
        promise.then(
          function (success) {
            angular.extend(dataService.details.usersObject[username],success);
            alertService.removeWaiting();
          },
          function (error) {
            alertService.removeWaiting();
            alertService.addServerError(error);
          }
        );
      };

      dataService.logout = function () {
        // todo: should probably do some deletion of data here...
      };

      return dataService;
    }
  ])
;
