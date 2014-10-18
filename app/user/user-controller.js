angular.module('app.controllers')
  .controller('UserCtrl', ['$scope', '$window', 'userService', 'dataService','$routeSegment',
    function ($scope, $window, userService, dataService, $routeSegment) {
      var warning = "You have unsaved changes, are you sure you want to leave this page?";
      var passwordNotUpdated = "Passw0rdNotUpdated!";
      $scope.model = {};
      $scope.model.showHelp = {};
      $scope.model.data = dataService;
      $scope.model.user = userService;
      $scope.model.thisUserUsername = $routeSegment.$routeParams.id;
      $scope.model.data.details.thisUser = $scope.model.user.details.usersObject[thisUserUsername];
      $scope.model.user.details.password = passwordNotUpdated;
      $scope.model.user.details.confirmPassword = passwordNotUpdated;
      $scope.model.user.pristine = angular.copy($scope.model.user.details);
      $scope.model.data.pristine = angular.copy($scope.model.data.details.thisUser);
      $scope.model.options = {};
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
          $scope.test = [$scope.model.user.details, $scope.model.data.details.thisUser];
          // If the user edits the form and then undo this by deleting/changing back the entered data,
          // then Angular is still claiming that a form dirty and not in pristine condition.
          // We improve that by do a manually check and toggle $scope.model.unsavedChanges accordingly.
          // In addition we want to warn the user from leaving this site if there are unsaved form data.
          var removeListener = function () {
          };
          $scope.$watch(function () {
            return [$scope.model.user.details, $scope.model.data.details.thisUser];
          }, function (newValue, oldValue) {
            if (!angular.equals(newValue, oldValue)) {
              if (!changed(newValue[0], $scope.model.user.pristine) && !changed(newValue[1], $scope.model.data.pristine)) {
                removeListener();
                $window.onbeforeunload = undefined;
                $scope.model.unsavedChanges = false;
              } else if (!$scope.model.unsavedChanges) {
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
        var userDetails = $scope.model.user.details.thisUser;
        delete userDetails.confirmPassword;
        if (userDetails.password === passwordNotUpdated) {
          delete userDetails.password;
        }
        // Todo: For any changes of any account-fields (userService): Add current password verification
        userService.save(userDetails);
        dataService.save();
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

      $scope.$watch('model.data.details.thisUser.memberTypes.standard', function () {
        $scope.model.options.standard = setOptions('standard');
      });

      $scope.$watch('model.data.details.thisUser.memberTypes.renter', function () {
        $scope.model.options.renter = setOptions('renter');
      });

      $scope.$watch('model.data.details.thisUser.memberTypes.helper', function () {
        $scope.model.options.helper = setOptions('helper');
      });

      $scope.$watch('model.data.details.thisUser.memberTypes.house', function () {
        $scope.model.options.house = setOptions('house');
      });

      function setOptions(memberType) {
        var status = dataService.details.thisUser.public.memberTypes[memberType];
        if (status === "pending") {
          return [
            {
              'name': 'pending',
              'text': 'Waiting for approval'
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
              'name': 'Pending',
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
