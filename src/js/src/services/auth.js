/* Service to handle authentication job

*/

(function(){
	angular.module('Blog')
	.service('Auth', ['$http','$rootScope', function(http, rootScope){
		
		// define the current user
		var user = {
			loggedIn : false,
			data: undefined
		};

		return {
			login: login,
			logout: logout,
			isLoggedIn: isLoggedIn,
			signup: signup,
			forgotPassword: forgotPassword,
			changePassword: changePassword
		};

		function login(userData){
			
		}


		function logout(){
				return $http.get('api/auth/logout');
		}

		function isLoggedIn(){
				return false;
		}

		function signup(newUser){
		}

		function forgotPassword(emailId){
		}

		function changePassword(oldPass, newPass){
		}
	}]);
})();