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
).directive('cTextarea', function() {
	var templateContent =
			'<div ng-transclude style="float:left;"></div>' +
			'<span class="td-edit-btn">Edit	</span>' +
			'<div style="clear:both"></div>';
	return {
		restrict: 'E',
		transclude : true,
		template: templateContent,
		scope: {
			editable: '=editable',
			showIcon: '=showIcon'
		},
		link : function(scope, element, attrs) {
			if ((scope.editable && scope.editable == true)
			 && (scope.showIcon && scope.showIcon == true)) 
			{
				
				element[0].childNodes[1].style.visibility = 'visible';
			}
			else {
				element[0].childNodes[1].style.visibility = 'hidden';				
			}
            element[0].onclick = function() {
            	if (!scope.editable || scope.editable == false)
	        		return true;
            	alert(this);
            	
            };
        }
	}
	
})
.directive('cEditflag', function() {
	var templateContent =
		'<td><div ng-transclude style="float:left;"></div>' +
		'<span class="td-edit-btn">Edit	</span>' +
		'<div style="clear:both"></div></td>';
	return {
		replace: true,
		restrict: 'E',
		transclude : true,
		template: templateContent
		
	};	
});



var myApp = angular.module('myApp', ['customComponent']);

myApp.controller('todoCtrl',['$scope', function($scope) {
	$scope.x = "xXx content";
	$scope.items = 
		[
		 	{
		 		name: 'I-Lun',
		 		editable: true
		 	},
		 	{
		 		name: 'Andersen',
		 		editable: false
		 	}
        ]
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