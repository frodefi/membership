angular.module('app.controllers')
  .controller('UserCtrl', ['$scope', '$window', 'userService', 'dataService', '$routeSegment',
    function ($scope, $window, userService, dataService, $routeSegment) {
      var warning = "You have unsaved changes, are you sure you want to leave this page?";
      var passwordNotUpdated = "Passw0rdNotUpdated!";
      $scope.model = {};
      $scope.model.showHelp = {};
      dataService.initThisUserData({username: $routeSegment.$routeParams.username});
      dataService.thisUserUsername = $routeSegment.$routeParams.username;
      $scope.model.data = dataService;
      $scope.model.user = userService;
      $scope.model.user.account.password = passwordNotUpdated;
      $scope.model.user.account.confirmPassword = passwordNotUpdated;
      $scope.model.user.pristine = angular.copy($scope.model.user.account);
      $scope.model.data.pristine = angular.copy($scope.model.data.thisUser);
      $scope.model.memberships = {};
      $scope.model.options = {};
      $scope.model.unsavedChanges = false;
      $scope.model.viewMode = true;
      $scope.model.membershipFocus = false;
      $scope.model.submitText = "Save changes";
      var removeListener = function () {
      };
      var memberships = ["standard", "renter", "helper", "house"];
      angular.forEach(memberships, function (value) {
        $scope.model.memberships[value] = "not active";
      });


      $scope.model.hideEmpty = function (fields) {
        if ($scope.model.data.thisUserUsername === $scope.model.user.account.username ||
          $scope.model.user.account.username === "admin") {
          return false; // We do not hide any empty from the owner of the data or admin (those who can edit)
        }
        var isEmpty = true;
        if (!angular.isArray(fields)) {
          fields = [fields];
        }
        angular.forEach(fields, function (value) {
          values = value.split(".");
          if ($scope.model.data.thisUser[value] || $scope.model.data.thisUser[values[0]][values[1]]) {
            isEmpty = false;
          }
        });
        return isEmpty;
      };

      $scope.model.setShowHelp = function (field) {
        angular.forEach($scope.model.showHelp, function (value, key) {
          $scope.model.showHelp[key] = false;
        });
        if (field) {
          $scope.model.showHelp[field] = true;
        }
      };

      $scope.model.setViewMode = function (value) {
        $scope.model.viewMode = value;
        if (value) {
          $scope.model.user.account = angular.extend($scope.model.user.pristine);
          $scope.model.data.thisUser = angular.extend($scope.model.data.pristine);
          $scope.model.setShowHelp();
        } else {
          $scope.model.user.pristine = angular.copy($scope.model.user.account);
          $scope.model.data.pristine = angular.copy($scope.model.data.thisUser);
          // If the user edits the form and then undo this by deleting/changing back the entered data,
          // then Angular is still claiming that a form dirty and not in pristine condition.
          // We improve that by do a manually check and toggle $scope.model.unsavedChanges accordingly.
          // In addition we want to warn the user from leaving this site if there are unsaved form data.
          $scope.$watch(function () {
            return [$scope.model.user.account, $scope.model.data.thisUser];
          }, function (newValue, oldValue) {
            var tmpNewValue = angular.copy(newValue);
            var tmpOldValue = angular.copy(oldValue);
            delete tmpNewValue[0].lastModified; // This is not a form-field value
            delete tmpNewValue[1].lastModified; // and it changes after saving
            delete tmpOldValue[0].lastModified; // so let´s ignore it...
            delete tmpOldValue[1].lastModified;
            if (!angular.equals(tmpNewValue, tmpOldValue)) {
              if (!changed(newValue[0], $scope.model.user.pristine) && !changed(newValue[1], $scope.model.data.pristine)) {
                removeListener();
                $window.onbeforeunload = undefined;
                $scope.model.unsavedChanges = false;
              } else if (!$scope.model.unsavedChanges) {
                removeListener = $scope.$on('$locationChangeStart', function (event, next, current) {
                  if (!(/\/user(\/[^\/]+\/(account|profile|memberships|notes|boat))?$/.test(next)) && !confirm(warning)) {
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
        if ($scope.model.data.thisUserUsername === $scope.model.user.account.username && !angular.equals($scope.model.user.account, $scope.model.user.pristine)) {
          var userDetails = angular.copy($scope.model.user.account);
          delete userDetails.confirmPassword;
          if (userDetails.password === passwordNotUpdated) {
            delete userDetails.password;
          }
          // Todo: For any changes of any account-fields (userService): Add current password verification
          userService.save(userDetails);
          $scope.model.user.pristine = angular.copy($scope.model.user.account);
        }
        if (!angular.equals($scope.model.data.thisUser, $scope.model.data.pristine)) {
          dataService.save($scope.model.data.thisUserUsername);
          $scope.model.data.pristine = angular.copy($scope.model.data.thisUser);
        }
        $scope.model.viewMode = true;
        $scope.model.unsavedChanges = false;
        $window.onbeforeunload = undefined;
        removeListener();
        updateSelectOptions();
      };

      $scope.model.resetPasswords = function () {
        angular.forEach(['password', 'confirmPassword'], function (property) {
          if ($scope.model.user.account[property] === passwordNotUpdated) {
            $scope.model.user.account[property] = "";
          }
        });
      };

      $scope.$watch('model.data.thisUser.memberships', function () {
        updateSelectOptions();
      }, true);

      function updateSelectOptions() {
        if (!$scope.model.membershipFocus && !$scope.model.unsavedChanges) {
          angular.forEach(memberships, function (membership) {
            $scope.model.options[membership] = setSelectOptions(membership);
          });
        }
      }

      function setSelectOptions(membership) {
        var status = $scope.model.data.thisUser.memberships[membership];
        if ($scope.model.user.account.username === 'admin' &&
          status === "pending") {
          return [
            {
              'name': 'pending',
              'text': 'Awaiting approval'
            },
            {
              'name': 'deactivated',
              'text': 'Deactivate'
            },
            {
              'name': 'active',
              'text': 'Activate'
            }
          ];
        } else if ($scope.model.user.account.username === $scope.model.data.thisUserUsername &&
          status === "pending") {
          return [
            {
              'name': 'pending',
              'text': 'Awaiting approval'
            },
            {
              'name': 'deactivated',
              'text': 'Deactivate'
            }
          ];
        } else if (status === "active") {
          return [
            {
              'name': 'active',
              'text': 'Active'
            },
            {
              'name': 'deactivated',
              'text': 'Deactivate'
            }
          ];
        } else if (status === "deactivated") {
          return [
            {
              'name': 'deactivated',
              'text': 'Deactivated'
            },
            {
              'name': 'pending',
              'text': 'Request reapproval'
            }
          ];
        } else if (status === "not active") {
          return [
            {
              'name': 'not active',
              'text': 'Not active'
            },
            {
              'name': 'pending',
              'text': 'Request approval '
            }
          ];
        } else {
          return [];
        }
      };

      // This function is to be used to check if the form has changed compared to the pristine data.
      // Therefore it checks one direction, ie if ´a´ has properties with different value from ´b´ (and not the other way around)
      // An empty property is disregarded, so with a={property:""}´ and ´b={}´ then ´changed(a,b)´ returns false...
      // Equally, with a={anotherobject: {property:""}}´ and ´b={}´ then ´changed(a,b)´ returns false...
      // Ignoring properties starting with underscore.
      // Properties that are objects are checked recursively.
      function changed(a, b) {
        var result = false;
        angular.forEach(a, function (value, key) {
          if (!result && key.charAt(0) !== "_" && hasValue(value)) {
            if (b.hasOwnProperty(key)) {
              if (angular.isObject(value)) {
                if (changed(value, b[key])) {
                  result = true;
                }
              } else if (value !== b[key]) {
                result = true;
              }
            } else {
              result = true;
            }
          }
        });
        return result;
      }

      // Checks if a variable has a value or a property that is not an empty string
      // Currently we need only to check for empty strings ("directly" or as object properties). This might change...
      function hasValue(check) {
        var result = false;
        if (angular.isObject(check)) {
          angular.forEach(check, function (value) {
            if (!result && hasValue(value)) {
              result = true;
            }
          });
        } else if (check) {
          result = true;
        }
        return result;
      }

    }])
;
