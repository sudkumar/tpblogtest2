(function(){
	angular.module('Blog')
	.service('Modal',['$rootScope','$q', function(rootScope, q){
		
		// create the current active modal
		var modal = {
			deffered: null,
			params: null
		};

		return {
			open: open,
			resolve: resolve,
			reject: reject,
			proceedTo: proceedTo,
			params: params,
			destroy: destroy
		};

		/*
		* @description: Open a new modal window
		*	@params
		* directiveName: name of the directive that holds the rendering view inside our modal window	
		* doPipe: if we want to open a new modal window i.e. do we want pipelining  
		*/
		function open(params, doPipe){
			// get the previous deferred promise if there is any
			var previousDeferred = modal.deferred;

			// create the new modal instance with new values
			modal.deferred = q.defer();
			modal.params = params;

			// if we have a previous deferred and we want a pipe, then pipe the previous deferred to new deferred
			if(previousDeferred){
				if(doPipe){
					// pipe the previous defer's callback to resolution or rejection of newly created modal
					modal.deferred.promise.then(previousDeferred.resolve, previousDeferred.reject);
				}else{
					// no pipelining required, reject the previous deferred if it exists
					previousDeferred.reject();
				}
			}

			// Now let the modal directive know about the this event 
			rootScope.$emit('modal.open', modal.params);

			return modal.deferred.promise;
		}

		/*
		@description: Close the current active modal window with a reponse of resolve
		@params
			response: response to the deferred object
		*/
		function resolve(response){
			if(! modal.deferred){
				return ;
			}
			// resolve the defer
			modal.deferred.resolve(response);

			// Tell the modal to close the current active window
			rootScope.$emit('modal.close', modal.params);

			// reset the current modal instance
			modal.deferred = modal.params = null;

		}

		/*
		@description: Close the current active modal window with a reason of rejection
		@params
			response: response to the deferred object
		*/
		function reject(reason){
			if(! modal.deferred){
				return ;
			}
			// resolve the defer
			modal.deferred.reject(reason);

			// Tell the modal to close the current active window
			rootScope.$emit('modal.close', modal.params);

			// reset the current modal instance
			modal.deferred = modal.params = null;
		}

		// Just a convenient method for pipelining 
		function proceedTo(params){
			return open(params, true);	
		}

		// Destroy a modal from DOM
		function destroy(id){
			rootScope.$emit("modal.destroy", id);
		}

		// Return the params associated with currently active modal window
		function params(){
			return (modal.params || {});
		}

	}]);
})();