(function(){
	angular.module('js')
		.config(['$stateProvider', '$urlRouterProvider', connectRouter]);

		function connectRouter($stateProvider, $urlRouterProvider) {
			$stateProvider.state('root.connect', {
				url: '/connect',
				views: {
					'content@': {
						templateUrl: 'components/connect/connect.html',
						controller: 'connectController',
						controllerAs: 'connectVM'
					}
				}
			})
		}
})()