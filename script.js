//Example of 'push' service.
//uses deffered which allows 'notify' updates to the controller in addition to data push.
//in this case, we use simple incrementing index to represent data, and setTimeout simulates
//asyncronous polling operation such as api call
//=========

var app = angular.module('app', ['ui.router', 'kendo.directives', 'ngMessages']);

app.controller("mainCtrl", function ($scope, dataPusher, $state, $location) {

  $scope.url = function () { return $location.url(); }

  console.log($state);

  $scope.myIndex = 0;

  var updateTemp = function (theNextEvent) {
    //promise resolution invokes 
    theNextEvent.then(
      function (results) {
        $scope.myIndex = results.temp;
        $scope.updateNotification = '';
        updateTemp(results.nextEvent);
      },
      function (error) {
        alert('an error has occured: ' + error);
        updateTemp(dataPusher.watch());
      },
      function (update) {
        $scope.updateNotification = 'updating...';
      });
  }
  updateTemp(dataPusher.watch());

  $state.go('root.home');

});

//root abstract ==============================
app.config(function ($stateProvider) {
  $stateProvider.state({
    name: 'root',
    templateUrl: 'root.html',
    controller: 'rootCtrl',
    abstract: true
  })
}).controller('rootCtrl', function ($scope, $location, $state) {
  console.log("In Root Controller");
  $scope.tab = function () {
    var tab = $state.current.name;
    var tabs = $state.current.name.split('.');
    return tabs[tabs.length - 1];
  }
  $scope.selectedTab = function (name) {
    return name === $scope.tab() ? 'selectedTab' : 'unselectedTab';
  }
});

//home =======================================
app.config(function ($stateProvider) {
  $stateProvider.state({
    name: 'root.home',
    url: '/home',
    templateUrl: 'home.html',
    controller: 'homeCtrl',
  })
})
  .controller('homeCtrl', function ($scope) {
    console.log('in home controller');
  });

//Grid =========================================
app.config(function ($stateProvider) {
  $stateProvider.state({
    name: 'root.grid',
    url: '/grid',
    templateUrl: 'grid.html',
    controller: 'gridCtrl',
  })
})
  .controller('gridCtrl', function ($scope, productApi) {
    console.log('in grid controller');

    $scope.products = new kendo.data.DataSource({
      transport: {
        read: function (e) {
          productApi.getProducts().then(function (response) {
            e.success(response.data);
          });
        }
      },
      pageSize: 3
    });
    $scope.products.read();
    $scope.clickMe = function (i) {
      $scope.productId = i;
      $scope.modal.center().open();
    };
  })

//TextArea =======================================
app.config(function ($stateProvider) {
  $stateProvider.state({
    name: 'root.textarea',
    url: '/textarea',
    templateUrl: 'textArea.html',
    controller: 'textAreaCtrl',
    resolve: {
      textList: function (textService) {
        return textService.getSelections();
      }
    }
  })
})
  .controller('textAreaCtrl', function ($scope, textService, textList) {
    console.log('in textArea controller', textList);
    $scope.texts = textList;
    $scope.vm = {};
    $scope.showPopup = function () {
      $scope.textModal.center().open();
    }
    $scope.select = function () {
      console.log($scope);
      $scope.theText = $scope.vm.selectedText ? textList[$scope.vm.selectedText].text : '';
      $scope.textModal.close();
    }
    $scope.close = function () {
      $scope.textModal.close();
    }
  });

//ngMessages =========================================
app.config(function ($stateProvider) {
  $stateProvider.state({
    name: 'root.ngmessages',
    url: '/ngmessages',
    templateUrl: 'ngMessages.html',
    controller: 'ngMessagesCtrl',
  })
})
  .controller('ngMessagesCtrl', function ($scope) {
    console.log('in ngMessages controller');
  });

