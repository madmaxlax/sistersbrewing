/// <reference path="C:\Apps\GitHub\sistersbrewing\js\beersdb.js" />
/// <reference path="C:\Apps\Dropbox\Dev\typings\angularjs\angular.d.ts" />

window.fbAsyncInit = function () {
  FB.init({
    appId: '1007778489291152',
    xfbml: true,
    version: 'v2.6'
  });

  ///only load angular when ready
  //angular.bootstrap(document, ['myapp']);
};

var brewery = false;

(function (d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);
  js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";//added https for local testing
  fjs.parentNode.insertBefore(js, fjs);
} (document, 'script', 'facebook-jssdk'));

(function () {
  var app = angular.module('SistersBrewApp', ['ngAnimate', 'ngRoute', 'ngResource']);
  angular.module('SistersBrewApp').filter('future', function () {
    return function (items) {
      var filtered = [];
      angular.forEach(items, function (event) {
        //console.log(event);
        if (event && (event.start_time || event.created_time)) {
          var timest = event.start_time || event.created_time;
          if (Date.parse(timest) > Date.now()) {
            filtered.push(event);
          }
        }
      });
      return filtered;
    };
  });
  angular.module('SistersBrewApp').filter('reverse', function () {
    return function (items) {
      return items.slice().reverse();
    };
  });
  //create a factory to do FB calls
  angular.module('SistersBrewApp').factory('facebookService', function ($q) {
    return {
      FBCall: function (querystring, options) {
        var deferred = $q.defer();
        if (typeof (FB) != 'undefined' && FB != null) {
          FB.api(querystring, options, function (response) {
            if (!response || response.error) {
              console.log(response);
              deferred.reject('Error occured');
            } else {
              deferred.resolve(response);
            }
          });
        } else {
          // alert the user
          console.log("FB not ready yet");
        }

        return deferred.promise;
      }
    };
  });

  angular.module('SistersBrewApp').config(function ($routeProvider) {
    $routeProvider
      // .when('/beers',{
      //     templateUrl: 'pages/beer.html',
      //     controller: 'NotesIndexController',
      //     controllerAs: 'indexController'
      // })
      .when('/beers/:selectedbeer', {
        templateUrl: 'pages/beer.html',
        controller: 'BeerController',
        controllerAs: 'BeerCtrlr'
      })
      .when('/about', {
        templateUrl: 'pages/about.html',
        controller: 'AboutController',
        controllerAs: 'AboutCtrlr'
      })
      .when('/contact', {
        templateUrl: 'pages/contact.html',
        controller: 'ContactController',
        controllerAs: 'ContactCtrlr'
      })
      .when('/', {
        templateUrl: 'pages/index.html',
        controller: 'IndexController',
        controllerAs: 'IndexCtrlr'
      })
      .otherwise({ redirectTo: '/' });
  });
  //////Main controller
  //set up main app controller
  angular.module('SistersBrewApp').controller('appController', function (facebookService, $scope, $window, $http) {

    //filter for events being older
    $scope.isFuture = function (event) {
      return function (item) {
        return item[Date.parse(event.start_time)] > Date.now();
      };
    };

    //make the beersDB available to the main scope
    $scope.beersDB = beersDB;

    $scope.events = false;
    $scope.posts = false;
    $scope.brewery = false;


    //get untapped info
    $http.defaults.cache = true;
    $http.get('https://api.untappd.com/v4/brewery/info/225097?client_id=43158D6116E0305CADB971CC65769720271E6D6A&client_secret=E1E244AD4D1699C1D3BE949A89EFE7B51E0BE0D5').
      then(function (data, status, headers, config) {
        console.log(data);
        brewery = data.data.response.brewery;
        $scope.brewery = data.data.response.brewery;
      }).catch(function (data, status, headers, config) {
        console.log("Error getting data ", data);
      });
    //try fb call
    //events
    $scope.getFBEvents = function () {
      facebookService.FBCall("/thesistersbrewery/events?access_token=1007778489291152|u2Rs03TsG_yGoAxzC8ZUdpgEOwA")
        .then(function (response) {
          console.log(response);
          $scope.events = response.data;
          //stop watching FB
          $scope.FBListener();
        });
      //$scope.FBListener();
    };

    //feed posts (only get 10?)
    $scope.getFBPosts = function () {
      facebookService.FBCall("/thesistersbrewery/posts?limit=10&access_token=1007778489291152|u2Rs03TsG_yGoAxzC8ZUdpgEOwA")
        .then(function (response) {
          console.log(response);
          $scope.posts = response.data;
          //stop watching FB
          $scope.FBListener();
        });
    };

    //setup watch for FB API to be ready
    $scope.FBListener = $scope.$watch(function () {
      return $window.FB;
    }, function (newVal, oldVal) {
      // FB API loaded, make calls
      console.log("FB is ready");
      //functions that do FB API calls
      $scope.getFBEvents();
      $scope.getFBPosts();
    });
  });
  
  angular.module('SistersBrewApp').controller('BeerController', function ($scope, $routeParams, $http) {
    $scope.routeSelectedBeer = $routeParams.selectedbeer;
  });

  angular.module('SistersBrewApp').controller('AboutController', function ($scope, $routeParams, $http) {
  });

  angular.module('SistersBrewApp').controller('ContactController', function ($scope, $routeParams, $http) {
  });

  angular.module('SistersBrewApp').controller('IndexController', function ($scope, $routeParams, $http) {
  });

  angular.module('SistersBrewApp').directive('sbFbEvent',function(){
    return{
      restrict: 'E',
      templateUrl: 'js/directives/event.html'
    };
  });
  angular.module('SistersBrewApp').directive('sbFbPost',function(){
    return{
      restrict: 'E',
      templateUrl: 'js/directives/post.html'
    };
  });
})();

//easing scrolling
//no easing /jquery UI needed
$(function () {
  $('a[href*=#]:not([href=#])').click(function () {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      var hashstring = this.hash.slice(1);
      target = target.length ? target : $('[name=' + hashstring + ']');
      if (target.length) {
        //change page title? 
        document.title = $(this).text() + " | Sisters Brewery";

        $('html,body').stop().animate({
          scrollTop: target.offset().top - 100
        }, 1000, function () {
          location.hash = hashstring; //attach the hash (#jumptarget) to the pageurl
        });
        return false;
      }
    }
  });
});
