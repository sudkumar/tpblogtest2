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

(function(){
  angular.module("Blog")
  .config(["$stateProvider", "$urlRouterProvider", "$locationProvider",
    function(stateProvider,urlRouterProvider,locationProvider){
      // locationProvider.html5Mode({enabled: true, requireBase: false});
      urlRouterProvider.otherwise('/');

      stateProvider
        .state("home", {
          url: "/",
          views: {
            "main":{
              templateUrl: "./assets/html/templates/home.html"
            }
          }
        })
        .state("author", {
          url: "/author",
          views: {
            "main": {
              templateUrl: "./assets/html/templates/author.html"
            }
          }
        })
        .state("blog", {
          url: "/blog",
          views: {
            "main": {
              templateUrl: "./assets/html/templates/blog.html"
            }
          }
        });
    }
  ]);
})(angular);


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

(function(ng){

  // Enable the passage of the 'this' object through the JavaScript timers

  var __nativeST__ = window.setTimeout, __nativeSI__ = window.setInterval;

  window.setTimeout = function (vCallback, nDelay) {
    var oThis = this, aArgs = Array.prototype.slice.call(arguments, 2);
    return __nativeST__(vCallback instanceof Function ? function () {
      vCallback.apply(oThis, aArgs);
    } : vCallback, nDelay);
  };

  window.setInterval = function (vCallback, nDelay) {
    var oThis = this, aArgs = Array.prototype.slice.call(arguments, 2);
    return __nativeSI__(vCallback instanceof Function ? function () {
      vCallback.apply(oThis, aArgs);
    } : vCallback, nDelay);
  };


  function addClass(e, cN){
    var classes = cN.split(" ");
    for (var i = 0; i < classes.length; i++) {
      e.classList.add(classes[i]);
    }
  }

  // remove a class or classes (seperated by spaces) from an element
  function removeClass(e, cN){
    var classes = cN.split(" ");
    for (var i = 0; i < classes.length; i++) {
      e.classList.remove(classes[i]);
    }
  }



  /*
  * Manage a Slide
  */
  // -- Static properties and methods
  Slide.states = {
    INACTIVE: 0,
    PREV: 1,
    NEXT: 2,
    ACTIVE: 3,
  };

  Slide.classes = {
    active: "slider__item--active",
    activeToLeft : "slider__item--active-to-left",
    activeToRight : "slider__item--active-to-right",
    prev: "slider__item--prev",
    prevToRight: "slider__item--prev-to-right",
    next:"slider__item--next",
    nextToLeft:"slider__item--next-to-left"
  };


  // the constructor method
  function Slide(dom){

    // attach the DOM element to the slide
    this.dom = dom;

    // make me the inactive slide
    this.state = Slide.states.INACTIVE;
  };


  // -- Instance properties and methods
  Slide.prototype = {

    // add the constructor
    constructor : Slide,

    // make me the prev slide
    makePrev: function(){
      this.state = Slide.states.PREV;
      addClass(this.dom, Slide.classes.prev);
    },

    // make me the next slide
    makeNext: function(){
      this.state = Slide.states.NEXT;
      addClass(this.dom, Slide.classes.next);
    },

    // make me the next slide
    makeActive: function(){
      this.state = Slide.states.ACTIVE;
      addClass(this.dom, Slide.classes.active);
    },

    // make me the inactive
    makeInactive: function(){
      this.state = Slide.states.INACTIVE;
      removeClass(this.dom,
        Slide.classes.active + " " +
        Slide.classes.activeToLeft + " " +
        Slide.classes.activeToRight + " " +
        Slide.classes.prev + " " +
        Slide.classes.prevToRight + " " +
        Slide.classes.next + " " +
        Slide.classes.nextToLeft
        );
    },

    // slide to right method
    slideRight: function(){
      // check the current state of mine
      switch (this.state) {
        case Slide.states.ACTIVE:
          addClass(this.dom, Slide.classes.activeToRight);
          break;
        case Slide.states.PREV:
          addClass(this.dom, Slide.classes.prevToRight);
          break;
        default:
          console.log("Can't add slide right to sate: "+ this.state);
          break;
      }
    },
    // slide to right method
    slideLeft: function(){
      // check the current state of mine
      switch (this.state) {
        case Slide.states.ACTIVE:
          addClass(this.dom, Slide.classes.activeToLeft);
          break;
        case Slide.states.NEXT:
          addClass(this.dom, Slide.classes.nextToLeft);
          break;
        default:
          console.log("Can't add slide left to sate: "+ this.state);
          break;
      }
    }
  };

  /*
  * Manage the indicators
  */

  // The constructor method
  function SliderIndicator(_dom, _slider, _slideTo){

    // attach the dom element
    this.dom = _dom;

    // add the parent slider and my index
    this.slider = _slider;
    this.slideTo = _slideTo;
  }

  // -- Static properties and methods
  SliderIndicator.classes = {
    init: "indicator indicator--circle",
    active: "indicator--active"
  };

  SliderIndicator.create = function(_slider, _slideTo){
    // now append the indicator to the container
    var sliderIndicatorDom = document.createElement("button");
    addClass(sliderIndicatorDom, "indicator indicator--circle");

    // create the slider indicator object and attach it to dom
    sliderIndicator = new SliderIndicator(sliderIndicatorDom, _slider, _slideTo);

    // add the onclick event listener to dom pass the event handler
    sliderIndicatorDom.addEventListener("click", sliderIndicator, false);

    return sliderIndicator;
  };

  // -- Instance properties and methods
  SliderIndicator.prototype = {

    // the constructor function
    constructor : SliderIndicator,

    // make me the active indicator
    makeActive: function(){
      addClass(this.dom, SliderIndicator.classes.active);
    },

    // make me the inactive indicator
    makeInactive: function(){
      removeClass(this.dom, SliderIndicator.classes.active);
    },

    // handle events on button, clicks
    handleEvent: function(e){
      switch(e.type){
        case "click":
          this.slider.goToSlide(this.slider.activeSlide, this.slideTo);
          break;
        default:
          console.log('Unhandled event: '+ e.type);
          break;
      }
    }
  };

  /*
  * Manage the slider controller
  */

  // -- contructor function
  function SliderController(_dom, _slider, _type){
    this.dom = _dom;
    this.slider = _slider;
    this.type = _type;
    // add the click event listener to dom
    _dom.addEventListener("click", this);
  }

  // -- Static properties and methods
  SliderController.types = {
    LEFT: 1,
    RIGHT: 2
  };

  // -- Instance methods
  SliderController.prototype = {

    // add the constructor
    constructor: SliderController,

    // handle the click event
    handleEvent: function(event){
      switch(event.type){
        case "click":
          if(this.type == SliderController.types.LEFT){
            // get the previous slide
            this.slider.prev();
          }else if(this.type == SliderController.types.RIGHT){
            // get the next slide
            this.slider.next();
          }else{
            console.log('Unkown type of slider controller: '+ this.type);
          }
          break;
        default:
          console.log('Unhandles event: '+ event.type);
          break;
      }
    }
  };


  /*
  * Manage the slider
  */
  // constructor for the slider
  function Slider(dom){
    this.dom = dom;
    this.slides = [];
    this.indicators = [];
    this.controllers = [];
    this.activeSlide = 0;
    this.totalSlides = 0;
    this.slideDuration = 1000;
    this.slideInterval = 5000;
    this.timer = undefined;
    this.state = Slider.states.STOP;
    this.lastState = Slider.states.STOP;
  }


  // -- Static properties and methods

  // state of the slider
  Slider.states = {
    STOP: 1,
    PAUSE: 2,
    PLAY: 3,
    SLIDING: 4
  },

  // method to create a slider
  Slider.create = function(dom){

    // create a slider associated with this dom
    var slider = new Slider(dom);

    // add the hover events to slider
    dom.addEventListener("mouseenter", slider);
    dom.addEventListener("mouseleave", slider);


    return slider;
  }
  // -- Instance properties and methods
  Slider.prototype = {
    // add the constructor
    constructor : Slider,

    // add slides to our slider
    addSlides: function(){
      // get the slides from the dom
      var slides = this.dom.getElementsByClassName("slider__container")[0].children;


      // add the slides to the slider
      var slide;
      for (var i = 0; i < slides.length; i++) {
        slide = new Slide(slides[i]);
        this.slides.push(slide);
      }

      // make the first slide active
      this.slides[0].state = Slide.states.ACTIVE;

      this.totalSlides = this.slides.length;
    },

    // add controllers left and right
    addControllers: function(){
      var sliderControllers, sControllerType, sliderController;
      sliderControllers = this.dom.querySelectorAll("[s-ctrl-type]");
      for (var i = 0; i < sliderControllers.length; i++) {
        sCtrlType = sliderControllers[i].getAttribute("s-ctrl-type");
        // get the type of the controller and add it
        if(sCtrlType == "left"){
          sliderController = new SliderController(sliderControllers[i], this, SliderController.types.LEFT);
          this.controllers.push(sliderController);
        }else if(sCtrlType == "right"){
          sliderController = new SliderController(sliderControllers[i], this, SliderController.types.RIGHT);
          this.controllers.push(sliderController);
        }
      };
    },

    // add slider indicator
    addIndicators: function(){
      var sliderIndicatorContainer = document.createElement("div");
      addClass(sliderIndicatorContainer, "slider__indicator");
      // add the slider indicator to the container dom
      var sliderIndicator;
      for (var i = 0; i < this.slides.length; i++) {
        // create a new slider indicator, passing the slider and its index
        sliderIndicator = SliderIndicator.create(this, i);

        // add this to slider indicator
        this.indicators.push(sliderIndicator);

        // append the dom to slider container
        sliderIndicatorContainer.appendChild(sliderIndicator.dom);
      }
      // make the first indicator active
      this.indicators[0].makeActive();

      // apppend the slider indicator container to slider
      this.dom.appendChild(sliderIndicatorContainer);
    },

    // pause the slide show
    pause: function(){
      if(this.state == Slider.states.PLAY || this.state == Slider.states.SLIDING){
        this.state = Slider.states.PAUSE;
        clearInterval(this.timer);
      }
    },

    // resume the slide show
    resume: function(){
      if(this.state == Slider.states.PAUSE){
        this.play();
      }
    },

    // play the slide show
    play: function(){
      this.state = Slider.states.PLAY;
      this.timer = setInterval.call(this, this.next, this.slideInterval);
    },

    // stop the slide show
    stop: function(){
      if (this.state == Slider.states.SLIDING) {
        this.lastState = Slider.states.STOP;
      }
      this.state = Slider.states.STOP;
      clearInterval(this.timer);
    },

    // reset the slide and indicator, make _from to inactive and _to to active
    reset: function(_from, _to){
      // check if indicators are been added or not
      if(this.indicators.length != 0){
        this.indicators[_to].makeActive();
      }
      this.slides[_from].makeInactive();
      this.slides[_to].makeInactive();
      this.slides[_to].makeActive();
      this.activeSlide = _to;
      this.state = this.lastState;
    },

    // go to ith slide
    goToSlide: function(_from, _to){
      if(this.state == Slider.states.SLIDING) return;
      this.lastState = this.state;
      this.state = Slider.states.SLIDING;
      if(_to > _from){
        // animate from right to left side
        this.slides[_to].makeNext();
        // check if indicators are been added or not
        if(this.indicators.length != 0){
          this.indicators[_from].makeInactive();
        }

        // call the setTimeout timer with the current context (this)
        setTimeout.call(this, function(){
          this.slides[_from].slideLeft();
          this.slides[_to].slideLeft();

          //after slide been done, reset
          setTimeout.call(this, this.reset, this.slideDuration, _from, _to);
        }, 10);

      }else if (_to < _from) {
        // animate to left side
        this.slides[_to].makePrev();
        // check if indicators are been added or not
        if(this.indicators.length != 0){
          this.indicators[_from].makeInactive();
        }
        setTimeout.call(this, function(){
          this.slides[_from].slideRight();
          this.slides[_to].slideRight();

          //after slide been done, reset
          setTimeout.call(this, this.reset, this.slideDuration, _from, _to);
        }, 10);
      }
    },

    // go to next slide
    next : function(){
      var next = (this.activeSlide + 1) % this.totalSlides;
      this.goToSlide(this.activeSlide, next);
    },

    // go to prev slide
    prev : function(){
      var prevIndex = (this.activeSlide - 1) % this.totalSlides;
      prevIndex = prevIndex < 0 ? this.totalSlides-1: prevIndex;
      this.goToSlide(this.activeSlide, prevIndex);
    },

    // handle events
    handleEvent: function(event){
      switch(event.type){
        case "mouseenter":
          // pause the slide show over mouse enter if it's playing
          this.pause();
          break;
        case "mouseleave":
          // start the slide show if it is stopped
          this.resume();
          break;
        default:
          console.log('Unhandled event: +', event.type);
          break;
      }
    }
  };

  ng.module("Blog")
  .directive("bSlider", function(){
    return{
      restrict: "A",
      scope: {},
      compile: function(elem, attrs){

        // create the slider dom
        slider = Slider.create(elem[0]);

        // console.log(elem[0].getElementsByClassName("slider__container"));

        // get the attribute values for customization
        var sAddIndicator = attrs["s-add-indicator"];
        var sSlideInterval = attrs["s-slide-interval"];
        var sSlideDuration = attrs["s-slide-duration"];


        // add the slides
        slider.addSlides();

        // add the indicator if set
        if(sAddIndicator != "false"){
          slider.addIndicators();
        }

        // add the slider controller to slider
        slider.addControllers();

        // if slide interval time is set
        if(sSlideInterval){
          slider.slideInterval = parseInt(sSlideInterval);
        }

        // if slide duration time is set
        if(sSlideDuration){
          slider.slideDuration = parseInt(sSlideDuration);
        }

        // slider.play();

        // now return the link function
        return function(scope, elem, attrs){

        }
      }
    }
  });
})(angular);

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

