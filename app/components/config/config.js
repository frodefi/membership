'use strict';

angular.module('app.config')
  .constant('version', '0.0.1')

  .run(['backendService', 'userService', 'alertService', '$location',
    function (backendService, userService, alertService, $location) {
      var promise = backendService.init({
        appKey: 'kid_VPaWDKTIo9',
        appSecret: 'a488fdfba798401dbf996cba21b483f8'
      });
      promise.then(function (user) {
        if (user) {
          userService.init(user);
        }
      }, function (error) {
        alertService.addServerError(error);
      });
    }])

  .config(['$routeProvider', '$routeSegmentProvider', '$locationProvider',
    function ($routeProvider, $routeSegmentProvider, $locationProvider) {
      $locationProvider.html5Mode(false); // set to false for now...

      $routeSegmentProvider.options.autoLoadTemplates = true;

      $routeSegmentProvider
        .when('/', 'frontpage')
        .when('/user', 'user')
        .when('/user/account', 'user.account')
        .when('/user/profile', 'user.profile')
        .when('/user/membership', 'user.membership')
        .when('/user/boat', 'user.boat')
        .when('/user/roles', 'user.roles')
        .when('/user/comment', 'user.comment')
        .when('/user/create', 'create')
        .when('/user/login', 'login')

        .segment('frontpage', {
          templateUrl: 'app.html',
          controller: 'AppCtrl'})
        .segment('user', {
          templateUrl: 'user/user.html',
          controller: 'UserCtrl'})
        .within()
          .segment('account', {
            templateUrl: 'user/account/account.html',
            controller: 'AccountCtrl'})
          .segment('profile', {
            templateUrl: 'user/profile/profile.html',
            controller: 'ProfileCtrl'})
          .segment('membership', {
            templateUrl: 'user/membership/membership.html',
            controller: 'MembershipCtrl'})
          .segment('boat', {
            templateUrl: 'user/boat/boat.html',
            controller: 'BoatCtrl'})
          .segment('roles', {
            templateUrl: 'user/roles/roles.html',
            controller: 'RolesCtrl'})
          .segment('comment', {
            templateUrl: 'user/comment/comment.html',
            controller: 'CommentCtrl'})
        .up()
        .segment('login', {
          templateUrl: 'user/login/login.html',
          controller: 'LoginCtrl'})
        .segment('create', {
          templateUrl: 'user/create/create.html',
          controller: 'CreateCtrl'});

      $routeProvider.otherwise({redirectTo: '/'});


    }]);
