/**
 * New node file
 */
/*
myApp.directive('autoFocus', function(){
	  return function(scope, element){
	    element[0].focus();
	  };
});*/

myApp.controller('todoCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.todo = {content: ''};
	$scope.create = function() {
		if (!$scope.todo.content || $scope.todo.content == '')
			return;
		data = {todo: {content: $scope.todo.content}};
		$http.post('api/todo', data)
		.error(function(err) {
			alert(err);
		})
		.success(function(res) {
			//chain again. ajax for the updated content
			$http.get('api/todo').success(function(res) {
				$scope.items = res;
			});
		});
	};
	//$scope.items = [1, 2, 3, 4, 5];
	//angular.element('#newTodo').trigger('focus');
}]);

myApp.directive('focusMe', function($timeout) {
	  return {
	    scope: { trigger: '@focusMe' },
	    link: function(scope, element) {
	      scope.$watch('trigger', function(value) {
	        if(value === "true") { 
	          // console.log('trigger',value);
	          $timeout(function() {
	            element[0].focus(); 
	          });
	        }
	      });
	    }
	  };
	}
);



