(function(){
	angular.module('Blog')
	.directive('bAuth', ['Auth', function(auth){
		return{
			restrict: 'E',
			templateUrl: function(elem, attr){
				return "./assets/html/templates/b-auth.html";
			},
			link: function(scope, elem, attrs){
				scope.login = function(){
					auth.login().then(
						function(reponse){
							// success call back
							data = response.data;
							if(!response.result){
								// get the errors

								// show these to user and let him try again


							}else{
								// login success
								scope.defered.resolve("Login Success.");
							}
						},

						function(response){
							// error callback
							scope.defered.reject("Unable to login. Please try after some time.");
						}
					);
				};

				scope.signup = function(userData){
					auth.signup(userData).then(
						function(reponse){
							// success callback
							data = response.data;
							if(!response.result){

							}else{
								// signup success
								scope.defered.resolve("Successfully registered.");
							}
						},
						function(response){
							// error callback
							scope.defered.reject("Unable to register now. Please try after some time.");
						}
					);
				};
			}
		};
	}]);
})();
