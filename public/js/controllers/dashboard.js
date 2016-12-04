var dashboardApp = angular.module('dashboardApp', [], function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

dashboardApp.controller('DashboardCtrl', ['$scope', '$http', 
  function($scope, $http) {
	  $http.get('/dashboard/allUsers').then(successCallback, errorCallback);

	  function successCallback(response) {
	  	$scope.users = response.data.users;
	  }

	  function errorCallback(response) {
	  	console.log(response);
	  }
}]);

dashboardApp.controller('LogoutCtrl', ['$window', '$scope', '$http', 
  function($window, $scope, $http) {  
  // Handle logout
  $scope.logout = function() {
    // Post data
    $http.get('/users/logout').then(successCallback, errorCallback);

    // Callback functions
    function successCallback(response) {
  		console.log(response.data.message);
    	$window.location.href = '/dashboard';
    }

    function errorCallback(response) {
      console.log(response);
    }
  }
}]);

// Activate carousel
$('.carousel').carousel({
    interval: 5000
})