/**
 * New node file
 */
//angular.module('focusMe', function($timeout) {
angular.module('customComponent', []).directive('focusMe', function($timeout) {
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



var myApp = angular.module('myApp', ['customComponent']);

myApp.controller('todoCtrl',['$scope', function($scope) {
	
}]);

/*
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
);*/