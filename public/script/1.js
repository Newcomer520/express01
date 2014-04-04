/**
 * New node file
 */

$(document).ready(function() {
	//alert('ready from jquery');
	$('.navigation a').on('click', function() {
		//alert(this.href);
		//return false;		
	});
	
});


//angular setting
var myApp = angular.module('myApp', []);
myApp.controller('staticMenu', ['$scope', '$location','currentPage', function($scope, $location, currentPage) {
	$scope.currentPage = currentPage;
	$scope.menus = [
	     {name: 'index', text: 'Main', href: '/'},
	     {name: 'users', text: 'Angular Js', href: '/users'},
   	     {name: 'sunflower', text: '太陽花學運', href: '/sunflower'},
	    ];
}]);


