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
)
.directive('cTextarea', function() {
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
	var templateContent;
	var editor, content;
	return {
		replace: false,
		restrict: 'AE',
		//transclude : true,
		//template: templateContent,
		template: function(tElement, tAttrs)
		{
			switch (tAttrs.cEditflag) {
				case 'textarea':
					templateContent =
						//'<div style="float:left;" ng-transclude>{{item.name}}</div>' +
						'<div class="c-td-origin">{{content}}</div>' +
						'<textarea class="c-textarea c-hidden" ng-model="content"></textarea>' +
						//'<input style="float:left;" value="{{content}}" />' +
						'<span class="c-td-edit-btn">Edit	</span>' +
						'<div style="clear:both"></div>';
					tElement.replaceWith(templateContent);
					break;			
			}
		},
		scope: {
			editable: '=cEditable',
			showicon: '=cShowicon',
			content:  '=cContent',
			editflag: '@cEditflag' //@ means get string from the attribute
		},
		link : function(scope, element, attrs) {
			if (scope.content == undefined) {
				throw "neet to specify content";				
			}
			switch(scope.editflag) {
			case 'textarea':
				break;			
			}
			
			/*if ((scope.editable && scope.editable == true)
			 && (scope.showicon == undefined || (scope.showicon && scope.showicon == true))) 
			{
				
				//element[0].childNodes[element[0].childNodes.length - 2].style.visibility = 'visible';
				//length - 1是 div clear both;
			}
			else {
				element[0].childNodes[element[0].childNodes.length - 2].className = 
					element[0].childNodes[element[0].childNodes.length - 2].className + ' c-hidden';
				//element[0].childNodes[element[0].childNodes.length - 2].style.visibility = 'hidden';				
			}*/
			
			var editor = element[0]
			
            element.bind('click', function() {
            	if (scope.editable == undefined || scope.editable == false)
	        		return true;
            	switch(scope.editflag)
            	{
            		case 'textarea':
            			break;
            	}
            	alert(this);
            	
            });
        }
		
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