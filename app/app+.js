'use strict';

angular.module('app', ['app.config','app.controllers','userModule','dataModule','alertModule',
                       'ffFocusModule', 'ffAssertEqualModule', 'ffEnsureUniqueUsernameModule', 'ffIncludeModule',
                       'ngSanitize','ui.bootstrap', 'ui.utils','ngRoute']); // 'ngAnimate','ngStorage','ngCookies'

angular.module('app.config',['backendModule','userModule','ngRoute']);
angular.module('app.controllers',['userModule','alertModule']); // 'ffBlogPostModule'
