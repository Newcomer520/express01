/**
 * New node file
 */
//angular.module('focusMe', function($timeout) {
(function(){
angular.module('customComponent', [])
.directive('focusMe', function($timeout) {
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
.directive('cEditflag', function($compile) {
	var templateContent;
	var editor, content;
	
	return {
		replace: false,
		restrict: 'AE',
		//transclude : true,
		//template: '',
		template1: function(tElement, tAttrs)
		{

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
					templateContent =
						'<div class="c-content">{{content}}</div>' +
						'<textarea class="c-editor c-textarea c-hidden" ng-model="content"></textarea>' +
						'<span class="c-td-edit-btn">Edit	</span>' +
						'<div style="clear:both"></div>';
					element.html(templateContent).show();
					$compile(element.contents())(scope);
					break;			
			}
			
			var content = element.children('.c-content')
			  , editor = element.children('.c-editor')
			  ,	btn = element.children('.c-td-edit-btn');
			
			if ((scope.editable && scope.editable == true)
			 && (scope.showicon == undefined || (scope.showicon && scope.showicon == true))) 
			{
				
				//element[0].childNodes[element[0].childNodes.length - 2].style.visibility = 'visible';
				//length - 1是 div clear both;
			}
			else {
				btn.addClass('c-hidden');
				//element[0].childNodes[element[0].childNodes.length - 2].className = 
					//element[0].childNodes[element[0].childNodes.length - 2].className + ' c-hidden';
				//element[0].childNodes[element[0].childNodes.length - 2].style.visibility = 'hidden';				
			}
			
			if (scope.editable == true) {
				editor.bind('change', function() {
					content.addClass('c-updated');
				});
				editor.bind('blur', function() {
					editor.addClass('c-hidden');
					content.removeClass('c-hidden');
					if (scope.showicon == true) {
						btn.removeClass('c-hidden');
					}
				});
				switch(scope.showicon) {
					case true:
						btn.bind('click', function() {
							content.addClass('c-hidden');
							editor.removeClass('c-hidden');
							btn.addClass('c-hidden');
							editor.focus();
							editor.select();
						});
						break;
					default:
						element.bind('click', function() {
							content.addClass('c-hidden');
							editor.removeClass('c-hidden');
							editor.focus();
							editor.select();
						});
						break;
				}
			}
        }
	};	
});



var myApp = angular.module('myApp', ['customComponent']);

myApp.controller('todoCtrl',['$scope', '$http', function($scope, $http) {
	//this.clientId = clientId;
	$scope.formData = {};
	$scope.newTodo = "";
	$scope.x = "xXx content";
	$scope.items = 
		[
		 	{
		 		content: 'I-Lun',
		 		confirmed: false,
		 		editable: true
		 	},
		 	{
		 		content: 'Andersen',
		 		confirmed: false,
		 		editable: true
		 	}
        ];
	if (true) {
		$http.get('api/todo')
		.success(function(jsonItems) {
			$scope.items = jsonItems 
		});
	}
	
	$scope.confirm = function()
	{
	};
	
	$scope.processForm = function()
	{
		
	}
	$scope.isNewTodoEmpty = function(newTodo)
	{
		return newTodo === "";
	}
	$scope.deleteItem = function(item)
	{
		if (confirm('是否確認要刪除' + item.content) == false)
			return false;
		
	}
	$scope.logout = function()
	{
		alert('ready to logout');
		return false;
		
	}
}]);
//})();
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
})()