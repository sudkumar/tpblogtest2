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
