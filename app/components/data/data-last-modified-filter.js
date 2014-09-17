angular.module('dataModule')
  .filter('dataLastModified', function () {
    return function (models) {
      if (!models) return null;

      var filtered = null;
      angular.forEach(models, function (model) {
        if (filtered) {console.log(model.lastModified,filtered.lastModified)}
        if (!filtered || model.lastModified > filtered.lastModified) {
          filtered = model;
        }
      });

      return filtered;
    };
  });
