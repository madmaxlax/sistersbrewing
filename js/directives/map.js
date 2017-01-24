///<reference path="C:\Apps\Dropbox\Dev\typings\angularjs\angular.d.ts" />
///<reference path="C:\Apps\Dropbox\Dev\typings\googlemaps.d.ts" />
///<reference path="C:\Users\Max\typings\globals\google.maps\index.d.ts" />
///<reference path="C:\Users\Max\typings\modules\angular\index.d.ts" />


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


//maybe make the map and places into an angular factory/service later
var places = [{
    name: 'In de Wildeman',
    lat: 52.37615,
    long: 4.89517,
    address: 'Kolksteeg 3',
    city: 'Amsterdam'
},
    {
        name: 'Delirium Café Amsterdam',
        lat: 52.37756,
        long: 4.91269,
        address: 'Piet Heinkade 4-6-8',
        city: 'Amsterdam'
    }
];
//make it global...also maybe make it an angular factory or service later
var map;
(function () {
    angular.module('SistersBrewApp').directive('sbBeersMap', function () {
        return {
            restrict: 'E',
            templateUrl: 'js/directives/beersmap.html',
            link: function (scope, element, attrs) {
                console.log("link");
                if (typeof (google) != 'undefined' && google != null) {
                    //create the map, center it on Amsterdam
                    //eventually add way to get current location
                    map = new google.maps.Map(document.getElementById('map'), {
                        center: { lat: 52.3665982, lng: 4.8851904 },//[52.3665982, 4.8851904]
                        zoom: 13,
                        styles: mapStyles,
                        scrollwheel: false
                    });

                    var prev_infoWindow = false;
                    //add markers
                    places.forEach(function (beerSpot) {
                        //set up the marker
                        var marker = new google.maps.Marker({
                            position: { lat: beerSpot['lat'], lng: beerSpot['long'] },
                            map: map,
                            title: beerSpot['name']
                        });

                        //set up the info window 
                        var infoWindow = new google.maps.InfoWindow({
                            content: '<h1>' + beerSpot['name'] + '</h1>'
                        });

                        //make the info window open when clicked 
                        //how to close?
                        marker.addListener('click', function () {
                            if (prev_infoWindow) {
                                prev_infoWindow.close();
                            }

                            prev_infoWindow = infoWindow;
                            infoWindow.open(map, marker);
                        });
                    });
                } else {
                    // alert the user
                    console.log("google not ready yet");
                }

            }
        };
    });


})();