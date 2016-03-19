/* Modal directive

	Modal directive which acts as a interface for views that want to use modal
	and services.

*/

(function(){
	angular.module('Blog')
	.directive('bModal', ['$rootScope', 'Modal','$compile', function(rootScope, modal, compiler){
		return{
			restrict: 'E',
			scope: {},
			link: function(scope, elem, attrs){
				rootScope.$on("modal.open", function(event, params){
					var elementExists = document.getElementById(params.subview.id);
					if(elementExists){
						// element has been previously rendered, so active it
						angular.element(elementExists).addClass('active');
					}else{
						// create the element and append it
						html = "<"+ params.subview.name + " b-modal-subview ";
						html += "id = \""+ params.subview.id  + "\" ";
						html += params.subview.attrs + " ";
						html += "> </"+ params.subview.name + ">";
						// create the dom from string
						var template = angular.element(html);
						// get the link function
						var lnkFunction = compiler(template);
						// give a scope to this lnkFunction
						var modalSubview = lnkFunction(scope);
						// append this element to main modal root
						elem.append(modalSubview);
					}
				});

				// modal close handler
				scope.closeModal = function(){
					modal.reject();
				}

				rootScope.$on('modal.destroy', function(event, id){
					modalSubview = document.getElementById(id);
					angular.element(modalSubview).remove();
				});
			}
		};
	}])
	.directive('bModalSubview', ['$rootScope', 'Modal', function(rootScope, modal){
		return{
			restrict: 'A',
			compile: function(elem, attrs){
				elem.addClass("modal active");
				// listen to modal close event on root scope
				rootScope.$on("modal.close", function(event, params){
					if(attrs.id != params.subview.id){
						return ;
					}
					elem.removeClass("active");
				});

				// now return the link function
				return function(scope, elem, attrs){

					// close the modal if user clicks outside the modal
					elem.on("click", function(event){
						if(elem[0].childNodes[1] != event.target){
							return ;
						}
						// close the modal and fire the reject event on modal
						scope.closeModal();
					});
				};
			}
		};
	}]);
})();
