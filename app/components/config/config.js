'use strict';

angular.module('app.config')
  .constant('version', '0.0.1')

  .run(['backendService','userService','alertService','$location', function(backendService,userService,alertService,$location) {
    var promise = backendService.init({
      appKey    : 'kid_VPaWDKTIo9',
      appSecret : 'a488fdfba798401dbf996cba21b483f8'
    });
    console.log("app-config path",$location.path());
    promise.then(function(user){
      if (user) {
        userService.init(user);
//        alertService.add({type: "info", msg: "Connected to backend..."});
        console.log("config success, user: ", user);
      }/* else if (userService.registrationInProcess($location.search().emailConfirmed)) {
        console.log("registration in process: ");
      }*/
    }, function(error){
      alertService.add({type: "warning", msg: "Could not connected to backend..."});
      console.log("config error: ",error, userService);
    });
  }])

  .config(['$routeProvider','$routeSegmentProvider','$locationProvider',function($routeProvider,$routeSegmentProvider,$locationProvider) {
    $locationProvider.html5Mode(false); // set to false for now...

    $routeSegmentProvider.options.autoLoadTemplates = true;

    $routeSegmentProvider
      .when('/',                       'home')
      .when('/user',                   'user')
      .when('/user/create',            'create')
      .when('/user/login',             'login')
      .when('/user/details',           'details')
      .when('/user/details/profile',   'details.profile')
      .when('/user/details/account',   'details.account')

      .segment('home', {
        templateUrl:  'app.html',
        controller:   'AppCtrl',
        default:       true})
      .segment('user', {
        templateUrl: 'user/user.html',
        controller:   'UserCtrl'})
      .segment('login', {
        templateUrl: 'user/login/login.html',
        controller:   'LoginCtrl'})
      .segment('create', {
        templateUrl: 'user/create/create.html',
        controller:   'CreateCtrl'})
      .segment('details', {
        templateUrl: 'user/details/details.html',
        controller:   'DetailsCtrl'})
      .within()
        .segment('profile', {
          templateUrl: 'user/details/profile/profile.html'})
        .segment('account', {
          templateUrl: 'user/details/account/account.html',
          controller:   'AccountCtrl'});
//      .up();

    $routeProvider.otherwise({redirectTo: '/'});

/*
    $routeProvider
      .when('/', {
        templateUrl: 'app.html',
        controller: 'AppCtrl',
      })
      .when('/user/create', {
        templateUrl: 'user/create/create.html',
        controller: 'CreateCtrl'
      })
      .when('/user/login', {
        templateUrl: 'user/login/login.html',
        controller: 'LoginCtrl',
      })
      .otherwise({redirectTo: '/'});
*/
  }]);
