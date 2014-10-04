angular.module('ffIncludeModule', [])
  .directive('ffInclude', ['$http', '$templateCache', '$compile' ,
    function($http, $templateCache, $compile) {
      var ddo = {};
      ddo.link = function(scope, element, attrs) {
        var templatePath = attrs.ffInclude;
        scope.model = "membership";
        var model = attrs.model;
        scope.model = attrs.model; // For some strange reason this does not get reflected in the view
        //todo: Fix strange error that currently forces me to do the hack below
        // Strange hack start
//        if (true) { // set to false to skip strange hack
          if (model === "membership") {
            scope.model = "membership";
          } //else if (model === "boat") {
//            scope.model = "boat";
//          }
//        }
        // Strange hack end...
        $http.get(templatePath, {
          cache: $templateCache
        }).success(function(response) {
          var contents = element.html(response).contents();
          $compile(contents)(scope);
        });
      };
      return ddo;
  }]);