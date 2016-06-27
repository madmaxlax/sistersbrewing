window.fbAsyncInit = function() {
  FB.init({
    appId: '1007778489291152',
    xfbml: true,
    version: 'v2.6'
  });

  ///only load angular when ready
  angular.bootstrap(document, ['myapp']);
};

(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);
  js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

(function() {
  var app = angular.module('myapp', []);
  app.
  filter('future', function() {
    return function(items) {
      var filtered = [];
      angular.forEach(items, function(event) {
        console.log(event);
        if (event && event.start_time) {
          if (Date.parse(event.start_time) > Date.now()) {
            filtered.push(event);
          }
        }
      });
      return filtered;
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
  app.controller('appController', function(facebookService, $scope, $window) {
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


    //try fb call
    $scope.events = false;
    facebookService.FBCall("/thesistersbrewery/events?access_token=1007778489291152|u2Rs03TsG_yGoAxzC8ZUdpgEOwA")
      .then(function(response) {
        console.log(response);
        $scope.events = response.data;
      });

    //examples
    this.member = " ";
    this.method = function() {
      //do something
    };
  });
})();

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