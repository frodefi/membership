angular.module('ffEnsureUniqueUsernameModule', ['userModule', 'alertModule'])
  .directive('ffEnsureUniqueUsername', ['userService', 'alertService',
    function (userService, alertService) {
      var directive = {};
      directive.require = 'ngModel';
      directive.link = function (scope, element, attrs, ctrl) {
        element.bind('keyup', function (evt) {
          var username = scope.model.user.details.username;
          if (username && username.length > 0) {
            ctrl.$setValidity('promiseReturned', false);
            var promise = userService.exists(username);
            promise.then(
              function (exists) {
                if (username == userService.details.username) {
                  exists = false; // The user already has this username
                }
                ctrl.$setValidity('unique', !exists);
                ctrl.$setValidity('promiseReturned', true);
              },
              function (error) {
                alertService.addServerError(error);
                ctrl.$setValidity('promiseReturned', true);
              }
            );
          }
        });
      };
      return directive;
    }]);