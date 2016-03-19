var app = angular.module('Blog', ['ui.router']);

app.directive('input', function(){
	return{
		restrict: "E",
		link: function(scope, elem, attrs) {
			elem.on("focus", function(event) {
				elem.parent().addClass('has-focus');
			});

			elem.on("blur", function(event){
				if(elem.val() !== ""){
					elem.parent().addClass('has-value');
				}else{
					elem.parent().removeClass('has-value');
				}
				elem.parent().removeClass('has-focus');
			});
		}
	};
});

app.run(["$rootScope", function(rootScope){
	rootScope.$on("$stateChangeStart", function(event, toState){
		// console.log(toState);
	});

	rootScope.$on("$stateChangeSuccess", function(){
		// console.log("state changed");
	});
}]);
