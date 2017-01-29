/// <reference path="C:\Apps\GitHub\sistersbrewing\js\beersdb.js" />
/// <reference path="C:\Apps\Dropbox\Dev\typings\angularjs\angular.d.ts" />

window.fbAsyncInit = function () {
  FB.init({
    appId: '1007778489291152',
    xfbml: true,
    version: 'v2.6'
  });

};

var brewery = false;

//setting up facebook API injection
(function (d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);
  js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js"; //added https for local testing
  fjs.parentNode.insertBefore(js, fjs);
} (document, 'script', 'facebook-jssdk'));

//angular app and directives
(function () {
  var app = angular.module('SistersBrewApp', ['ngAnimate', 'ngRoute', 'ngResource']);
  // var app = angular.module('SistersBrewApp', ['ngAnimate', 'ngRoute', 'ngResource', 'ngMap']);
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
      if (typeof (items) == 'undefined' || items == null || items.length < 1) {
        return items;
      }
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
      },
      textShorten: function (str, chars) {
        var useWordBoundary = true;
        var isTooLong = str.length > chars,
          s_ = isTooLong ? str.substr(0, chars - 1) : str;
        s_ = (useWordBoundary && isTooLong) ? s_.substr(0, s_.lastIndexOf(' ')) : s_;
        return isTooLong ? s_ + '&hellip;' : s_;
      }
    };
  });

  angular.module('SistersBrewApp').filter('orderObjectBy', function () {
    return function (items, field, reverse) {
      var filtered = [];
      angular.forEach(items, function (item) {
        filtered.push(item);
      });
      filtered.sort(function (a, b) {
        return (a[field] > b[field] ? 1 : -1);
      });
      if (reverse) filtered.reverse();
      return filtered;
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
      // .when('/about', {
      //   templateUrl: 'pages/about.html',
      //   controller: 'AboutController',
      //   controllerAs: 'AboutCtrlr'
      // })
      // .when('/contact', {
      //   templateUrl: 'pages/contact.html',
      //   controller: 'ContactController',
      //   controllerAs: 'ContactCtrlr'
      // })
      // .when('/wheretofindus', {
      //   templateUrl: 'pages/findus.html',
      //   controller: 'FindUsController',
      //   controllerAs: 'FindUsCtrlr'
      // })
      // .when('/wheretofindus/:selectedCity', {
      //   templateUrl: 'pages/findus.html',
      //   controller: 'FindUsController',
      //   controllerAs: 'FindUsCtrlr'
      // })
      .when('/', {
        //redirectTo: '/beers/drone'        
        // templateUrl: 'pages/index.html',
        // controller: 'IndexController',
        // controllerAs: 'IndexCtrlr'
        templateUrl: 'pages/beer.html',
        controller: 'BeerController',
        controllerAs: 'BeerCtrlr'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
  //////Main controller
  //set up main app controller
  angular.module('SistersBrewApp').controller('appController', function (facebookService, googleMapsService, $scope, $window, $http, futureFilter, $location) {

    //filter for events being older
    $scope.isFuture = function (event) {
      return function (item) {
        return item[Date.parse(event.start_time)] > Date.now();
      };
    };

    //make the beersDB available to the main scope
    $scope.beersDB = beersDB;

    $scope.linkTo = function (eID, $event) {
      //console.log(eID);
      //$location.url(id);
      // This scrolling function 
      // is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript
      var offset = 100;
      var startY = currentYPosition();
      var stopY = elmYPosition(eID) - offset;
      var distance = stopY > startY ? stopY - startY : startY - stopY;
      if (distance < 100) {
        scrollTo(0, stopY); return;
      }
      var speed = Math.round(distance / 100);
      if (speed >= 20) speed = 20;
      var step = Math.round(distance / 25);
      var leapY = stopY > startY ? startY + step : startY - step;
      var timer = 0;
      if (stopY > startY) {
        for (var i = startY; i < stopY; i += step) {
          setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
          leapY += step; if (leapY > stopY) leapY = stopY; timer++;
        } return;
      }
      for (var i = startY; i > stopY; i -= step) {
        setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
        leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
      }

      function currentYPosition() {
        // Firefox, Chrome, Opera, Safari
        if (self.pageYOffset) return self.pageYOffset;
        // Internet Explorer 6 - standards mode
        if (document.documentElement && document.documentElement.scrollTop)
          return document.documentElement.scrollTop;
        // Internet Explorer 6, 7 and 8
        if (document.body.scrollTop) return document.body.scrollTop;
        return 0;
      }

      function elmYPosition(eID) {
        var elm = document.getElementById(eID);
        var y = elm.offsetTop;
        var node = elm;
        while (node.offsetParent && node.offsetParent != document.body) {
          node = node.offsetParent;
          y += node.offsetTop;
        } return y;
      }
      $event.stopPropagation();
      $event.preventDefault();
    };

    $scope.posts = false;
    $scope.brewery = false;


    //get untapped info
    $http.defaults.cache = true;
    $http.get('https://api.untappd.com/v4/brewery/info/225097?client_id=43158D6116E0305CADB971CC65769720271E6D6A&client_secret=E1E244AD4D1699C1D3BE949A89EFE7B51E0BE0D5').
      then(function (data, status, headers, config) {
        //console.log(data);
        //brewery = data.data.response.brewery;
        $scope.brewery = data.data.response.brewery;
        //reformat array to access by beer ID
        $scope.brewery.beersById = data.data.response.brewery.beer_list.items.reduce(function (obj, item) {
          obj[item.beer.bid.toString()] = item.beer;
          return obj;
        }, {});
        //get at least the first check in data for first beer
        var beerID = '1372507'; //id for default beer, honeyblonde
        $http.get('https://api.untappd.com/v4/beer/checkins/' + beerID + '?client_id=43158D6116E0305CADB971CC65769720271E6D6A&client_secret=E1E244AD4D1699C1D3BE949A89EFE7B51E0BE0D5').
          then(function (data, status, headers, config) {
            //add checkin info 
            //console.log(data);
            $scope.brewery.beersById[beerID].checkinData = data.data.response.checkins;
          }).catch(function (data, status, headers, config) {
            console.log("Error getting check in data", data);
          });
        // angular.forEach($scope.brewery.beersById,function(beer, beerID){
        //   $http.get('https://api.untappd.com/v4/beer/checkins/' + beerID + '?client_id=43158D6116E0305CADB971CC65769720271E6D6A&client_secret=E1E244AD4D1699C1D3BE949A89EFE7B51E0BE0D5').
        //     then(function (data, status, headers, config) {
        //       //add checkin info 
        //       console.log(data);
        //       $scope.brewery.beersById[beerID].checkinData = data.data.response.checkins;
        //     }).catch(function (data, status, headers, config) {
        //       console.log("Error getting check in data", data);
        //     });
        // });
        // brewery.beersById = data.data.response.brewery.beer_list.items.reduce(function (obj, item) {
        //   obj[item.beer.bid.toString()] = item.beer;
        //   $http.get('https://api.untappd.com/v4/beer/checkins/' + item.beer.bid.toString() + '?client_id=43158D6116E0305CADB971CC65769720271E6D6A&client_secret=E1E244AD4D1699C1D3BE949A89EFE7B51E0BE0D5').
        //     then(function (data, status, headers, config) {
        //       //add checkin info 
        //       //console.log(data);
        //       obj[item.beer.bid.toString()].checkinData = data.data.response.checkins;
        //     }).catch(function (data, status, headers, config) {
        //       console.log("Error getting check in ", data);
        //     });
        //   return obj;
        // }, {});
        //console.log($scope.brewery.beersById);
      }).catch(function (data, status, headers, config) {
        console.log("Error getting untappd data ", data);
        if(data.data != null && data.data.meta != null && data.data.meta.error_detail != null)
        {
          console.warn("Untappd error: " + data.data.meta.error_detail);
        }
      });


    //events
    $scope.getFBEvents = function () {
      facebookService.FBCall("/thesistersbrewery/events?fields=cover,name,start_time,description,place&access_token=1007778489291152|u2Rs03TsG_yGoAxzC8ZUdpgEOwA")
        .then(function (response) {
          //console.log(response);
          //use the future filter only to show future events
          googleMapsService.events = futureFilter(response.data);
          googleMapsService.addEventsToMap();
          $scope.googleMapsService = googleMapsService;
          //stop watching FB
          $scope.FBListener();
        });
      $scope.FBListener();
    };

    //feed posts (only get 10?)
    $scope.getFBPosts = function () {
      facebookService.FBCall("/thesistersbrewery/posts?fields=picture,place,full_picture,message,story,created_time&limit=10&access_token=1007778489291152|u2Rs03TsG_yGoAxzC8ZUdpgEOwA")
        .then(function (response) {
          //console.log(response);

          $scope.posts = response.data;
          //stop watching FB
          $scope.FBListener();
        });
    };

    //setup watch for FB API to be ready
    $scope.FBListener = $scope.$watch(function () {
      return $window.FB;
    }, function (newVal, oldVal) {
      if (typeof (FB) != 'undefined' && FB != null) {
        // FB API loaded, make calls
        console.log("FB is ready");
        //functions that do FB API calls
        $scope.getFBEvents();
        $scope.getFBPosts();
        $scope.FBListener();
        //refresh scrollspy
        //console.log("refreshing scroll");
        $('[data-spy="scroll"]').each(function () {
          var $spy = $(this).scrollspy('refresh')
        });
      }
    });
  });

  angular.module('SistersBrewApp').controller('BeerController', function ($scope, $routeParams, $http) {
    var selectedbeer = $routeParams.selectedbeer;
    //console.log($routeParams);
    //if no beer selected, choose drone
    if ($routeParams.selectedbeer == null || $routeParams.selectedbeer === '') {
      //console.log('using default drone');
      selectedbeer = "honeyblonde";
    }
    //console.log(selectedbeer);
    $scope.routeSelectedBeer = selectedbeer;
    $scope.$parent.routeSelectedBeer = selectedbeer;

    //get checkin info if not already
    if ($scope.brewery.beersById != null && $scope.brewery.beersById[beersDB[selectedbeer].untappdId].checkinData == null) {
      var beerID = beersDB[routeSelectedBeer].untappdId;

      $http.get('https://api.untappd.com/v4/beer/checkins/' + beerID + '?client_id=43158D6116E0305CADB971CC65769720271E6D6A&client_secret=E1E244AD4D1699C1D3BE949A89EFE7B51E0BE0D5').
        then(function (data, status, headers, config) {
          //add checkin info 
          console.log(data);
          $scope.brewery.beersById[beerID].checkinData = data.data.response.checkins;
        }).catch(function (data, status, headers, config) {
          console.log("Error getting check in data", data);
        });
    }

  });

  angular.module('SistersBrewApp').controller('AboutController', function ($scope, $routeParams, $http) { });


  angular.module('SistersBrewApp').controller('FindUsController', function ($scope, $routeParams, $http) {
    $scope.routeSelectedCity = $routeParams.selectedCity;
  });

  angular.module('SistersBrewApp').controller('ContactController', function ($scope, $routeParams, $http) { });

  angular.module('SistersBrewApp').controller('IndexController', function ($scope, $routeParams, $http) { });

  angular.module('SistersBrewApp').directive('sbBeerHex', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'js/directives/beerhex.html'
    };
  });



  angular.module('SistersBrewApp').directive('sbFbEvent', function () {
    return {
      restrict: 'E',
      templateUrl: 'js/directives/event.html'
    };
  });
  angular.module('SistersBrewApp').directive('sbFbPost', function () {
    return {
      restrict: 'E',
      templateUrl: 'js/directives/post.html'
    };
  });
})();

//easing scrolling
//no easing /jquery UI needed
// $(function () {
//   $('a[href*=#]:not([href=#])').click(function () {
//     if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
//       var target = $(this.hash);
//       var hashstring = this.hash.slice(1);
//       target = target.length ? target : $('[name=' + hashstring + ']');
//       if (target.length) {
//         //change page title? 
//         document.title = $(this).text() + " | Sisters Brewery";

//         $('html,body').stop().animate({
//           scrollTop: target.offset().top - 100
//         }, 1000, function () {
//           location.hash = hashstring; //attach the hash (#jumptarget) to the pageurl
//         });
//         return false;
//       }
//     }
//   });
// });