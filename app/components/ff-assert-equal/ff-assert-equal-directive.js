angular.module('ffAssertEqualModule', [])
  .directive('ffAssertEqual', [function () {
    var directive = {};
    directive.require = 'ngModel';
    directive.link = function (scope, elem, attrs, ctrl) {
      var thisModelName  = attrs.ngModel;
      var otherModelName = attrs.ffAssertEqual;
      var thisModelNameParts = thisModelName.split("."); // To make it more general, let us also handle object-property cases
      var otherModelNameParts = otherModelName.split("."); // This will be needed when getting the value from scope
      console.log("Assssss: ",thisModelName,otherModelName,otherModelNameParts);

      // This watch marks 2 types of errors:
      // 1) equals: compares the entire value of the two fields (to be used when this field is out of focus)
      // 2) equalsSoFar: compares this value against the same number of characters of the beginning of the other value
      // The second one gives the user immediate feedback, while typing, when a character is wrong
      scope.$watch(thisModelName, function(newThisValue){
        var otherValue  = scope[otherModelName];
        if (otherModelNameParts.length == 2) {
          otherValue = scope[otherModelNameParts[0]][otherModelNameParts[1]];
        }
        var equalsSoFar = true;
        var equals      = true;
        if (newThisValue && newThisValue.length > 0) {
          equalsSoFar = newThisValue == otherValue.substring(0, newThisValue.length);
          equals = newThisValue == otherValue;
        }
        ctrl.$setValidity('equalsSoFar', equalsSoFar);
        ctrl.$setValidity('equals', equals);
      });

      scope.$watch(otherModelName, function(newOtherValue){
        var thisValue  = scope[thisModelName];
        if (thisModelNameParts.length == 2) {
          thisValue = scope[thisModelNameParts[0]][thisModelNameParts[1]];
        }
        console.log("YOoooooooOOOOOOOOOOOO",thisValue,newOtherValue);
        if (thisValue && thisValue.length > 0) {
          ctrl.$setValidity('equals', thisValue == newOtherValue);
        }
      });
    };
    return directive;
  }]);