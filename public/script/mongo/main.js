/**
 * New node file
 */

//var mongoApp = angular.module('mongoApp', []);
myApp.controller('usersCtrl', ['$scope', '$http', function($scope, $http) {
	var result = $http.get('/mongo/getlist');
	result.error(function(err) {
		throw err;
	}); 
	result.success(function(data, status, headers, config) {
		$scope.users = data;
	});
	
}]);
