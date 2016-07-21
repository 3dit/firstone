//mocked api polling service.
//uses setTimeout to mock async api call

angular.module('app')
.service('dataPusher', function($q) {
  var index = 0;
  var temps = [70, 71, 72, 73, 75, 78, 80, 79, 75, 72];
  var nextInterval = 0;
  var initialized = false;

  var watch = function() {
    var deferred = $q.defer();

    setTimeout(function() {
      deferred.notify('');

      setTimeout(function() {
        nextInterval = Math.round(Math.random() * 5) + 5;
        index++;
        deferred.resolve({
          temp: temps[index % temps.length],
          nextEvent: watch()
        });
                        
      }, 1200);
    }, nextInterval * 1000);

    return deferred.promise;

  }
  return {
    watch: watch
  }
});