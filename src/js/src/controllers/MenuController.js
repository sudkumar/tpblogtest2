
(function(){
	var app = angular.module('Blog')
	.controller('MenuController', ['$scope','Modal','Auth', function(scope, modal, auth){

		var vm = this;
		// scope.loggedIn = false;
		var newModalParams = {
			subview : {
				name : "b-auth",
				id : "authModal",
				attrs: ""
			}
		};

		vm.loginSignup = loginSignup;
		vm.logout = logout;
		vm.showMenu = false;

		function loginSignup(){
			var authModal = modal.open(newModalParams);
			authModal.then(function(response){
				// console.log('login success');
			},
			function(reason){
				// console.log('login failure');
			});
		}

		function logout(){
			var authLogout = auth.logout();
			authLogout.then(function(response){
				// console.log("logout success.");
			},
			function(reason){
				// console.log('logout failure');
			});
		}

	}]);
})();
