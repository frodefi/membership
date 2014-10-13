angular.module('commonModule', [])
  .factory('commonService', ['$timeout', '$location', '$window', 'dataService', 'userService',
    function ($timeout, $location, $window, dataService, userService) {
      var common = {};

      common.setScopeAndMore = function (scope) {
        scope.model = {};
        scope.model.showHelp = {};
        scope.model.data = dataService;
        scope.model.user = userService;
        scope.model.user.account.password = "";
        scope.model.user.account.confirmPassword = "";
        scope.model.user.pristine = scope.model.user.account;
        scope.model.data.pristine = scope.model.data.details;
        scope.model.unsavedChanges = false;
        scope.model.viewMode = true;
        scope.model.submitText = "Save changes";

        scope.model.cancel = function () {
          angular.copy(scope.model.pristine, scope.model.details);
          scope.model.setShowHelp();
        };

        scope.model.setShowHelp = function (field) {
          angular.forEach(scope.model.showHelp, function (value, key) {
            scope.model.showHelp[key] = false;
          });
          if (field) {
            scope.model.showHelp[field] = true;
          }
        };

        scope.model.updateAll = function () {
          dataService.updateAll();
          userService.update();
        };
      };

      common.cancelPreventAccidentalPathChange = function (scope) {
        // todo: Works for current cases by trigging the watches, but maybe change to something better later
        scope.model.user.details = scope.model.user.pristine;
        scope.model.data.details = scope.model.data.pristine;
      };

      common.preventAccidentalPathChange = function (scope) {
        var warning = "You have unsaved changes, are you sure you want to leave this page?";
        var removeListener = function () {
        };
        scope.$watch('model.data', function (newValue, oldValue) {
          if (!angular.equals(newValue, oldValue)) {
            if (angular.equals(newValue, scope.model.pristine)) {
              removeListener();
              $window.onbeforeunload = undefined;
              scope.model.unsavedChanges = false;
            } else if (!scope.model.unsavedChanges) {
              removeListener = scope.$on('$locationChangeStart', function (event, next, current) {
                if (!confirm(next+" "+warning)) {
                  event.preventDefault();
                }
              });
              $window.onbeforeunload = function () {
                return warning;
              };
              scope.model.unsavedChanges = true;
            }
          }
        }, true);
      };

      common.handleServerDataModelUpdate = function (scope) {
        scope.$watch(function () {
          return dataService.details;
        }, function (newValue, oldValue) {
          if (newValue && !angular.equals(newValue, oldValue)) {
            scope.model.data.details = newValue;
            scope.model.data.pristine = newValue;
          }
        }, true);
        $scope.$watch(function () {
          return scope.user.account;
        }, function (newValue, oldValue) {
          if (newValue && !angular.equals(newValue, oldValue)) {
            newValue.password = passwordNotUpdated;
            newValue.confirmPassword = passwordNotUpdated;
            scope.model.user.account = newValue;
            scope.model.user.pristine = newValue;
          }
        }, true);
      };

      return common;
    }
  ]);
