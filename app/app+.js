'use strict';

angular.module('app', ['app.config',
                       'app.controllers',
                       'ngSanitize',
                       'view-segment',
                       'userModule',
                       'alertModule',
                       'ffFocusModule',
                       'ffAssertEqualModule',
                       'ffEnsureUniqueUsernameModule',
                       'ui.bootstrap',
                       'ui.utils']); //'ngRoute','ngCookies','ngAnimate','ngStorage'

angular.module('app.config',['backendModule','userModule','ngRoute','route-segment']);
angular.module('app.controllers',['userModule','alertModule']); // 'ffBlogPostModule'
