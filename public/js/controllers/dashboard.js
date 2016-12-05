var dashboardApp = angular.module('dashboardApp', [], function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

dashboardApp.controller('DashboardCtrl', ['$scope', '$http', 
  function($scope, $http) {

    // Get all users
    (function() {
      $http.get('/dashboard/allUsers').then(successCallback, errorCallback);

      function successCallback(response) {
        $scope.users = response.data.users;
        console.log(response.data.users[0].roomLink);
      }

      function errorCallback(response) {
        console.log(response);
      }
    })();
}]);

// Activate carousel
$('.carousel').carousel({
    interval: 5000
})