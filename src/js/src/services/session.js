/* Service to handle Session storage provided by HTML 5

*/
(function(){
	angular.module('Blog')
	.service('Session', function(){
		return{
			set: function(key, val){
				return undefined;
			},
			get: function(key){
				return undefined;
			},
			del: function(key){
				return undefined;
			}
		};
	});
})();