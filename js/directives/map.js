///<reference path="C:\Apps\Dropbox\Dev\typings\angularjs\angular.d.ts" />
///<reference path="C:\Apps\Dropbox\Dev\typings\googlemaps.d.ts" />

//kinda awkward but have to modify the map style here
//https://developers.google.com/maps/documentation/javascript/styling#creating_a_styledmaptype
var mapStyles = [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }]
    },
    {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }]
    },
    {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#263c3f' }]
    },
    {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#6b9a76' }]
    },
    {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#38414e' }]
    },
    {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#212a37' }]
    },
    {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#9ca5b3' }]
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#746855' }]
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#1f2835' }]
    },
    {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#f3d19c' }]
    },
    {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{ color: '#2f3948' }]
    },
    {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }]
    },
    {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#17263c' }]
    },
    {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#515c6d' }]
    },
    {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#17263c' }]
    }
];

(function () {
    angular.module('SistersBrewApp').directive('sbBeersMap', function () {
        return {
            restrict: 'E',
            templateUrl: 'js/directives/beersmap.html',
            link: function (scope, element, attrs) {
                console.log("link");
                if (typeof (google) != 'undefined' && google != null) {
                    var map = new google.maps.Map(document.getElementById('map'), {
                        center: { lat: 52.3665982, lng: 4.8851904 },//[52.3665982, 4.8851904]
                        zoom: 14,
                        styles: mapStyles,
                        scrollwheel: false
                    });
                } else {
                    // alert the user
                    console.log("google not ready yet");
                }

            }
        };
    });


})();