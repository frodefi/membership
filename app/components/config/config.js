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

  .config(['$routeProvider', '$routeSegmentProvider', '$locationProvider', '$translateProvider',
    function ($routeProvider, $routeSegmentProvider, $locationProvider, $translateProvider) {
      $translateProvider
        .useStaticFilesLoader({
          prefix: 'locale-',
          suffix: '.json'
        })
        .preferredLanguage('en');

      $locationProvider.html5Mode(false); // set to false for now...

      $routeSegmentProvider.options.autoLoadTemplates = true;

      $routeSegmentProvider
        .when('/', 'frontpage')
        .when('/user/create', 'create')
        .when('/user/login', 'login')
        .when('/user/:username', 'user')
        .when('/user/:username/account', 'user.account')
        .when('/user/:username/profile', 'user.profile')
        .when('/user/:username/memberships', 'user.memberships')
        .when('/user/:username/notes', 'user.notes')
        .when('/user/:username/work-report', 'user.workReport')
        .when('/user/:username/details', 'user.details')
        .when('/user/:username/boat', 'user.boat')

        .segment('frontpage', {
          templateUrl: 'app.html',
          controller: 'AppCtrl'})
        .segment('user', {
          templateUrl: 'user/user.html',
          controller: 'UserCtrl',
          dependencies: ['username']})
        .within()
        .segment('account', {
          templateUrl: 'user/account/account.html'})
        .segment('profile', {
          templateUrl: 'user/profile/profile.html',
          'default': true})
        .segment('memberships', {
          templateUrl: 'user/memberships/memberships.html'})
        .segment('notes', {
          templateUrl: 'user/notes/notes.html'})
        .segment('work-report', {
          templateUrl: 'user/work-report/work-report.html'})
        .segment('details', {
          templateUrl: 'user/details/details.html'})
        .segment('boat', {
          templateUrl: 'user/boat/boat.html'})
        .up()
        .segment('login', {
          templateUrl: 'user/login/login.html',
          controller: 'LoginCtrl'})
        .segment('create', {
          templateUrl: 'user/create/create.html',
          controller: 'CreateCtrl'});

      $routeProvider.otherwise({redirectTo: '/'});


    }]);
