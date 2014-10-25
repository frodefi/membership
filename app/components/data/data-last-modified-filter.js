angular.module('dataModule')
  .filter('dataLastModified', function () {
    return function (models) {
      if (!models) return null;

      var filtered = null;
      angular.forEach(models, function (model) {
        if (!filtered || model.data.lastModified > filtered.model.data.lastModified) {
          filtered = model;
        }
      });

      return filtered;
    };
  });
