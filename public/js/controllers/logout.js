var logoutApp = angular.module('logoutApp', []);

logoutApp.controller('LogoutCtrl', ['$window', '$scope', '$http', 
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