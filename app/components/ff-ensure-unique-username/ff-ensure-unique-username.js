angular.module('ffEnsureUniqueUsernameModule', ['userModule','alertModule'])
  .directive('ffEnsureUniqueUsername', ['userService','alertService',function(userService,alertService) {
    var directive  = {};
    directive.require = 'ngModel';
    directive.link = function(scope, element, attrs, ctrl) {
      var user     = userService;
      var alerts   = alertService;
/*
      ctrl.$parsers.unshift(function(viewValue) {
        username = viewValue;
        return viewValue;
      });
*/
      element.bind('blur', function(evt) {
        console.log("hei...");
        var username = scope['userForm']['username'];
        console.log("promise son...",username );
        if (username && username.length>0) {
          ctrl.$setValidity('promiseReturned', false);
          var promise = user.exists(username);
          promise.then(
            function (exists) {
              if (username == user.username) {
                exists = false; // The user already has this username
              }
              ctrl.$setValidity('unique', !exists);
              ctrl.$setValidity('promiseReturned', true);
            },
            function (error) {
              alerts.addServerError(error);
            }
          );
        }
      });
    };
    return directive;
  }]);