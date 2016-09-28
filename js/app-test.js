window.fbAsyncInit = function() {
  FB.init({
    appId: '1007778489291152',
    xfbml: true,
    version: 'v2.6'
  });

  ///only load angular when ready
  angular.bootstrap(document, ['myapp']);
};

var brewery = false;

(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);
  js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";//added https for local testing
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

(function() {
  var app = angular.module('myapp', ['ngAnimate']);
  app.filter('future', function() {
    return function(items) {
      var filtered = [];
      angular.forEach(items, function(event) {
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
  app.filter('reverse', function() {
    return function(items) {
      return items.slice().reverse();
    };
  });
  //create a factory to do FB calls
  app.factory('facebookService', function($q) {
    return {
      FBCall: function(querystring, options) {
        var deferred = $q.defer();
        FB.api(querystring, options, function(response) {
          if (!response || response.error) {
            console.log(response);
            deferred.reject('Error occured');
          } else {
            deferred.resolve(response);
          }
        });
        return deferred.promise;
      }
    }
  });

  //set up controller
  app.controller('appController', function(facebookService, $scope, $window, $http) {
    //     $window.fbAsyncInit = function() {

    //       //initialize FB
    //       FB.init({
    //         appId: '1007778489291152',
    //         status: true,
    //         cookie: true,
    //         xfbml: true,
    //         version: 'v2.6'
    //       });
    //     };
    //     //

    //     (function(d) {
    //       // load the Facebook javascript SDK

    //       var js,
    //         id = 'facebook-jssdk',
    //         ref = d.getElementsByTagName('script')[0];

    //       if (d.getElementById(id)) {
    //         return;
    //       }

    //       js = d.createElement('script');
    //       js.id = id;
    //       js.async = true;
    //       js.src = "//connect.facebook.net/en_US/all.js";

    //       ref.parentNode.insertBefore(js, ref);

    //     }(document));


    //filter for events being older
    $scope.isFuture = function(event) {
      return function(item) {
        return item[Date.parse(event.start_time)] > Date.now();
      }
    }

    $scope.events = false;
    $scope.posts = false;
    $scope.brewery = false;
    
    
    //get untapped info
    $http.defaults.cache = true;
    $http.get('https://api.untappd.com/v4/brewery/info/225097?client_id=43158D6116E0305CADB971CC65769720271E6D6A&client_secret=E1E244AD4D1699C1D3BE949A89EFE7B51E0BE0D5').
    then(function(data, status, headers, config) {
      console.log(data);
      brewery = data.data.response.brewery;
      $scope.brewery = data.data.response.brewery;
    }).catch(function(data, status, headers, config) {
      console.log("Error getting data ",data);
    });
    //try fb call
    //events
    facebookService.FBCall("/thesistersbrewery/events?access_token=1007778489291152|u2Rs03TsG_yGoAxzC8ZUdpgEOwA")
      .then(function(response) {
        console.log(response);
        $scope.events = response.data;
      });

    //feed posts (only get 10?)
    facebookService.FBCall("/thesistersbrewery/posts?limit=10&access_token=1007778489291152|u2Rs03TsG_yGoAxzC8ZUdpgEOwA")
      .then(function(response) {
        console.log(response);
        $scope.posts = response.data;
      });

    //examples
    this.member = " ";
    this.method = function() {
      //do something
    };
  });
})();

//easing scrolling
//no easing /jquery UI needed
$(function() {
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      var hashstring = this.hash.slice(1);
      target = target.length ? target : $('[name=' + hashstring + ']');
      if (target.length) {
        //change page title? 
        document.title = $(this).text() + " | Sisters Brewery";

        $('html,body').stop().animate({
          scrollTop: target.offset().top - 100
        }, 1000, function() {
          location.hash = hashstring; //attach the hash (#jumptarget) to the pageurl
        });
        return false;
      }
    }
  });
});

// $(document).ready(function() {
//   $.ajaxSetup({
//     cache: true
//   });
//   $.getScript('//connect.facebook.net/en_US/sdk.js', function() {
//     FB.init({
//       appId: '1007778489291152',
//       xfbml: true,
//       version: 'v2.6' // or v2.0, v2.1, v2.2, v2.3
//     });
//     FB.api(
//       "/thesistersbrewery/events?access_token=1007778489291152|u2Rs03TsG_yGoAxzC8ZUdpgEOwA",
//       function(response) {
//         console.log(response);
//         if (response && !response.error) {}
//       }
//     );
//   });
// });