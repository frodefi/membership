angular.module('app.controllers')
  .controller('UserCtrl', ['$scope','$window','userService','dataService','alertService','dataLastModifiedFilter',
    function ($scope, $window, userService, dataService, alertService, dataLastModifiedFilter) {
      var alerts                              = alertService;
      var user                                = userService;
      var data                                = dataService;
      var passwordNotUpdated                  = "Passw0rdNotUpdated!";
      $scope.details                          = {};
      $scope.details.account                  = user.account;
      $scope.details.account.password         = passwordNotUpdated;
      $scope.details.account.confirmPassword  = passwordNotUpdated;
      $scope.details.account.open             = false;
      $scope.details.profile                  = user.profile;
      $scope.details.profile.open             = false;
      $scope.details.membership               = {};
      $scope.details.membership.current       = angular.copy(dataLastModifiedFilter(data.collections.membership));
      $scope.details.membership.open          = true;
      $scope.details.membership.exists        = true;
      $scope.details.membership.statusOptions = statusOptions(data.collections.membership.status);
      $scope.details.boat                     = {};
      $scope.details.boat.current             = angular.copy(dataLastModifiedFilter(data.collections.boat));
      $scope.details.boat.open                = false;
      $scope.details.boat.exists              = false;

      $scope.details.add = function(formGroup) {
        closeAllFormGroups();
        $scope.details[formGroup].open        = true;
        $scope.details[formGroup].exists      = true;
      };
      $scope.details.save = function(formGroup) {
        var id = alerts.add({type: "info", msg: "Updating..."});
        var promise = {};
        var details = $scope.details[formGroup];
        console.log("formGroup - details:",formGroup,details);
        if(formGroup === "account") {
          // Todo: Add (current) password verification (for any changes of any account-fields)
          delete details.account.confirmPassword;
          if(details.account.password === passwordNotUpdated) {
            delete details.account.password;
          }
          promise = user.update(details.account);
        } else if(formGroup === "profile") {
          promise = user.update(details.profile);
        } else {
          details = $scope.details[formGroup].current;
          promise = data.save(formGroup,details);
        }
        promise.then(
          function(success) {
            alerts.close(id);
            alerts.add({type: "success", msg: "Details have been updated.", timeout: 2000});
          },
          function(error) {
            alerts.close(id);
            alerts.addServerError(error);
          }
        );
      };

      //Todo: Only have the location-changes give warnings if the form is dirty
      $scope.$on('$locationChangeStart', function(event, next, current) {
        if(!confirm("Changes may be lost, are you sure you want to leave this page?")) {
          event.preventDefault();
        }
      });

      $window.onbeforeunload = function(){
        return "You may lose your changes if you leave.";;
      };

      $scope.$on('$destroy', function() {
        $window.onbeforeunload = undefined;
      });

      $scope.$watch(function() {return data.collections.membership}, function(newValue){
        if (newValue.length>0) {
          $scope.details.membership.current = angular.copy(dataLastModifiedFilter(newValue));
          $scope.details.membership.statusOptions = statusOptions($scope.details.membership.current.status);
        }
      },true);

      $scope.$watch(function() {return data.collections.boat}, function(newValue){
        if (newValue.length>0) {
          $scope.details.boat.current = dataLastModifiedFilter(newValue);
        }
      },true);

      function statusOptions(status) {
        if (status === "Pending") {
          return [{
            'name': 'Pending',
            'text': 'Waiting for approval'
          }, {
            'name': 'Deactivated',
            'text': 'Deactivate'
          }];
        } else if (status === "Active") {
          return [{
            'name': 'Active',
            'text': 'Active'
          }, {
            'name': 'Deactivated',
            'text': 'Deactivate'
          }];
        } else if (status === "Deactivated") {
          return [{
            'name': 'Deactivated',
            'text': 'Deactivated'
          }, {
            'name': 'Pending',
            'text': 'Request reactivation'
          }];
        } else {
          return [];
        }
      }

      function closeAllFormGroups () {
        $scope.details.account.open    = false;
        $scope.details.profile.open    = false;
        $scope.details.membership.open = false;
        $scope.details.boat.open       = false;
      }

    }]);
