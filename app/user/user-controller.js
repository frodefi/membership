angular.module('app.controllers')
  .controller('UserCtrl', ['$scope', '$window', 'userService', 'dataService', '$location',
    function ($scope, $window, userService, dataService, $location) {
      var warning = "You have unsaved changes, are you sure you want to leave this page?";
      var passwordNotUpdated = "Passw0rdNotUpdated!";
      $scope.model = {};
      $scope.model.showHelp = {};
      $scope.model.data = dataService;
      $scope.model.user = userService;
      $scope.model.user.details.password = passwordNotUpdated;
      $scope.model.user.details.confirmPassword = passwordNotUpdated;
      $scope.model.user.pristine = angular.copy($scope.model.user.details);
      $scope.model.data.pristine = angular.copy($scope.model.data.details.thisUser);
      $scope.model.unsavedChanges = false;
      $scope.model.viewMode = true;
      $scope.model.submitText = "Save changes";

      $scope.model.setViewMode = function (value) {
        $scope.model.viewMode = value;
        if (value) {
          angular.copy($scope.model.user.pristine, $scope.model.user.details);
          angular.copy($scope.model.data.pristine, $scope.model.data.details.thisUser);
          $scope.model.setShowHelp();
        } else {
          $scope.model.user.pristine = angular.copy($scope.model.user.details);
          $scope.model.data.pristine = angular.copy($scope.model.data.details.thisUser);
          var removeListener = function () {
          };
          $scope.test = [$scope.model.user.details,$scope.model.data.details.thisUser];
          $scope.$watch(function () {
            return [$scope.model.user.details,$scope.model.data.details.thisUser];
          }, function (newValue, oldValue) {
            console.log("hmm",changed(newValue[0],$scope.model.user.pristine),newValue[0],$scope.model.user.pristine);
            console.log("hmm2",changed(newValue[1],$scope.model.data.pristine),newValue[1],$scope.model.data.pristine);
            if (!angular.equals(newValue, oldValue)) {
              if (!changed(newValue[0],$scope.model.user.pristine) &&
                !changed(newValue[1],$scope.model.data.pristine)) {
                console.log("hbrmm",newValue);
                removeListener();
                $window.onbeforeunload = undefined;
                $scope.model.unsavedChanges = false;
              } else if (!$scope.model.unsavedChanges) {
                console.log("Jaaa");
                removeListener = $scope.$on('$locationChangeStart', function (event, next, current) {
                  if (!confirm(next + " " + warning)) {
                    event.preventDefault();
                  }
                });
                $window.onbeforeunload = function () {
                  return warning;
                };
                $scope.model.unsavedChanges = true;
              }
            }
          }, true);
        }
      };

      $scope.model.updateAll = function () {
        var userDetails = $scope.model.user.details;
        delete userDetails.confirmPassword;
        if (userDetails.password === passwordNotUpdated) {
          delete userDetails.password;
        }
        // Todo: Add current password verification (for any changes of any account-fields)
        userService.update(userDetails);
        dataService.updateAll();
      };

      $scope.model.setShowHelp = function (field) {
        angular.forEach($scope.model.showHelp, function (value, key) {
          $scope.model.showHelp[key] = false;
        });
        if (field) {
          $scope.model.showHelp[field] = true;
        }
      };

      $scope.model.resetPasswords = function () {
        angular.forEach(['password', 'confirmPassword'], function (property) {
          if ($scope.model.user.details[property] === passwordNotUpdated) {
            $scope.model.user.details[property] = "";
          }
        });
      };

      // An empty property is disregarded, so with 'a={property:""}' and 'b={}' changed(a,b) returns false...
      // Checks only non-object properties
      // Only checks one direction, ie if a has properties with different value from b (and not the other way around)
      function changed (a,b) {
        for (var key in a) {
          if (a.hasOwnProperty(key) && a[key] && !angular.isObject(a[key])) {
            if (!b.hasOwnProperty(key) || a[key] !== b[key]) {
              console.log("changed",key,a[key].isObject,a[key],b[key]);
              return true;
            }
          }
        }
        return false;
      }

    }]);
