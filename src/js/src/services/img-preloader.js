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
