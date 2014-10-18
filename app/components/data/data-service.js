angular.module('dataModule')
  .factory('dataService', ['backendDataService', 'alertService',
    function (backendDataService, alertService) {
      var data = {
        details: {}
      };

      initProperties();

      function initProperties() {
        data.details = {
          me: {
            public: {
              memberTypes: {
                standard: "not active",
                renter: "not active",
                helper: "not active",
                house: "not active"
              },
              boat: {
                admin: "self"
              }
            },
            limited: {},
            admin: {}
          },
          allUsers: {}
        };
      }

      data.init = function (userId) {
        initProperties();
        data.waiting = true;
        var promise = backendDataService.loadAllUsersData();
        promise.then(
          function (success) {
            if (success.length > 0) {
              angular.copy(success, data.details.allUsers);
              for (var i = 0; i < data.details.allUsers.length; i++) {
                if (data.details.allUsers[i]._id === userId) {
                  angular.copy(data.details.allUsers[i], data.details.me);
                  data.details.allUsers.splice(i, 1);
                }
              }
            }
            alertService.removeWaiting();
          },
          function (error) {
            alertService.removeWaiting();
            console.log("data-init-error: ", error);
          }
        );
      };

      data.save = function (collectionName) {
        data.waiting = true;
        var promise = backendDataService.save(collectionName, data.details[collectionName]);
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
        initProperties();
      };

      return data;
    }
  ]);
