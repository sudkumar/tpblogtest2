(function(){
	angular.module('Blog')
	.directive('bDropdown', function(){
		return{
			restrict: 'A',
			compile: function(elem, attrs){
				elem.on("click", function(e){
					e.stopPropagation();
					elem.toggleClass("open");
				});

				document.onclick = function(e){
					elem.removeClass("open");
				};

				return function(scope, elem, attrs){};
			}
		};
	});
})();
