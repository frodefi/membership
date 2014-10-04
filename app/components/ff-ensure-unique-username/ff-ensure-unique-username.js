angular.module('ffEnsureUniqueUsernameModule', ['userModule', 'alertModule'])
  .directive('ffEnsureUniqueUsername', ['userService', 'alertService', function (userService, alertService) {
    var directive = {};
    directive.require = 'ngModel';
    directive.link = function (scope, element, attrs, ctrl) {
      var user = userService;
      var alerts = alertService;
      element.bind('keyup', function (evt) {
        var username = scope.model.data.username;
        if (username && username.length > 0) {
          ctrl.$setValidity('promiseReturned', false);
          var promise = user.exists(username);
          promise.then(
            function (exists) {
              if (username == user.account.username) {
                exists = false; // The user already has this username
              }
              ctrl.$setValidity('unique', !exists);
              ctrl.$setValidity('promiseReturned', true);
            },
            function (error) {
              alerts.addServerError(error);
              ctrl.$setValidity('promiseReturned', true);
            }
          );
        }
      });
    };
    return directive;
  }]);