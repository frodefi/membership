angular.module('commonModule', [])
  .factory('commonService', ['$timeout','$location','$window','dataService','userService',
    function ($timeout,$location,$window,dataService,userService) {
      var common = {};
      var data = dataService;
      var user = userService;

      common.setScopeAndMore = function (scope, modelName) {
        scope.model = {};
        var modelData = {};
        if (modelName === "account") {
          modelData = user.account;
          modelData.password = "";
          modelData.confirmPassword = "";
        } else {
          data.initCollection(modelName);
          modelData = data.collections[modelName][0];
          common.handleServerDataModelUpdate(scope, modelName);
        }
        scope.model.data = {};
        common.setModelData(scope,modelData);
        scope.model.submitText = "Save changes";
        scope.model.viewMode = true;
        scope.model.showHelp = {};
        setShowHelpsFalse();

        scope.model.setShowHelp = function (field) {
          setShowHelpsFalse();
          scope.model.showHelp[field] = true;
        };
        scope.model.cancel = function () {
          common.setModelData(scope,scope.model.pristine);
          setShowHelpsFalse();
        };
        scope.model.save = function () {
          console.log("mn:model.data");
          data.save(modelName, scope.model.data);
        };
        common.preventAccidentalPathChange(scope);

        function setShowHelpsFalse () {
          angular.forEach(scope.model.data, function(value, key){
            scope.model.showHelp[key] = false;
          });
        }
      };

      common.setModelData = function (scope, modelData) {
        angular.copy(modelData,scope.model.data);
        scope.model.pristine = modelData;
        if (modelData.hasOwnProperty("status")) {
          scope.model.statusOptions = data.statusOptions(modelData.status);
        }
        scope.model.unsavedChanges = false;
        scope.model.viewMode = true;
      };

      common.setStatus = function (model) {
        if (model && model.hasOwnProperty("status")) {
          return model.status;
        } else {
          return "New";
        }
      };

      common.cancelPreventAccidentalPathChange = function (scope) {
        // todo: Works for current cases by trigging the watch, but maybe change to something better later
        scope.model.data = scope.model.pristine;
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
                if (!confirm(warning)) {
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

      common.handleServerDataModelUpdate = function (scope, modelName) {
        scope.$watch(function () {
          return data.collections[modelName];
        }, function (newValue, oldValue) {
          if (newValue && !angular.equals(newValue, oldValue)) {
            common.setModelData(scope,newValue[0]);
          }
        }, true);
      };

      return common;
    }
  ]);
