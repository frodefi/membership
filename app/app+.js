'use strict';

angular.module('app', ['app.config','app.controllers','userModule','dataModule','alertModule','backendModule',
                       'ffFocusModule','ffAssertEqualModule','ffEnsureUniqueUsernameModule','ffIncludeModule',
                       'ngSanitize','ui.bootstrap','ui.utils','ngRoute','view-segment','route-segment',
                       'ngAnimate']); // 'ngAnimate','ngStorage','ngCookies'

angular.module('app.controllers',['ngAnimate']);
angular.module('app.config',['ngAnimate','backendModule','userModule','ngRoute','route-segment','pascalprecht.translate']);
