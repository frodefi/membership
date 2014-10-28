angular.module('dataModule')
  .factory('dataService', ['backendDataService', 'alertService',
    function (backendDataService, alertService) {
      var dataService = {};

      var newUserInitData = {
        userId: "",
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
        managerUserId: "",
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

      function initData () {
        dataService.thisUserUsername = "";
        dataService.ignoreWatch = false;
        dataService.usersArray = [];
        dataService.usersObject = {};
        dataService.thisUser = angular.copy(newUserInitData);
      }

      initData();

      dataService.initThisUserData = function (user) {
        if (dataService.usersObject[user.username]) {
          dataService.thisUser = dataService.usersObject[user.username];
        } else {
          dataService.thisUser.profile.username = user.username;
          dataService.thisUser.profile.email = user.email || "";
          dataService.usersObject[user.username] = dataService.thisUser;
        }
      };

      dataService.init = function (user) {
        dataService.initThisUserData(user);
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

      dataService.save = function (authenticatedUser) {
        alertService.addWaiting();
        var data = angular.copy(dataService.thisUser);
        if (data.newWorkReport.date && data.newWorkReport.hours) {
          data.workReports.unshift(data.newWorkReport);
        }
        data.newWorkReport = {};
        if (authenticatedUser !== 'admin' && data.admin) {
          delete data.admin;
        }
        var promise = backendDataService.save(data);
        promise.then(
          function (success) {
            angular.extend(dataService.thisUser, success);
            dataService.ignoreWatch = true;
            alertService.removeWaiting();
          },
          function (error) {
            alertService.removeWaiting();
            alertService.addServerError(error);
          }
        );
      };

      dataService.logout = function () {
        initData();
        dataService.ignoreWatch = true;
      };

      dataService.findUser = function (id) {
        var data = "";
        angular.forEach(dataService.usersArray, function (value) {
          if (!data) {
            if (value.userId === id) {
              data = value;
            }
          }
        });
        return data;
      };
      return dataService;
    }
  ])
;
