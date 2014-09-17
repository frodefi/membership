angular.module('ffIncludeModule', [])
  .directive('ffInclude', ['$http', '$templateCache', '$compile' ,
    function($http, $templateCache, $compile) {
      var ddo = {};
      ddo.link = function(scope, element, attrs) {
        var templatePath = attrs.ffInclude;
        scope.model = attrs.model;
        if (templatePath.indexOf("timestamps") > -1) { console.log("attrs.model:",attrs.model," scope.model:",scope.model); }
        scope.model = "membership";
        $http.get(templatePath, {
          cache: $templateCache
        }).success(function(response) {
          var contents = element.html(response).contents();
          $compile(contents)(scope);
        });
      };
      return ddo;
  }]);