angular.module('dataModule')
  .factory('dataService', ['backendDataService', 'alertService',
    function (backendDataService, alertService) {
      var dataService = {
        thisUserUsername: "",
        usersArray: [],
        usersObject: {},
        thisUser: {}
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
        note: "",
        limited: {
          notes: {
            toAdmin: "",
            fromAdmin: ""
          }
        },
        newWorkReport: {
          date: "",
          comment: "",
          hours: ""
        },
        workReports: [],
        boat: {
          name: "",
          width: "",
          length: "",
          berth: ""
        }
      };

      dataService.initThisUserData = function (user) {
        if (dataService.usersObject[user.username]) {
          dataService.thisUser = dataService.usersObject[user.username];
        } else {
          newUserInitData.profile.username = user.username;
          newUserInitData.profile.email = user.email || "";
          dataService.usersObject[user.username] = newUserInitData;
          dataService.thisUser = newUserInitData;
        }
      };

      dataService.init = function (user) {
        if (!dataService.thisUser) {
          dataService.initThisUserData(user);
        }
        alertService.addWaiting();
        var promise = backendDataService.loadAllUsersData();
        promise.then(
          function (success) {
            if (success.length > 0) {
              angular.copy(success, dataService.usersArray);
              for (var i = 0; i < dataService.usersArray.length; i++) {
                dataService.usersObject[dataService.usersArray[i].profile.username] = dataService.usersArray[i];
                if (dataService.thisUserUsername === dataService.usersArray[i].profile.username) {
                  dataService.thisUser = dataService.usersArray[i];
                }
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

      dataService.save = function () {
        alertService.addWaiting();
        dataService.thisUser.workReports.unshift(dataService.thisUser.newWorkReport);
        dataService.thisUser.newWorkReport = {};
        var promise = backendDataService.save(dataService.thisUser);
        promise.then(
          function (success) {
            angular.extend(dataService.thisUser,success);
            alertService.removeWaiting();
          },
          function (error) {
            dataService.thisUser.newWorkReport = dataService.thisUser.workReports.shift();
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
