angular.module('dataModule')
  .factory('dataService', ['backendDataService','alertService',
    function (backendDataService, alertService) {
      var data = {};

      var collectionsInit = {
        profile: [],
        roles: [],
        membership: [],
        boat: [],
        comment: []
      };

      var modelInit = {
        roles: [
          {
            member: "",
            renter: "",
            houseCommittee: "",
            helper: ""
          }
        ],
        profile: [
          {
            fullName: "",
            email: "",
            phone: "",
            address: "",
            email2: "",
            phone2: "",
            address2: ""
          }
        ],
        membership: [
          {
            status: "New",
            userId: "",
            berth: ""
          }
        ],
        boat: [
          {
            name: "",
            type: "",
            reg: "",
            width: "",
            length: ""
          }
        ],
        comment: [
          {
            comment: ""
          }
        ]
      };

      data.collections = collectionsInit;

      var alert = alertService;

      data.init = function (userId) {
        angular.forEach(data.collections, function (value, collectionName) {
          (function (collectionName) {
            var promise = backendDataService.loadCollection(collectionName,userId);
            promise.then(
              function (success) {
                if (success.length > 0) {
                  angular.copy(success,data.collections[collectionName]);
                }
              },
              function (error) {
                console.log("data-init-error: ", error);
              }
            );
          })(collectionName);

        });
      };

      data.initCollection = function (name) {
        if (name && data.collections[name].length === 0) {
          data.collections[name].push(modelInit[name][0]);
        }
      };

      data.save = function (name, modelData) {
        var id = alert.add({type: "info", msg: "Updating..."}); //todo: use spinning wheel instead of alert-box
        var promise = backendDataService.save(name, modelData);
        promise.then(
          function (success) {
            alert.close(id);
            alert.add({type: "success", msg: "Details have been updated.", timeout: 5000});
          },
          function (error) {
            alert.close(id);
            alert.addServerError(error);
          }
        );
      };

      data.logout = function () {
        data.collections = collectionsInit;
      };

      // Todo: Remove? Currently not used at all...
      data.getModel = function (id) {
        var model = {};
        for (collectionName in data.collections) {
          for (var i = 0; i < data.collections[collectionName].length; i++) {
            if (data.collections[collectionName][i].id === id) {
              return model;
            }
          }
        }
        // todo: consider to find model on server if it is not found in memory. Currently I have no use-cases where this would be necessary...
        return model; // model not found, return the empty one...
      };

      data.statusOptions = function (status) {
        if (status === "Pending") {
          return [
            {
              'name': 'Pending',
              'text': 'Waiting for approval'
            },
            {
              'name': 'Deactivated',
              'text': 'Deactivate'
            }
          ];
        } else if (status === "Active") {
          return [
            {
              'name': 'Active',
              'text': 'Active'
            },
            {
              'name': 'Deactivated',
              'text': 'Deactivate'
            }
          ];
        } else if (status === "Deactivated") {
          return [
            {
              'name': 'Deactivated',
              'text': 'Deactivated'
            },
            {
              'name': 'Pending',
              'text': 'Request reactivation'
            }
          ];
        } else if (status === "New") {
          return [
            {
              'name': 'New',
              'text': 'Writing new'
            },
            {
              'name': 'Pending',
              'text': 'Send application'
            }
          ];
        } else {
          return [];
        }
      };

      return data;
    }
  ]);