(function(){
  angular.module('Blog')
  .factory('ImgPreloader', ['$q', '$rootScope', function(q, rootScope){

    // manage the preloader state
    function Preloader(imgSrcs){
        // add the image sourses to current instance
        this.imgScrs  = imgScrs;

        // maintain the states of process
        this.states = {
          PENDING: 1,
          LOADING: 2,
          FAILED: 3,
          LOADED: 4,
        };
        this.state = this.states.PENDING;

        // keep track of loaded and errored images
        this.loadCount = 0;
        this.errorCount = 0;
        this.imgCount = imgScrs.length;

        // make a defer and promise to return to callie
        this.deferred = $q.defer();
        this.promise = this.deferred.promise;
    }

    // -- Static mathods

    // define static method to load the images from sources, return a promise to resolve later
    Preloader.preloadImages = function(imgSrcs){
      var preloader = new Preloader(imgSrcs);
      return preloader.load();
    };

    // -- Instance methods

    // define a prototype to return
    Preloader.prototype = {

      // add the constructor for instanceof operators
      constructor : Preloader,

      // return whether the loading process has been started or not
      isIntiated: function isIntiated(){
        return this.state !== this.states.PENDING;
      },

      // check if loading is failed or not
      isFailed: function isFailed(){
        return this.state == this.states.FAILED;
      },

      // return whether all images are been loaded or not
      isLoaded: function isLoaded(){
        return this.state == this.states.LOADED;
      },

      // initiate the loading of images
      load : function(){
        // if promise has already been initiated, return that
        if(this.isIntiated()){
          return this.promise;
        }

        // update the state to loading
        this.state = this.states.LOADING;

        // now load each image
        for(var i = 0; i < this.imgCount; i++){
          this.loadImg(this.imgSrcs[i]);
        }

        // return the promise
        return this.promise;
      },

      // handle a success img load
      successLoad: function successLoad(imgSrc){
        this.loadCount++;

        // check if process has been failed
        if ( this.isFailed() ) {
          return ;
        }

        // notify the update to listener
        this.deferred.notify({
          percent: Math.cell( this.loadCount / this.imgCount * 100),
          imgSrc : imgSrc
        });

        // check if all images are been loaded or not
        // if it is, then resolve the promise
        if (this.loadCount == this.imgCount) {
          this.state = this.states.LOADED;
          this.deferred.resolve( this.imgSrcs );
        }

      },

      // handle a error img load
      errorLoad: function errorLoad(imgSrc){
        this.errorCount++;

        // check if someone has already rejected
        if( this.isFailed() ){
          return ;
        }

        // change state to FAILED and reject the promise
        this.state = this.states.FAILED;
        this.deferred.reject( imgSrc );
      },

      // load a img from a source
      loadImg: function loadImg(imgSrc){

        // create an image image object and biund events and then biund src to it.
        // biunding events first it critical for some browsers to fire the load events
        var preloader = this;

        var img = $( new Image())
        .load( function(event){
          // event of loading an image is async, so call the rootScope.$apply
          rootScope.$apply( function(){
            preloader.successLoad(event.target.src);
            // reset
            preloader = img = event = null;
          });
        })
        .error( function(event){
          // event of loading an image is async, so call the rootScope.$apply
          rootScope.$apply( function(){
            preloader.errorLoad(event.target.src);
            // reset
            preloader = img = event = null;
          });
        })
        .prop("src", imgSrc);
      }
    };

    // return the factory instance
    return Preloader ;
  }]);
})();

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