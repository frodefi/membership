'use strict';

angular.module('app.config')
  .constant('version', '0.0.1')

  .run(['backendService','userService','alertService','$location', function(backendService,userService,alertService,$location) {
    var promise = backendService.init({
      appKey    : 'kid_VPaWDKTIo9',
      appSecret : 'a488fdfba798401dbf996cba21b483f8'
    });
    promise.then(function(user){
      if (user) {
        userService.init(user);
      }
    }, function(error){
      alertService.addServerError(error);
    });
  }])

  .config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider) {
    $locationProvider.html5Mode(false); // set to false for now...

    $routeProvider
      .when('/', {
        templateUrl: 'app.html',
        controller: 'AppCtrl'
      }).when('/user', {
        templateUrl: 'user/user.html',
        controller: 'UserCtrl'
      }).when('/user/login', {
        templateUrl: 'user/login/login.html',
        controller: 'LoginCtrl'
      }).when('/user/create', {
        templateUrl: 'user/create/create.html',
        controller: 'CreateCtrl'
      }).otherwise({redirectTo: '/'});
  }]);
