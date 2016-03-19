(function(){
	angular.module('Blog')
	.directive('bMoveTop',[ function(){
		return{
			restrict: 'E',
			scope: {},
			template: '<span> Top </span>',
			compile: function(elem, attrs){

				elem.css({
					visibility: 'hidden', display: 'block', opacity: '0', transition: 'all linear .25s',
					position: "fixed", bottom: '20px', right: '20px', zIndex: '500',
					width: '40px', height: '40px', textAlign: 'center', lineHeight: '40px',
					fontSize: '14px', fontWeight: 'bold',
					background: 'white', borderRadius: '50%', boxShadow: '0 2px 10px 2px rgba(0,0,0,.3)', cursor: 'pointer',
					transform: 'translateY(10px)'
				});

				var showStyle = {visibility: 'visible', opacity: 1, transform: 'translateY(0)'};
				var hideStyle = {visibility: 'hidden', opacity: 0, transform: 'translateY(10px)'};
				var lastScroll = 0;
				var hideAfter;
				window.addEventListener("scroll", function(e){
					// console.log('scrolled');
					var cScroll = window.scrollY;
					var pageY = window.pageYOffset;

					if(cScroll < lastScroll && pageY > window.outerHeight){
						if(hideAfter)
							clearInterval(hideAfter);
						elem.css(showStyle);
						hideAfter = setTimeout(function(){elem.css(hideStyle);}, 3000);
					}else{
						elem.css(hideStyle);
					}
					lastScroll = cScroll;
				});

				elem.on('click', function(){
					window.scroll(0,0);
				});
				return  function(scope, elem, attrs){	};
			}
		};
	}]);
})();
