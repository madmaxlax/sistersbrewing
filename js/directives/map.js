///<reference path="C:\Apps\Dropbox\Dev\typings\angularjs\angular.d.ts" />
///<reference path="C:\Apps\Dropbox\Dev\typings\googlemaps.d.ts" />
///<reference path="C:\Users\Max\typings\globals\google.maps\index.d.ts" />
///<reference path="C:\Users\Max\typings\modules\angular\index.d.ts" />


//kinda awkward but have to modify the map style here
//https://developers.google.com/maps/documentation/javascript/styling#creating_a_styledmaptype
var mapStylesNight = [
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
var mapsStylesWhite = [{ "featureType": "all", "elementType": "geometry.fill", "stylers": [{ "weight": "2.00" }] }, { "featureType": "all", "elementType": "geometry.stroke", "stylers": [{ "color": "#9c9c9c" }] }, { "featureType": "all", "elementType": "labels.text", "stylers": [{ "visibility": "on" }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f2f2f2" }] }, { "featureType": "landscape", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }] }, { "featureType": "landscape.man_made", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }] }, { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": -100 }, { "lightness": 45 }] }, { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "color": "#eeeeee" }] }, { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#7b7b7b" }] }, { "featureType": "road", "elementType": "labels.text.stroke", "stylers": [{ "color": "#ffffff" }] }, { "featureType": "road.highway", "elementType": "all", "stylers": [{ "visibility": "simplified" }] }, { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#46bcec" }, { "visibility": "on" }] }, { "featureType": "water", "elementType": "geometry.fill", "stylers": [{ "color": "#c8d7d4" }] }, { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#070707" }] }, { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [{ "color": "#ffffff" }] }];


//maybe make the map and places into an angular factory/service later
var places;

//make it global...also maybe make it an angular factory or service later
var map;
(function () {
    angular.module('SistersBrewApp').factory('googleMapsService', ['facebookService', '$http', '$document', function (facebookService, $http, $document) {
        //var thisMapService = this;

        //function for radians conversion
        var rad = function (x) { return x * Math.PI / 180; };
        var tryLocWithIP = function () {
            var url = "http://freegeoip.net/json/";

            $http.get(url).
                then(function (data, status, headers, config) {
                    console.log(data);
                    var position = { coords: data.data };
                    geo_success(position);
                }).catch(function (data, status, headers, config) {
                    console.log("Error getting data " + status);
                });
        };

        var wpid = false;
        var currentLocMarker = false;
        var geo_success = function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            serviceObj.map.setZoom(11);
            serviceObj.map.panTo(pos);
            findClosestMarker(position.coords.latitude, position.coords.longitude);
        };
        var geo_failure = function (error) {
            console.log('No geo location possible');
            console.log(error);
            tryLocWithIP();
        };
        //math function for finding closest marker
        var findClosestMarker = function (lat, lng) {
            var R = 6371; // radius of earth in km
            var distances = [];
            var closest = -1;
            for (i = 0; i < serviceObj.locationMarkers.length; i++) {
                var mlat = serviceObj.locationMarkers[i].position.lat();
                var mlng = serviceObj.locationMarkers[i].position.lng();
                var dLat = rad(mlat - lat);
                var dLong = rad(mlng - lng);
                var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(rad(lat)) * Math.cos(rad(lat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                var d = R * c;
                distances[i] = d;
                if (closest == -1 || d < distances[closest]) {
                    closest = i;
                }
            }
            //console.log(serviceObj.locationMarkers[closest]);
            //zoom and open the closest marker
            new google.maps.event.trigger(serviceObj.locationMarkers[closest], 'click');
        };

        var serviceObj = {
            //the global map variable
            map: false,
            //map styles
            mapStylesNight: [
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
            ],
            mapsStylesWhite: [{ "featureType": "all", "elementType": "geometry.fill", "stylers": [{ "weight": "2.00" }] }, { "featureType": "all", "elementType": "geometry.stroke", "stylers": [{ "color": "#9c9c9c" }] }, { "featureType": "all", "elementType": "labels.text", "stylers": [{ "visibility": "on" }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f2f2f2" }] }, { "featureType": "landscape", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }] }, { "featureType": "landscape.man_made", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }] }, { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": -100 }, { "lightness": 45 }] }, { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "color": "#eeeeee" }] }, { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#7b7b7b" }] }, { "featureType": "road", "elementType": "labels.text.stroke", "stylers": [{ "color": "#ffffff" }] }, { "featureType": "road.highway", "elementType": "all", "stylers": [{ "visibility": "simplified" }] }, { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#46bcec" }, { "visibility": "on" }] }, { "featureType": "water", "elementType": "geometry.fill", "stylers": [{ "color": "#c8d7d4" }] }, { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#070707" }] }, { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [{ "color": "#ffffff" }] }],
            //array of seller locations
            sellerLocations: [
                {
                    "Name": "B-Amsterdam",
                    "Address": "Johan Huizingalaan 763A",
                    "City": "Amsterdam",
                    "Full Address": "Johan Huizingalaan 763A Amsterdam ",
                    "Latitude": 52.3431438,
                    "Longitude": 4.8291689
                },
                {
                    "Name": "De Bierkoning",
                    "Address": "Paleisstraat 125",
                    "City": "Amsterdam",
                    "Full Address": "Paleisstraat 125 Amsterdam ",
                    "Latitude": 52.3722357,
                    "Longitude": 4.8898476
                },
                {
                    "Name": "De Biertuin",
                    "Address": "Linnaeusstraat 29",
                    "City": "Amsterdam",
                    "Full Address": "Linnaeusstraat 29 Amsterdam ",
                    "Latitude": 52.362325,
                    "Longitude": 4.9242439
                },
                {
                    "Name": "Café Gollem",
                    "Address": "Daniel Stalpertstraat 74",
                    "City": "Amsterdam",
                    "Full Address": "Daniel Stalpertstraat 74 Amsterdam ",
                    "Latitude": 52.3560694,
                    "Longitude": 4.8908754
                },
                {
                    "Name": "Craft & Draft",
                    "Address": "Overtoom 417",
                    "City": "Amsterdam",
                    "Full Address": "Overtoom 417 Amsterdam ",
                    "Latitude": 52.3590686,
                    "Longitude": 4.8611688
                },
                {
                    "Name": "Delirium Café Amsterdam",
                    "Address": "Piet Heinkade 4-6-8",
                    "City": "Amsterdam",
                    "Full Address": "Piet Heinkade 4-6-8 Amsterdam ",
                    "Latitude": 52.3775509,
                    "Longitude": 4.912677
                },
                {
                    "Name": "In de Wildeman",
                    "Address": "Kolksteeg 3",
                    "City": "Amsterdam",
                    "Full Address": "Kolksteeg 3 Amsterdam ",
                    "Latitude": 52.3761528,
                    "Longitude": 4.8951579
                },
                {
                    "Name": "Liquorstore The Pint",
                    "Address": "Middenweg 57a",
                    "City": "Amsterdam",
                    "Full Address": "Middenweg 57a Amsterdam ",
                    "Latitude": 52.3539459,
                    "Longitude": 4.9305255
                },
                {
                    "Name": "Proeflokaal Arendsnest",
                    "Address": "Herengracht 90",
                    "City": "Amsterdam",
                    "Full Address": "Herengracht 90 Amsterdam ",
                    "Latitude": 52.3767056,
                    "Longitude": 4.88937789999999
                },
                {
                    "Name": "Restaurant Dwars",
                    "Address": "Egelantiersstraat 24",
                    "City": "Amsterdam",
                    "Full Address": "Egelantiersstraat 24 Amsterdam ",
                    "Latitude": 52.3771444,
                    "Longitude": 4.884261
                },
                {
                    "Name": "Slijterij 't Fust",
                    "Address": "Bilderdijkstraat 203",
                    "City": "Amsterdam",
                    "Full Address": "Bilderdijkstraat 203 Amsterdam ",
                    "Latitude": 52.3663806,
                    "Longitude": 4.8730292
                },
                {
                    "Name": "Sterk De Clercqstraat",
                    "Address": "De Clercqstraat 1-9",
                    "City": "Amsterdam",
                    "Full Address": "De Clercqstraat 1-9 Amsterdam ",
                    "Latitude": 52.3716732,
                    "Longitude": 4.8738775
                },
                {
                    "Name": "Slijterij Ton Overmars",
                    "Address": "Timorplein 62",
                    "City": "Amsterdam",
                    "Full Address": "Timorplein 62 Amsterdam ",
                    "Latitude": 52.3652376,
                    "Longitude": 4.9360324
                },
                {
                    "Name": "Studio/K",
                    "Address": "Hoofddorpplein 11",
                    "City": "Amsterdam",
                    "Full Address": "Hoofddorpplein 11 Amsterdam ",
                    "Latitude": 52.3508942,
                    "Longitude": 4.8499599
                },
                {
                    "Name": "Tabak's Notenbar",
                    "Address": "Rijnstraat 132H",
                    "City": "Amsterdam",
                    "Full Address": "Rijnstraat 132H Amsterdam ",
                    "Latitude": 52.3436262,
                    "Longitude": 4.9060245
                },
                {
                    "Name": "TAP ZUID",
                    "Address": "Maasstraat 70",
                    "City": "Amsterdam",
                    "Full Address": "Maasstraat 70 Amsterdam ",
                    "Latitude": 52.3452375,
                    "Longitude": 4.8948366
                },
                {
                    "Name": "Slijterij-Wijnhandel W. van Schaik",
                    "Address": "Dorpsstraat 32",
                    "City": "Aalsmeer",
                    "Full Address": "Dorpsstraat 32 Aalsmeer ",
                    "Latitude": 52.2703925,
                    "Longitude": 4.7479555
                },
                {
                    "Name": "Bierenplezier",
                    "Address": "Schippergarage 13",
                    "City": "Almere",
                    "Full Address": "Schippergarage 13 Almere ",
                    "Latitude": 52.3507849,
                    "Longitude": 5.2647016
                },
                {
                    "Name": "Goed Gebrouwen",
                    "Address": "Zadelmakerstraat 18",
                    "City": "Almere",
                    "Full Address": "Zadelmakerstraat 18 Almere ",
                    "Latitude": 52.3685168,
                    "Longitude": 5.2160172
                },
                {
                    "Name": "Biercafé De Natte",
                    "Address": "Julianastraat 19",
                    "City": "Alphen aan Den Rijn",
                    "Full Address": "Julianastraat 19 Alphen aan Den Rijn ",
                    "Latitude": 52.1273336999999,
                    "Longitude": 4.6615631
                },
                {
                    "Name": "Hendrick's Pub",
                    "Address": "Prins Hendrikstraat 119",
                    "City": "Alphen aan Den Rijn",
                    "Full Address": "Prins Hendrikstraat 119 Alphen aan Den Rijn ",
                    "Latitude": 52.1244874,
                    "Longitude": 4.6620474
                },
                {
                    "Name": "Jelfra",
                    "Address": "Van Foreestlaan 5",
                    "City": "Alphen aan Den Rijn",
                    "Full Address": "Van Foreestlaan 5 Alphen aan Den Rijn ",
                    "Latitude": 52.1374816,
                    "Longitude": 4.6471123
                },
                {
                    "Name": "Het Lokaal",
                    "Address": "Oliemolenhof 90",
                    "City": "Amersfoort",
                    "Full Address": "Oliemolenhof 90 Amersfoort ",
                    "Latitude": 52.1601165,
                    "Longitude": 5.3801765
                },
                {
                    "Name": "Café De Beugel",
                    "Address": "Duizelsteeg 20",
                    "City": "Arnhem",
                    "Full Address": "Duizelsteeg 20 Arnhem ",
                    "Latitude": 51.9819774,
                    "Longitude": 5.9041521
                },
                {
                    "Name": "Café Den Koopman",
                    "Address": "Korenmarkt 12",
                    "City": "Arnhem",
                    "Full Address": "Korenmarkt 12 Arnhem ",
                    "Latitude": 51.9827407,
                    "Longitude": 5.9042545
                },
                {
                    "Name": "Look eten & drinken",
                    "Address": "Kastanjelaan 1",
                    "City": "Arnhem",
                    "Full Address": "Kastanjelaan 1 Arnhem ",
                    "Latitude": 51.9824858,
                    "Longitude": 5.9191367
                },
                {
                    "Name": "Restaurant Benjamin",
                    "Address": "Wezenstraat 3",
                    "City": "Arnhem",
                    "Full Address": "Wezenstraat 3 Arnhem ",
                    "Latitude": 51.9823685,
                    "Longitude": 5.9083432
                },
                {
                    "Name": "Slijterij van Pernis",
                    "Address": "Prinsessestraat 34",
                    "City": "Arnhem",
                    "Full Address": "Prinsessestraat 34 Arnhem ",
                    "Latitude": 51.9797974,
                    "Longitude": 5.9193377
                },
                {
                    "Name": "TAPE Espressobar, Cafe & Expo Arnhem",
                    "Address": "Hommelstraat 66",
                    "City": "Arnhem",
                    "Full Address": "Hommelstraat 66 Arnhem ",
                    "Latitude": 51.9854642,
                    "Longitude": 5.91442619999999
                },
                {
                    "Name": "Wijnhandel Barrique",
                    "Address": "Pauwstraat 9",
                    "City": "Arnhem",
                    "Full Address": "Pauwstraat 9 Arnhem ",
                    "Latitude": 51.9823499,
                    "Longitude": 5.90571199999999
                },
                {
                    "Name": "Café Broer & Zus",
                    "Address": "Schans 10",
                    "City": "Beverwijk",
                    "Full Address": "Schans 10 Beverwijk ",
                    "Latitude": 52.4837546,
                    "Longitude": 4.66191749999999
                },
                {
                    "Name": "Wijnhuis & Slijterij Meerwijck",
                    "Address": "Meerstraat 96",
                    "City": "Beverwijk",
                    "Full Address": "Meerstraat 96 Beverwijk ",
                    "Latitude": 52.4808616,
                    "Longitude": 4.6591533
                },
                {
                    "Name": "Speciaalbierwinkel",
                    "Address": "Overtocht 6",
                    "City": "Bodegraven",
                    "Full Address": "Overtocht 6 Bodegraven ",
                    "Latitude": 52.0844294,
                    "Longitude": 4.7448836
                },
                {
                    "Name": "Leo's Drankenhuis",
                    "Address": "Zijde 4 A",
                    "City": "Boskoop",
                    "Full Address": "Zijde 4 A Boskoop ",
                    "Latitude": 52.0742328,
                    "Longitude": 4.65808139999999
                },
                {
                    "Name": "Wijnhandel A.G. van Uden",
                    "Address": "Kruisstraat 5",
                    "City": "Boxtel",
                    "Full Address": "Kruisstraat 5 Boxtel ",
                    "Latitude": 51.5882959,
                    "Longitude": 5.32597899999999
                },
                {
                    "Name": "Het Bierhuis Breda",
                    "Address": "Van Goorstraat 5",
                    "City": "Breda",
                    "Full Address": "Van Goorstraat 5 Breda ",
                    "Latitude": 51.5821306,
                    "Longitude": 4.7778955
                },
                {
                    "Name": "Slijterij Spraakwater",
                    "Address": "Brabantplein 6",
                    "City": "Breda",
                    "Full Address": "Brabantplein 6 Breda ",
                    "Latitude": 51.5908409,
                    "Longitude": 4.79956
                },
                {
                    "Name": "Gall & Gall",
                    "Address": "Markt 8",
                    "City": "Breukelen",
                    "Full Address": "Markt 8 Breukelen ",
                    "Latitude": 52.1709599,
                    "Longitude": 5.00371519999999
                },
                {
                    "Name": "IKOOK!",
                    "Address": "Straatweg 94",
                    "City": "Breukelen",
                    "Full Address": "Straatweg 94 Breukelen ",
                    "Latitude": 52.171398,
                    "Longitude": 5.002229
                },
                {
                    "Name": "Same Same Restaurant",
                    "Address": "Herenstraat 25",
                    "City": "Breukelen",
                    "Full Address": "Herenstraat 25 Breukelen ",
                    "Latitude": 52.1738963,
                    "Longitude": 5.0024085
                },
                {
                    "Name": "Buitenplaats Slangevegt",
                    "Address": "Straatweg 40",
                    "City": "Breukelen",
                    "Full Address": "Straatweg 40 Breukelen ",
                    "Latitude": 52.1580934,
                    "Longitude": 5.0186637
                },
                {
                    "Name": "Zuivelland Breukelen",
                    "Address": "Kerkbrink 15e",
                    "City": "Breukelen",
                    "Full Address": "Kerkbrink 15e Breukelen ",
                    "Latitude": 52.1721639,
                    "Longitude": 5.0025765
                },
                {
                    "Name": "Flink Gegist",
                    "Address": "Oosteinde 227",
                    "City": "Delft",
                    "Full Address": "Oosteinde 227 Delft ",
                    "Latitude": 52.0123458,
                    "Longitude": 4.3626055
                },
                {
                    "Name": "De Wilde Hollander",
                    "Address": "Markt 33",
                    "City": "Delft",
                    "Full Address": "Markt 33 Delft ",
                    "Latitude": 52.0111874,
                    "Longitude": 4.3587661
                },
                {
                    "Name": "Slijterij-Wijnhandel W. van Schaik",
                    "Address": "Mereveldplein 19",
                    "City": "De Meern",
                    "Full Address": "Mereveldplein 19 De Meern ",
                    "Latitude": 52.0793197,
                    "Longitude": 5.03747329999999
                },
                {
                    "Name": "Bottleshop Eindhoven",
                    "Address": "Geldropseweg 86a",
                    "City": "Eindhoven",
                    "Full Address": "Geldropseweg 86a Eindhoven ",
                    "Latitude": 51.4330471,
                    "Longitude": 5.48951799999999
                },
                {
                    "Name": "De Bierbrigadier",
                    "Address": "Bergstraat 41",
                    "City": "Eindhoven",
                    "Full Address": "Bergstraat 41 Eindhoven ",
                    "Latitude": 51.4363384,
                    "Longitude": 5.4769415
                },
                {
                    "Name": "Mitra Slijterij M. van Bergen",
                    "Address": "Hurksestraat 44",
                    "City": "Eindhoven",
                    "Full Address": "Hurksestraat 44 Eindhoven ",
                    "Latitude": 51.4362743,
                    "Longitude": 5.4297328
                },
                {
                    "Name": "Burg Bieren",
                    "Address": "Putterweg 45",
                    "City": "Ermelo",
                    "Full Address": "Putterweg 45 Ermelo ",
                    "Latitude": 52.2968556,
                    "Longitude": 5.6312351
                },
                {
                    "Name": "Biercafé De Goudse Eend",
                    "Address": "Wilhelminastraat 66",
                    "City": "Gouda",
                    "Full Address": "Wilhelminastraat 66 Gouda ",
                    "Latitude": 52.0132206,
                    "Longitude": 4.7123857
                },
                {
                    "Name": "Drankenservice Gouda",
                    "Address": "Willem en Marialaan 22",
                    "City": "Gouda",
                    "Full Address": "Willem en Marialaan 22 Gouda ",
                    "Latitude": 52.018964,
                    "Longitude": 4.716625
                },
                {
                    "Name": "Dranken- en Wijnhandel Versluis",
                    "Address": "Suezkade 48",
                    "City": "s Gravenhage",
                    "Full Address": "Suezkade 48 s Gravenhage ",
                    "Latitude": 52.0785815,
                    "Longitude": 4.285945
                },
                {
                    "Name": "Liquor Store de filosoof | Slijterij de filosoof | Slijterij Den Haag",
                    "Address": "Papestraat 5",
                    "City": "s Gravenhage",
                    "Full Address": "Papestraat 5 s Gravenhage ",
                    "Latitude": 52.0792735,
                    "Longitude": 4.3082782
                },
                {
                    "Name": "Café De Keizer",
                    "Address": "Keizerstraat 14",
                    "City": "Gorinchem",
                    "Full Address": "Keizerstraat 14 Gorinchem ",
                    "Latitude": 51.830421,
                    "Longitude": 4.9786945
                },
                {
                    "Name": "Café Pavlov",
                    "Address": "Langendijk 23",
                    "City": "Gorinchem",
                    "Full Address": "Langendijk 23 Gorinchem ",
                    "Latitude": 51.8295409,
                    "Longitude": 4.9763234
                },
                {
                    "Name": "Slijterij Madeira",
                    "Address": "Vaartplein 5",
                    "City": "s-Gravenzande",
                    "Full Address": "Vaartplein 5 s-Gravenzande ",
                    "Latitude": 52.0037151999999,
                    "Longitude": 4.162399
                },
                {
                    "Name": "Belgisch Café De Pintelier",
                    "Address": "Kleine Kromme Elleboog 9",
                    "City": "Groningen",
                    "Full Address": "Kleine Kromme Elleboog 9 Groningen ",
                    "Latitude": 53.2186168,
                    "Longitude": 6.561677
                },
                {
                    "Name": "Café De Koffer",
                    "Address": "Nieuwe Blekerstraat 1",
                    "City": "Groningen",
                    "Full Address": "Nieuwe Blekerstraat 1 Groningen ",
                    "Latitude": 53.2163062,
                    "Longitude": 6.5553413
                },
                {
                    "Name": "Café Singelier",
                    "Address": "Coendersweg 44",
                    "City": "Groningen",
                    "Full Address": "Coendersweg 44 Groningen ",
                    "Latitude": 53.1995356,
                    "Longitude": 6.5829911
                },
                {
                    "Name": "Van Erp Dranken",
                    "Address": "Grote Kromme Elleboog 16",
                    "City": "Groningen",
                    "Full Address": "Grote Kromme Elleboog 16 Groningen ",
                    "Latitude": 53.2179538,
                    "Longitude": 6.56225019999999
                },
                {
                    "Name": "Slijterij Groningen",
                    "Address": "Vismarkt 36",
                    "City": "Groningen",
                    "Full Address": "Vismarkt 36 Groningen ",
                    "Latitude": 53.2170455,
                    "Longitude": 6.5652731
                },
                {
                    "Name": "De Roemer Groningen",
                    "Address": "A=straat 13",
                    "City": "Groningen",
                    "Full Address": "A=straat 13 Groningen ",
                    "Latitude": 53.2166781,
                    "Longitude": 6.55805589999999
                },
                {
                    "Name": "bij Tessels",
                    "Address": "Tesselschadeplein 6",
                    "City": "Haarlem",
                    "Full Address": "Tesselschadeplein 6 Haarlem ",
                    "Latitude": 52.4169025,
                    "Longitude": 4.6499157
                },
                {
                    "Name": "Melger's Wijn en Dranken",
                    "Address": "Barrevoetestraat 15",
                    "City": "Haarlem",
                    "Full Address": "Barrevoetestraat 15 Haarlem ",
                    "Latitude": 52.380014,
                    "Longitude": 4.630825
                },
                {
                    "Name": "Proeflokaal In den Uiver",
                    "Address": "Riviervismarkt 13",
                    "City": "Haarlem",
                    "Full Address": "Riviervismarkt 13 Haarlem ",
                    "Latitude": 52.3812548999999,
                    "Longitude": 4.6381758
                },
                {
                    "Name": "Uiltje Bar",
                    "Address": "Zijlstraat 18",
                    "City": "Haarlem",
                    "Full Address": "Zijlstraat 18 Haarlem ",
                    "Latitude": 52.382878,
                    "Longitude": 4.6306521
                },
                {
                    "Name": "Slijterij-Wijnhandel Tjokko",
                    "Address": "Dorpsstraat 75",
                    "City": "Harmelen",
                    "Full Address": "Dorpsstraat 75 Harmelen ",
                    "Latitude": 52.0914937999999,
                    "Longitude": 4.9634003
                },
                {
                    "Name": "Slijterij Staal úw topSlijter",
                    "Address": "Raadhuisplein 40b",
                    "City": "Heerhugowaard",
                    "Full Address": "Raadhuisplein 40b Heerhugowaard ",
                    "Latitude": 52.6705029,
                    "Longitude": 4.84343149999999
                },
                {
                    "Name": "De Wijnhoeve",
                    "Address": "Kapelstraat 29",
                    "City": "Heeze",
                    "Full Address": "Kapelstraat 29 Heeze ",
                    "Latitude": 51.3825973999999,
                    "Longitude": 5.5808168
                },
                {
                    "Name": "Kaashuis Tromp",
                    "Address": "Winkelhof 't Loo 23",
                    "City": "Heiloo",
                    "Full Address": "Winkelhof 't Loo 23 Heiloo ",
                    "Latitude": 52.6012341,
                    "Longitude": 4.7004931
                },
                {
                    "Name": "Het Biermoment",
                    "Address": "Schorfhoeve 4",
                    "City": "Helmond",
                    "Full Address": "Schorfhoeve 4 Helmond ",
                    "Latitude": 51.452939,
                    "Longitude": 5.6098598
                },
                {
                    "Name": "Café Bar le Duc",
                    "Address": "Korenbrugstraat 5",
                    "City": "s-Hertogenbosch",
                    "Full Address": "Korenbrugstraat 5 s-Hertogenbosch ",
                    "Latitude": 51.6898166999999,
                    "Longitude": 5.30031279999999
                },
                {
                    "Name": "Proeflokaal 't paultje",
                    "Address": "Lepelstraat 31A",
                    "City": "s-Hertogenbosch",
                    "Full Address": "Lepelstraat 31A s-Hertogenbosch ",
                    "Latitude": 51.6901528,
                    "Longitude": 5.29961249999999
                },
                {
                    "Name": "Jonghe Graef van Buuren",
                    "Address": "Laanstraat 37",
                    "City": "Hilversum",
                    "Full Address": "Laanstraat 37 Hilversum ",
                    "Latitude": 52.2227147,
                    "Longitude": 5.1746287
                },
                {
                    "Name": "Kaaskamer Hooi en Klomp",
                    "Address": "Hilvertsweg 133",
                    "City": "Hilversum",
                    "Full Address": "Hilvertsweg 133 Hilversum ",
                    "Latitude": 52.2152008,
                    "Longitude": 5.1680666
                },
                {
                    "Name": "A Tutta Birra Di Mencucci Fabio",
                    "Address": "Via Campo Boario 11",
                    "City": "Senigallia AN, Italy",
                    "Full Address": "Via Campo Boario 11 Senigallia AN, Italy ",
                    "Latitude": 43.7151913,
                    "Longitude": 13.2120082
                },
                {
                    "Name": "Zabumba",
                    "Address": "Via Marchetti 7",
                    "City": "Senigallia AN, Italy",
                    "Full Address": "Via Marchetti 7 Senigallia AN, Italy ",
                    "Latitude": 43.713102,
                    "Longitude": 13.217057
                },
                {
                    "Name": "Slijterij De Hoorn",
                    "Address": "Hoornesplein 53",
                    "City": "Katwijk aan Zee",
                    "Full Address": "Hoornesplein 53 Katwijk aan Zee ",
                    "Latitude": 52.2061867,
                    "Longitude": 4.4182211
                },
                {
                    "Name": "Slijterij De Hoorn",
                    "Address": "Meeuwenlaan 45",
                    "City": "Katwijk aan Zee",
                    "Full Address": "Meeuwenlaan 45 Katwijk aan Zee ",
                    "Latitude": 52.1996581999999,
                    "Longitude": 4.4061244
                },
                {
                    "Name": "Slijterij Drinks & Gifts",
                    "Address": "Heiligeweg 15a",
                    "City": "Krommenie",
                    "Full Address": "Heiligeweg 15a Krommenie ",
                    "Latitude": 52.5002706,
                    "Longitude": 4.7672175
                },
                {
                    "Name": "Bierschuur Laren",
                    "Address": "Zevenend 77",
                    "City": "Laren",
                    "Full Address": "Zevenend 77 Laren ",
                    "Latitude": 52.2502229,
                    "Longitude": 5.23044209999999
                },
                {
                    "Name": "Bar Bruut",
                    "Address": "Steenstraat 22",
                    "City": "Leiden",
                    "Full Address": "Steenstraat 22 Leiden ",
                    "Latitude": 52.1628792,
                    "Longitude": 4.48470099999999
                },
                {
                    "Name": "Belgisch Bier Café Olivier",
                    "Address": "Hooigracht 23",
                    "City": "Leiden",
                    "Full Address": "Hooigracht 23 Leiden ",
                    "Latitude": 52.1575487,
                    "Longitude": 4.4956865
                },
                {
                    "Name": "Bierwinkel Leiden",
                    "Address": "Hartesteeg 9",
                    "City": "Leiden",
                    "Full Address": "Hartesteeg 9 Leiden ",
                    "Latitude": 52.1571248,
                    "Longitude": 4.4941735
                },
                {
                    "Name": "Drankenhandel Leiden",
                    "Address": "Zeemanlaan 22B",
                    "City": "Leiden",
                    "Full Address": "Zeemanlaan 22B Leiden ",
                    "Latitude": 52.1499558,
                    "Longitude": 4.4958103
                },
                {
                    "Name": "Eeterij en Proeverij \"Het Stadsbrouwhuis\"",
                    "Address": "Aalmarkt 1",
                    "City": "Leiden",
                    "Full Address": "Aalmarkt 1 Leiden ",
                    "Latitude": 52.160075,
                    "Longitude": 4.48875119999999
                },
                {
                    "Name": "Lemmy's Biercafé",
                    "Address": "Morsstraat 24",
                    "City": "Leiden",
                    "Full Address": "Morsstraat 24 Leiden ",
                    "Latitude": 52.16187,
                    "Longitude": 4.4836873
                },
                {
                    "Name": "Slijterij Leiden",
                    "Address": "Diamantplein 1",
                    "City": "Leiden",
                    "Full Address": "Diamantplein 1 Leiden ",
                    "Latitude": 52.1567953,
                    "Longitude": 4.465123
                },
                {
                    "Name": "De Burgemeester",
                    "Address": "Raadhuisstraat 17",
                    "City": "Linschoten",
                    "Full Address": "Raadhuisstraat 17 Linschoten ",
                    "Latitude": 52.0619447,
                    "Longitude": 4.91452119999999
                },
                {
                    "Name": "Eterij De Drie Gekroonde Laarsjes",
                    "Address": "Rijksstraatweg 106",
                    "City": "Loenen a/d Vecht",
                    "Full Address": "Rijksstraatweg 106 Loenen a/d Vecht ",
                    "Latitude": 52.20901,
                    "Longitude": 5.02150529999999
                },
                {
                    "Name": "Restaurant 't Amsterdammertje",
                    "Address": "Rijksstraatweg 119",
                    "City": "Loenen a/d Vecht",
                    "Full Address": "Rijksstraatweg 119 Loenen a/d Vecht ",
                    "Latitude": 52.2096261,
                    "Longitude": 5.0214167
                },
                {
                    "Name": "Restaurant Tante Koosje",
                    "Address": "Kerkstraat 1",
                    "City": "Loenen a/d Vecht",
                    "Full Address": "Kerkstraat 1 Loenen a/d Vecht ",
                    "Latitude": 52.2091062,
                    "Longitude": 5.0235382
                },
                {
                    "Name": "Restaurant Opbuuren",
                    "Address": "De Hoopkade 51",
                    "City": "Maarssen",
                    "Full Address": "De Hoopkade 51 Maarssen ",
                    "Latitude": 52.1286515,
                    "Longitude": 5.05845119999999
                },
                {
                    "Name": "Slijterij-Wijnhandel W. van Schaik",
                    "Address": "Johannes Vermeerstraat 29",
                    "City": "Maarssen",
                    "Full Address": "Johannes Vermeerstraat 29 Maarssen ",
                    "Latitude": 52.1426568,
                    "Longitude": 5.0408363
                },
                {
                    "Name": "Bierboetiek",
                    "Address": "Professor ter Veenweg 11",
                    "City": "Middenmeer",
                    "Full Address": "Professor ter Veenweg 11 Middenmeer ",
                    "Latitude": 52.8076115999999,
                    "Longitude": 4.9982317
                },
                {
                    "Name": "De Bottelarij",
                    "Address": "Margrietstraat 65",
                    "City": "Mierlo",
                    "Full Address": "Margrietstraat 65 Mierlo ",
                    "Latitude": 51.4430197999999,
                    "Longitude": 5.6184897
                },
                {
                    "Name": "Slijterij-Wijnhandel W. van Schaik",
                    "Address": "Hoogstraat 14",
                    "City": "Montfoort",
                    "Full Address": "Hoogstraat 14 Montfoort ",
                    "Latitude": 52.0461573,
                    "Longitude": 4.9494064
                },
                {
                    "Name": "Café Piet Huisman",
                    "Address": "Sint Jacobslaan 30",
                    "City": "Nijmegen",
                    "Full Address": "Sint Jacobslaan 30 Nijmegen ",
                    "Latitude": 51.8226334999999,
                    "Longitude": 5.8511734
                },
                {
                    "Name": "De Bierhoeder",
                    "Address": "Bloemerstraat 86",
                    "City": "Nijmegen",
                    "Full Address": "Bloemerstraat 86 Nijmegen ",
                    "Latitude": 51.8453818,
                    "Longitude": 5.8612521
                },
                {
                    "Name": "Santhe Dranken",
                    "Address": "Havenstraat 12",
                    "City": "Noordwijkerhout",
                    "Full Address": "Havenstraat 12 Noordwijkerhout ",
                    "Latitude": 52.2621856,
                    "Longitude": 4.493131
                },
                {
                    "Name": "De Kaapse Brouwers",
                    "Address": "Veerlaan 19D",
                    "City": "Rotterdam",
                    "Full Address": "Veerlaan 19D Rotterdam ",
                    "Latitude": 51.9018402,
                    "Longitude": 4.4851426
                },
                {
                    "Name": "Plan B",
                    "Address": "s-Gravendijkwal 135",
                    "City": "Rotterdam",
                    "Full Address": "s-Gravendijkwal 135 Rotterdam ",
                    "Latitude": 51.9131870999999,
                    "Longitude": 4.4634
                },
                {
                    "Name": "In de Hoftuin",
                    "Address": "Anjelierenstraat 13",
                    "City": "Rijnsburg",
                    "Full Address": "Anjelierenstraat 13 Rijnsburg ",
                    "Latitude": 52.1915243,
                    "Longitude": 4.44255969999999
                },
                {
                    "Name": "Belgisch Bier Café Olivier",
                    "Address": "Achter Clarenburg 6a",
                    "City": "Utrecht",
                    "Full Address": "Achter Clarenburg 6a Utrecht ",
                    "Latitude": 52.0906254999999,
                    "Longitude": 5.1156592
                },
                {
                    "Name": "Bert's Bierhuis",
                    "Address": "Biltstraat 46",
                    "City": "Utrecht",
                    "Full Address": "Biltstraat 46 Utrecht ",
                    "Latitude": 52.0952712,
                    "Longitude": 5.1284107
                },
                {
                    "Name": "BuurtBier",
                    "Address": "Dickenslaan 56/1",
                    "City": "Utrecht",
                    "Full Address": "Dickenslaan 56/1 Utrecht ",
                    "Latitude": 52.0888123,
                    "Longitude": 5.08107119999999
                },
                {
                    "Name": "Café de Zaak",
                    "Address": "Korte Minrebroederstraat 9",
                    "City": "Utrecht",
                    "Full Address": "Korte Minrebroederstraat 9 Utrecht ",
                    "Latitude": 52.0921386,
                    "Longitude": 5.1203224
                },
                {
                    "Name": "Guusjes eten en drinken",
                    "Address": "`s Gravezandestraat 27",
                    "City": "Utrecht",
                    "Full Address": "`s Gravezandestraat 27 Utrecht ",
                    "Latitude": 52.0999922,
                    "Longitude": 5.1213342
                },
                {
                    "Name": "Hooi",
                    "Address": "Burgemeester Reigerstraat 25",
                    "City": "Utrecht",
                    "Full Address": "Burgemeester Reigerstraat 25 Utrecht ",
                    "Latitude": 52.0897626,
                    "Longitude": 5.1348421
                },
                {
                    "Name": "Kafé België",
                    "Address": "Oudegracht 196",
                    "City": "Utrecht",
                    "Full Address": "Oudegracht 196 Utrecht ",
                    "Latitude": 52.089033,
                    "Longitude": 5.1215853
                },
                {
                    "Name": "Key West Beachhouse",
                    "Address": "Strandboulevard 222",
                    "City": "Utrecht",
                    "Full Address": "Strandboulevard 222 Utrecht ",
                    "Latitude": 52.1193082,
                    "Longitude": 5.0246507
                },
                {
                    "Name": "Klimmuur Utrecht",
                    "Address": "Vlampijpstraat 79",
                    "City": "Utrecht",
                    "Full Address": "Vlampijpstraat 79 Utrecht ",
                    "Latitude": 52.1046706,
                    "Longitude": 5.0846718
                },
                {
                    "Name": "MCD Utrecht",
                    "Address": "Abel Tasmanstraat 13",
                    "City": "Utrecht",
                    "Full Address": "Abel Tasmanstraat 13 Utrecht ",
                    "Latitude": 52.0890695999999,
                    "Longitude": 5.0952864
                },
                {
                    "Name": "Parc388",
                    "Address": "Vleutenseweg 388",
                    "City": "Utrecht",
                    "Full Address": "Vleutenseweg 388 Utrecht ",
                    "Latitude": 52.0941022,
                    "Longitude": 5.0900241
                },
                {
                    "Name": "Slijterij Besseling",
                    "Address": "Kanaalstraat 65",
                    "City": "Utrecht",
                    "Full Address": "Kanaalstraat 65 Utrecht ",
                    "Latitude": 52.0917122,
                    "Longitude": 5.1029372
                },
                {
                    "Name": "Stan & Co",
                    "Address": "Ganzenmarkt 16A",
                    "City": "Utrecht",
                    "Full Address": "Ganzenmarkt 16A Utrecht ",
                    "Latitude": 52.0923514,
                    "Longitude": 5.119383
                },
                {
                    "Name": "Ubica Utrecht",
                    "Address": "Ganzenmarkt 24-26",
                    "City": "Utrecht",
                    "Full Address": "Ganzenmarkt 24-26 Utrecht ",
                    "Latitude": 52.0925477,
                    "Longitude": 5.1196737
                },
                {
                    "Name": "De Fantast",
                    "Address": "Frans van Beststraat 9",
                    "City": "Valkenswaard",
                    "Full Address": "Frans van Beststraat 9 Valkenswaard ",
                    "Latitude": 51.3527975,
                    "Longitude": 5.4642019
                },
                {
                    "Name": "Bierkado.nl",
                    "Address": "Newtonstraat 19",
                    "City": "Veenendaal",
                    "Full Address": "Newtonstraat 19 Veenendaal ",
                    "Latitude": 52.0370462,
                    "Longitude": 5.5764018
                },
                {
                    "Name": "Exbeerience",
                    "Address": "Zandstraat 113",
                    "City": "Veenendaal",
                    "Full Address": "Zandstraat 113 Veenendaal ",
                    "Latitude": 52.0291721,
                    "Longitude": 5.5508406
                },
                {
                    "Name": "Beej Benders",
                    "Address": "Monseigneur Nolensplein 54",
                    "City": "Venlo",
                    "Full Address": "Monseigneur Nolensplein 54 Venlo ",
                    "Latitude": 51.3726521,
                    "Longitude": 6.1718771
                },
                {
                    "Name": "Slijterij-Wijnhandel W. van Schaik",
                    "Address": "Vijfheerenlanden 544",
                    "City": "Vianen",
                    "Full Address": "Vijfheerenlanden 544 Vianen ",
                    "Latitude": 51.9942565,
                    "Longitude": 5.102363
                },
                {
                    "Name": "Voorburgse Bierwinkel",
                    "Address": "Wielemakersslop 8",
                    "City": "Voorburg",
                    "Full Address": "Wielemakersslop 8 Voorburg ",
                    "Latitude": 52.0685578,
                    "Longitude": 4.3651358
                },
                {
                    "Name": "Slijterij Adegeest",
                    "Address": "Van Beethovenlaan 17",
                    "City": "Voorschoten",
                    "Full Address": "Van Beethovenlaan 17 Voorschoten ",
                    "Latitude": 52.1335385999999,
                    "Longitude": 4.4525649
                },
                {
                    "Name": "De Bierboutique",
                    "Address": "Maaspoort 12",
                    "City": "Weert",
                    "Full Address": "Maaspoort 12 Weert ",
                    "Latitude": 51.2518346,
                    "Longitude": 5.7103833
                },
                {
                    "Name": "De Zwart Dranken & Delicatessen",
                    "Address": "Herenweg 35",
                    "City": "Wilnis",
                    "Full Address": "Herenweg 35 Wilnis ",
                    "Latitude": 52.1944852,
                    "Longitude": 4.8979459
                },
                {
                    "Name": "Drank van Nap",
                    "Address": "La Fontaineplein 26",
                    "City": "Woerden",
                    "Full Address": "La Fontaineplein 26 Woerden ",
                    "Latitude": 52.0857328,
                    "Longitude": 4.9041663
                },
                {
                    "Name": "Slijterij Vonk",
                    "Address": "Tuiniersstraat 8",
                    "City": "Zaandam",
                    "Full Address": "Tuiniersstraat 8 Zaandam ",
                    "Latitude": 52.4394734,
                    "Longitude": 4.8296505
                },
                {
                    "Name": "Bierwinkel Zeist",
                    "Address": "1e Hogeweg 160",
                    "City": "Zeist",
                    "Full Address": "1e Hogeweg 160 Zeist ",
                    "Latitude": 52.08494,
                    "Longitude": 5.24172489999999
                },
                {
                    "Name": "de Mol DrankenSpecialist",
                    "Address": "Laan van Cattenbroeck 7",
                    "City": "Zeist",
                    "Full Address": "Laan van Cattenbroeck 7 Zeist ",
                    "Latitude": 52.0785602,
                    "Longitude": 5.2287678
                }
            ],
            disableScrollingZoom: function () {
                serviceObj.map.setOptions({ scrollwheel: false, draggable: false });
            },
            mapsClickedOrFocused: false,
            mapsClickedListener: false,
            setupOutsideClickListener: function ($event) {
                //console.log($event);
                //console.log($event.target.firstChild.nodeName);

                //clicked on something outside the map
                if ($event.target.firstChild == null || $event.target.firstChild.nodeName.toLowerCase() !== "iframe") {
                    //console.log("clicked outside of map");
                    //disable scrolling on map
                    serviceObj.disableScrollingZoom();
                    //cancel the listener
                    //$document.off('click', serviceObj.setupOutsideClickListener);

                    serviceObj.mapsClickedOrFocused = false;
                }
            },
            initiateMap: function () {
                serviceObj.googleLoaded = true;
                //create the map, center it on Amsterdam
                //eventually add way to get current location
                serviceObj.map = new google.maps.Map(document.getElementById('map'), {
                    center: { lat: 52.3665982, lng: 4.8851904 },//[52.3665982, 4.8851904]
                    zoom: 9,
                    styles: mapsStylesWhite,
                    scrollwheel: false,
                    draggable: false
                });

                serviceObj.prev_infoWindow = false;
                //when map is clicked, enable drag and 
                google.maps.event.addListener(serviceObj.map, "click", function (event) {
                    if (!serviceObj.mapsClickedOrFocused) {
                        this.setOptions({ scrollwheel: true, draggable: true });

                        //setup listeners for outside of map click
                        //check for clicks anywhere
                        mapsClickedListener = $document.on("click", serviceObj.setupOutsideClickListener);

                        //mindful of cleanup
                        $document.on('$destroy', function () {
                            //$document.off('click', serviceObj.setupOutsideClickListener);
                            mapsClickedListener();
                        });

                        //close any open infoWindows
                        //disabled for now, sometimes annoying to lose the window
                        // if (serviceObj.prev_infoWindow) {
                        //     serviceObj.prev_infoWindow.close();
                        //     serviceObj.prev_infoWindow = false;
                        // }
                        serviceObj.mapsClickedOrFocused = true;
                    }
                });

                //add markers for beer locations
                serviceObj.sellerLocations.forEach(function (beerSpot) {
                    //set up the marker
                    var marker = new google.maps.Marker({
                        position: { lat: beerSpot.Latitude, lng: beerSpot.Longitude },
                        map: serviceObj.map,
                        title: beerSpot.Name,
                        icon: "./imgs/BeerLocationIcon.png"
                    });
                    serviceObj.locationMarkers.push(marker);
                    //set up the info window 
                    var infoWindow = new google.maps.InfoWindow({
                        content: '<h4>' + beerSpot.Name + '</h4>' +
                        '<br /> ' + beerSpot['Full Address'] +
                        '<br /> <a href="https://maps.google.com/?f=d&daddr=' + encodeURIComponent(beerSpot.Name + ',' + beerSpot['Full Address']) + '" target="_blank"><i class="fa fa-car"></i> Get Directions</a>'
                    });

                    //make the info window open when clicked 
                    //how to close?
                    marker.addListener('click', function () {
                        if (serviceObj.prev_infoWindow) {
                            serviceObj.prev_infoWindow.close();
                        }

                        serviceObj.prev_infoWindow = infoWindow;
                        infoWindow.open(serviceObj.map, marker);
                    });
                });

                //add events to map (will attempt, if events have loaded)
                serviceObj.addEventsToMap();

                //function to set up the find nearest beer spot button
                serviceObj.setUpFindNearest();
            },
            //var for the last-opened info window to be able to close it later
            prev_infoWindow: false,
            locationMarkers: [],
            events: [],
            addEventsToMap: function () {
                this.events.forEach(function (eventLocation) {
                    //set up the marker
                    var marker = new google.maps.Marker({
                        position: { lat: eventLocation.place.location.latitude, lng: eventLocation.place.location.longitude },
                        map: serviceObj.map,
                        title: eventLocation.name,
                        icon: './imgs/EventLocationIcon.png'
                    });
                    eventLocation.marker = marker;


                    //set up the info window 
                    var infoWindow = new google.maps.InfoWindow({
                        content: '<h4>' + eventLocation.name + '</h4>' +
                        '<br /> ' + facebookService.textShorten(eventLocation.description, 150) +
                        '<br /> ' +
                        //'<a href="https://maps.google.com/?f=d&daddr=' + encodeURIComponent(eventLocation.name + ',' + eventLocation.place.location.street, + ' ' + eventLocation.place.location.city) + '" target="_blank">Get Directions</a> ' +
                        '<a href="https://www.facebook.com/events/' + eventLocation.id + '" target="_blank">View event in FB</a>'
                    });
                    //make it accessible later
                    eventLocation.infoWindow = infoWindow;

                    //make the info window open when clicked 
                    //how to close?
                    marker.addListener('click', function () {
                        if (serviceObj.prev_infoWindow) {
                            serviceObj.prev_infoWindow.close();
                        }

                        serviceObj.prev_infoWindow = infoWindow;
                        infoWindow.open(serviceObj.map, marker);
                    });
                });
            },
            showInfoWindow: function (infoWindow, marker) {
                if (serviceObj.prev_infoWindow) {
                    serviceObj.prev_infoWindow.close();
                }

                serviceObj.prev_infoWindow = infoWindow;
                infoWindow.open(serviceObj.map, marker);
            },
            setUpFindNearest: function () {
                // if (navigator && navigator.geolocation) {
                //add button for current location and closest spot
                var controlDiv = document.createElement('div');
                // Set CSS for the control border.
                var controlUI = document.createElement('div');
                controlUI.style.backgroundColor = '#fff';
                controlUI.style.border = '2px solid #fff';
                controlUI.style.borderRadius = '3px';
                controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
                controlUI.style.cursor = 'pointer';
                controlUI.style.marginBottom = '22px';
                controlUI.style.textAlign = 'center';
                controlUI.title = 'Click to find the closest beer to you!';
                controlDiv.appendChild(controlUI);

                // Set CSS for the control interior.
                var controlText = document.createElement('div');
                controlText.style.color = 'rgb(25,25,25)';
                controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
                controlText.style.fontSize = '16px';
                controlText.style.lineHeight = '38px';
                controlText.style.paddingLeft = '5px';
                controlText.style.paddingRight = '5px';
                controlText.innerHTML = 'Find Closest';
                controlUI.appendChild(controlText);

                // Setup the click event listeners: simply set the map to Chicago.
                controlUI.addEventListener('click', function () {
                    serviceObj.findNearest();
                });
                controlDiv.index = 1;
                serviceObj.map.controls[google.maps.ControlPosition.TOP_CENTER].push(controlDiv);
                // }
                // else {
                //     console.log("Finding location not possible in this browser");
                // }
            },
            findNearest: function () {
                if (navigator && navigator.geolocation) {
                    wpid = navigator.geolocation.getCurrentPosition(geo_success, geo_failure);
                }
                else {
                    tryLocWithIP();
                }
            }
        };

        return serviceObj;
    }]);
    angular.module('SistersBrewApp').directive('sbBeersMap', ['googleMapsService', '$document', function (googleMapsService, $document) {
        return {
            restrict: 'E',
            templateUrl: 'js/directives/beersmap.html',
            link: function (scope, element, attrs) {
                //var that will hold the watcher for google api to load (if needed/google hasn't loaded yet, pretty rare as its quick)
                var googleWatcher = false;

                //function to set up map
                if (typeof (google) != 'undefined' && google != null) {
                    googleMapsService.initiateMap();
                } else {
                    // alert the user
                    console.log("google not ready yet");
                    //set up a watch
                    googleWatcher = $scope.$watch(function () {
                        return $window.google;
                    }, function (newVal, oldVal) {
                        if (typeof (google) != 'undefined' && google != null) {
                            // FB API loaded, make calls
                            console.log("google is ready");
                            //set up map
                            googleMapsService.initiateMap();
                            //close the watcher
                            googleWatcher();
                        }
                    });
                }
            }
        };
    }]);
})();

places = [
    {
        "Name": "B-Amsterdam",
        "Address": "Johan Huizingalaan 763A",
        "City": "Amsterdam",
        "Full Address": "Johan Huizingalaan 763A Amsterdam ",
        "Latitude": 52.3431438,
        "Longitude": 4.8291689
    },
    {
        "Name": "De Bierkoning",
        "Address": "Paleisstraat 125",
        "City": "Amsterdam",
        "Full Address": "Paleisstraat 125 Amsterdam ",
        "Latitude": 52.3722357,
        "Longitude": 4.8898476
    },
    {
        "Name": "De Biertuin",
        "Address": "Linnaeusstraat 29",
        "City": "Amsterdam",
        "Full Address": "Linnaeusstraat 29 Amsterdam ",
        "Latitude": 52.362325,
        "Longitude": 4.9242439
    },
    {
        "Name": "Café Gollem",
        "Address": "Daniel Stalpertstraat 74",
        "City": "Amsterdam",
        "Full Address": "Daniel Stalpertstraat 74 Amsterdam ",
        "Latitude": 52.3560694,
        "Longitude": 4.8908754
    },
    {
        "Name": "Craft & Draft",
        "Address": "Overtoom 417",
        "City": "Amsterdam",
        "Full Address": "Overtoom 417 Amsterdam ",
        "Latitude": 52.3590686,
        "Longitude": 4.8611688
    },
    {
        "Name": "Delirium Café Amsterdam",
        "Address": "Piet Heinkade 4-6-8",
        "City": "Amsterdam",
        "Full Address": "Piet Heinkade 4-6-8 Amsterdam ",
        "Latitude": 52.3775509,
        "Longitude": 4.912677
    },
    {
        "Name": "In de Wildeman",
        "Address": "Kolksteeg 3",
        "City": "Amsterdam",
        "Full Address": "Kolksteeg 3 Amsterdam ",
        "Latitude": 52.3761528,
        "Longitude": 4.8951579
    },
    {
        "Name": "Liquorstore The Pint",
        "Address": "Middenweg 57a",
        "City": "Amsterdam",
        "Full Address": "Middenweg 57a Amsterdam ",
        "Latitude": 52.3539459,
        "Longitude": 4.9305255
    },
    {
        "Name": "Proeflokaal Arendsnest",
        "Address": "Herengracht 90",
        "City": "Amsterdam",
        "Full Address": "Herengracht 90 Amsterdam ",
        "Latitude": 52.3767056,
        "Longitude": 4.88937789999999
    },
    {
        "Name": "Restaurant Dwars",
        "Address": "Egelantiersstraat 24",
        "City": "Amsterdam",
        "Full Address": "Egelantiersstraat 24 Amsterdam ",
        "Latitude": 52.3771444,
        "Longitude": 4.884261
    },
    {
        "Name": "Slijterij 't Fust",
        "Address": "Bilderdijkstraat 203",
        "City": "Amsterdam",
        "Full Address": "Bilderdijkstraat 203 Amsterdam ",
        "Latitude": 52.3663806,
        "Longitude": 4.8730292
    },
    {
        "Name": "Sterk De Clercqstraat",
        "Address": "De Clercqstraat 1-9",
        "City": "Amsterdam",
        "Full Address": "De Clercqstraat 1-9 Amsterdam ",
        "Latitude": 52.3716732,
        "Longitude": 4.8738775
    },
    {
        "Name": "Slijterij Ton Overmars",
        "Address": "Timorplein 62",
        "City": "Amsterdam",
        "Full Address": "Timorplein 62 Amsterdam ",
        "Latitude": 52.3652376,
        "Longitude": 4.9360324
    },
    {
        "Name": "Studio/K",
        "Address": "Hoofddorpplein 11",
        "City": "Amsterdam",
        "Full Address": "Hoofddorpplein 11 Amsterdam ",
        "Latitude": 52.3508942,
        "Longitude": 4.8499599
    },
    {
        "Name": "Tabak's Notenbar",
        "Address": "Rijnstraat 132H",
        "City": "Amsterdam",
        "Full Address": "Rijnstraat 132H Amsterdam ",
        "Latitude": 52.3436262,
        "Longitude": 4.9060245
    },
    {
        "Name": "TAP ZUID",
        "Address": "Maasstraat 70",
        "City": "Amsterdam",
        "Full Address": "Maasstraat 70 Amsterdam ",
        "Latitude": 52.3452375,
        "Longitude": 4.8948366
    },
    {
        "Name": "Slijterij-Wijnhandel W. van Schaik",
        "Address": "Dorpsstraat 32",
        "City": "Aalsmeer",
        "Full Address": "Dorpsstraat 32 Aalsmeer ",
        "Latitude": 52.2703925,
        "Longitude": 4.7479555
    },
    {
        "Name": "Bierenplezier",
        "Address": "Schippergarage 13",
        "City": "Almere",
        "Full Address": "Schippergarage 13 Almere ",
        "Latitude": 52.3507849,
        "Longitude": 5.2647016
    },
    {
        "Name": "Goed Gebrouwen",
        "Address": "Zadelmakerstraat 18",
        "City": "Almere",
        "Full Address": "Zadelmakerstraat 18 Almere ",
        "Latitude": 52.3685168,
        "Longitude": 5.2160172
    },
    {
        "Name": "Biercafé De Natte",
        "Address": "Julianastraat 19",
        "City": "Alphen aan Den Rijn",
        "Full Address": "Julianastraat 19 Alphen aan Den Rijn ",
        "Latitude": 52.1273336999999,
        "Longitude": 4.6615631
    },
    {
        "Name": "Hendrick's Pub",
        "Address": "Prins Hendrikstraat 119",
        "City": "Alphen aan Den Rijn",
        "Full Address": "Prins Hendrikstraat 119 Alphen aan Den Rijn ",
        "Latitude": 52.1244874,
        "Longitude": 4.6620474
    },
    {
        "Name": "Jelfra",
        "Address": "Van Foreestlaan 5",
        "City": "Alphen aan Den Rijn",
        "Full Address": "Van Foreestlaan 5 Alphen aan Den Rijn ",
        "Latitude": 52.1374816,
        "Longitude": 4.6471123
    },
    {
        "Name": "Het Lokaal",
        "Address": "Oliemolenhof 90",
        "City": "Amersfoort",
        "Full Address": "Oliemolenhof 90 Amersfoort ",
        "Latitude": 52.1601165,
        "Longitude": 5.3801765
    },
    {
        "Name": "Café De Beugel",
        "Address": "Duizelsteeg 20",
        "City": "Arnhem",
        "Full Address": "Duizelsteeg 20 Arnhem ",
        "Latitude": 51.9819774,
        "Longitude": 5.9041521
    },
    {
        "Name": "Café Den Koopman",
        "Address": "Korenmarkt 12",
        "City": "Arnhem",
        "Full Address": "Korenmarkt 12 Arnhem ",
        "Latitude": 51.9827407,
        "Longitude": 5.9042545
    },
    {
        "Name": "Look eten & drinken",
        "Address": "Kastanjelaan 1",
        "City": "Arnhem",
        "Full Address": "Kastanjelaan 1 Arnhem ",
        "Latitude": 51.9824858,
        "Longitude": 5.9191367
    },
    {
        "Name": "Restaurant Benjamin",
        "Address": "Wezenstraat 3",
        "City": "Arnhem",
        "Full Address": "Wezenstraat 3 Arnhem ",
        "Latitude": 51.9823685,
        "Longitude": 5.9083432
    },
    {
        "Name": "Slijterij van Pernis",
        "Address": "Prinsessestraat 34",
        "City": "Arnhem",
        "Full Address": "Prinsessestraat 34 Arnhem ",
        "Latitude": 51.9797974,
        "Longitude": 5.9193377
    },
    {
        "Name": "TAPE Espressobar, Cafe & Expo Arnhem",
        "Address": "Hommelstraat 66",
        "City": "Arnhem",
        "Full Address": "Hommelstraat 66 Arnhem ",
        "Latitude": 51.9854642,
        "Longitude": 5.91442619999999
    },
    {
        "Name": "Wijnhandel Barrique",
        "Address": "Pauwstraat 9",
        "City": "Arnhem",
        "Full Address": "Pauwstraat 9 Arnhem ",
        "Latitude": 51.9823499,
        "Longitude": 5.90571199999999
    },
    {
        "Name": "Café Broer & Zus",
        "Address": "Schans 10",
        "City": "Beverwijk",
        "Full Address": "Schans 10 Beverwijk ",
        "Latitude": 52.4837546,
        "Longitude": 4.66191749999999
    },
    {
        "Name": "Wijnhuis & Slijterij Meerwijck",
        "Address": "Meerstraat 96",
        "City": "Beverwijk",
        "Full Address": "Meerstraat 96 Beverwijk ",
        "Latitude": 52.4808616,
        "Longitude": 4.6591533
    },
    {
        "Name": "Speciaalbierwinkel",
        "Address": "Overtocht 6",
        "City": "Bodegraven",
        "Full Address": "Overtocht 6 Bodegraven ",
        "Latitude": 52.0844294,
        "Longitude": 4.7448836
    },
    {
        "Name": "Leo's Drankenhuis",
        "Address": "Zijde 4 A",
        "City": "Boskoop",
        "Full Address": "Zijde 4 A Boskoop ",
        "Latitude": 52.0742328,
        "Longitude": 4.65808139999999
    },
    {
        "Name": "Wijnhandel A.G. van Uden",
        "Address": "Kruisstraat 5",
        "City": "Boxtel",
        "Full Address": "Kruisstraat 5 Boxtel ",
        "Latitude": 51.5882959,
        "Longitude": 5.32597899999999
    },
    {
        "Name": "Het Bierhuis Breda",
        "Address": "Van Goorstraat 5",
        "City": "Breda",
        "Full Address": "Van Goorstraat 5 Breda ",
        "Latitude": 51.5821306,
        "Longitude": 4.7778955
    },
    {
        "Name": "Slijterij Spraakwater",
        "Address": "Brabantplein 6",
        "City": "Breda",
        "Full Address": "Brabantplein 6 Breda ",
        "Latitude": 51.5908409,
        "Longitude": 4.79956
    },
    {
        "Name": "Gall & Gall",
        "Address": "Markt 8",
        "City": "Breukelen",
        "Full Address": "Markt 8 Breukelen ",
        "Latitude": 52.1709599,
        "Longitude": 5.00371519999999
    },
    {
        "Name": "IKOOK!",
        "Address": "Straatweg 94",
        "City": "Breukelen",
        "Full Address": "Straatweg 94 Breukelen ",
        "Latitude": 52.171398,
        "Longitude": 5.002229
    },
    {
        "Name": "Same Same Restaurant",
        "Address": "Herenstraat 25",
        "City": "Breukelen",
        "Full Address": "Herenstraat 25 Breukelen ",
        "Latitude": 52.1738963,
        "Longitude": 5.0024085
    },
    {
        "Name": "Buitenplaats Slangevegt",
        "Address": "Straatweg 40",
        "City": "Breukelen",
        "Full Address": "Straatweg 40 Breukelen ",
        "Latitude": 52.1580934,
        "Longitude": 5.0186637
    },
    {
        "Name": "Zuivelland Breukelen",
        "Address": "Kerkbrink 15e",
        "City": "Breukelen",
        "Full Address": "Kerkbrink 15e Breukelen ",
        "Latitude": 52.1721639,
        "Longitude": 5.0025765
    },
    {
        "Name": "Flink Gegist",
        "Address": "Oosteinde 227",
        "City": "Delft",
        "Full Address": "Oosteinde 227 Delft ",
        "Latitude": 52.0123458,
        "Longitude": 4.3626055
    },
    {
        "Name": "De Wilde Hollander",
        "Address": "Markt 33",
        "City": "Delft",
        "Full Address": "Markt 33 Delft ",
        "Latitude": 52.0111874,
        "Longitude": 4.3587661
    },
    {
        "Name": "Slijterij-Wijnhandel W. van Schaik",
        "Address": "Mereveldplein 19",
        "City": "De Meern",
        "Full Address": "Mereveldplein 19 De Meern ",
        "Latitude": 52.0793197,
        "Longitude": 5.03747329999999
    },
    {
        "Name": "Bottleshop Eindhoven",
        "Address": "Geldropseweg 86a",
        "City": "Eindhoven",
        "Full Address": "Geldropseweg 86a Eindhoven ",
        "Latitude": 51.4330471,
        "Longitude": 5.48951799999999
    },
    {
        "Name": "De Bierbrigadier",
        "Address": "Bergstraat 41",
        "City": "Eindhoven",
        "Full Address": "Bergstraat 41 Eindhoven ",
        "Latitude": 51.4363384,
        "Longitude": 5.4769415
    },
    {
        "Name": "Mitra Slijterij M. van Bergen",
        "Address": "Hurksestraat 44",
        "City": "Eindhoven",
        "Full Address": "Hurksestraat 44 Eindhoven ",
        "Latitude": 51.4362743,
        "Longitude": 5.4297328
    },
    {
        "Name": "Burg Bieren",
        "Address": "Putterweg 45",
        "City": "Ermelo",
        "Full Address": "Putterweg 45 Ermelo ",
        "Latitude": 52.2968556,
        "Longitude": 5.6312351
    },
    {
        "Name": "Biercafé De Goudse Eend",
        "Address": "Wilhelminastraat 66",
        "City": "Gouda",
        "Full Address": "Wilhelminastraat 66 Gouda ",
        "Latitude": 52.0132206,
        "Longitude": 4.7123857
    },
    {
        "Name": "Drankenservice Gouda",
        "Address": "Willem en Marialaan 22",
        "City": "Gouda",
        "Full Address": "Willem en Marialaan 22 Gouda ",
        "Latitude": 52.018964,
        "Longitude": 4.716625
    },
    {
        "Name": "Dranken- en Wijnhandel Versluis",
        "Address": "Suezkade 48",
        "City": "s Gravenhage",
        "Full Address": "Suezkade 48 s Gravenhage ",
        "Latitude": 52.0785815,
        "Longitude": 4.285945
    },
    {
        "Name": "Liquor Store de filosoof | Slijterij de filosoof | Slijterij Den Haag",
        "Address": "Papestraat 5",
        "City": "s Gravenhage",
        "Full Address": "Papestraat 5 s Gravenhage ",
        "Latitude": 52.0792735,
        "Longitude": 4.3082782
    },
    {
        "Name": "Café De Keizer",
        "Address": "Keizerstraat 14",
        "City": "Gorinchem",
        "Full Address": "Keizerstraat 14 Gorinchem ",
        "Latitude": 51.830421,
        "Longitude": 4.9786945
    },
    {
        "Name": "Café Pavlov",
        "Address": "Langendijk 23",
        "City": "Gorinchem",
        "Full Address": "Langendijk 23 Gorinchem ",
        "Latitude": 51.8295409,
        "Longitude": 4.9763234
    },
    {
        "Name": "Slijterij Madeira",
        "Address": "Vaartplein 5",
        "City": "s-Gravenzande",
        "Full Address": "Vaartplein 5 s-Gravenzande ",
        "Latitude": 52.0037151999999,
        "Longitude": 4.162399
    },
    {
        "Name": "Belgisch Café De Pintelier",
        "Address": "Kleine Kromme Elleboog 9",
        "City": "Groningen",
        "Full Address": "Kleine Kromme Elleboog 9 Groningen ",
        "Latitude": 53.2186168,
        "Longitude": 6.561677
    },
    {
        "Name": "Café De Koffer",
        "Address": "Nieuwe Blekerstraat 1",
        "City": "Groningen",
        "Full Address": "Nieuwe Blekerstraat 1 Groningen ",
        "Latitude": 53.2163062,
        "Longitude": 6.5553413
    },
    {
        "Name": "Café Singelier",
        "Address": "Coendersweg 44",
        "City": "Groningen",
        "Full Address": "Coendersweg 44 Groningen ",
        "Latitude": 53.1995356,
        "Longitude": 6.5829911
    },
    {
        "Name": "Van Erp Dranken",
        "Address": "Grote Kromme Elleboog 16",
        "City": "Groningen",
        "Full Address": "Grote Kromme Elleboog 16 Groningen ",
        "Latitude": 53.2179538,
        "Longitude": 6.56225019999999
    },
    {
        "Name": "Slijterij Groningen",
        "Address": "Vismarkt 36",
        "City": "Groningen",
        "Full Address": "Vismarkt 36 Groningen ",
        "Latitude": 53.2170455,
        "Longitude": 6.5652731
    },
    {
        "Name": "De Roemer Groningen",
        "Address": "A=straat 13",
        "City": "Groningen",
        "Full Address": "A=straat 13 Groningen ",
        "Latitude": 53.2166781,
        "Longitude": 6.55805589999999
    },
    {
        "Name": "bij Tessels",
        "Address": "Tesselschadeplein 6",
        "City": "Haarlem",
        "Full Address": "Tesselschadeplein 6 Haarlem ",
        "Latitude": 52.4169025,
        "Longitude": 4.6499157
    },
    {
        "Name": "Melger's Wijn en Dranken",
        "Address": "Barrevoetestraat 15",
        "City": "Haarlem",
        "Full Address": "Barrevoetestraat 15 Haarlem ",
        "Latitude": 52.380014,
        "Longitude": 4.630825
    },
    {
        "Name": "Proeflokaal In den Uiver",
        "Address": "Riviervismarkt 13",
        "City": "Haarlem",
        "Full Address": "Riviervismarkt 13 Haarlem ",
        "Latitude": 52.3812548999999,
        "Longitude": 4.6381758
    },
    {
        "Name": "Uiltje Bar",
        "Address": "Zijlstraat 18",
        "City": "Haarlem",
        "Full Address": "Zijlstraat 18 Haarlem ",
        "Latitude": 52.382878,
        "Longitude": 4.6306521
    },
    {
        "Name": "Slijterij-Wijnhandel Tjokko",
        "Address": "Dorpsstraat 75",
        "City": "Harmelen",
        "Full Address": "Dorpsstraat 75 Harmelen ",
        "Latitude": 52.0914937999999,
        "Longitude": 4.9634003
    },
    {
        "Name": "Slijterij Staal úw topSlijter",
        "Address": "Raadhuisplein 40b",
        "City": "Heerhugowaard",
        "Full Address": "Raadhuisplein 40b Heerhugowaard ",
        "Latitude": 52.6705029,
        "Longitude": 4.84343149999999
    },
    {
        "Name": "De Wijnhoeve",
        "Address": "Kapelstraat 29",
        "City": "Heeze",
        "Full Address": "Kapelstraat 29 Heeze ",
        "Latitude": 51.3825973999999,
        "Longitude": 5.5808168
    },
    {
        "Name": "Kaashuis Tromp",
        "Address": "Winkelhof 't Loo 23",
        "City": "Heiloo",
        "Full Address": "Winkelhof 't Loo 23 Heiloo ",
        "Latitude": 52.6012341,
        "Longitude": 4.7004931
    },
    {
        "Name": "Het Biermoment",
        "Address": "Schorfhoeve 4",
        "City": "Helmond",
        "Full Address": "Schorfhoeve 4 Helmond ",
        "Latitude": 51.452939,
        "Longitude": 5.6098598
    },
    {
        "Name": "Café Bar le Duc",
        "Address": "Korenbrugstraat 5",
        "City": "s-Hertogenbosch",
        "Full Address": "Korenbrugstraat 5 s-Hertogenbosch ",
        "Latitude": 51.6898166999999,
        "Longitude": 5.30031279999999
    },
    {
        "Name": "Proeflokaal 't paultje",
        "Address": "Lepelstraat 31A",
        "City": "s-Hertogenbosch",
        "Full Address": "Lepelstraat 31A s-Hertogenbosch ",
        "Latitude": 51.6901528,
        "Longitude": 5.29961249999999
    },
    {
        "Name": "Jonghe Graef van Buuren",
        "Address": "Laanstraat 37",
        "City": "Hilversum",
        "Full Address": "Laanstraat 37 Hilversum ",
        "Latitude": 52.2227147,
        "Longitude": 5.1746287
    },
    {
        "Name": "Kaaskamer Hooi en Klomp",
        "Address": "Hilvertsweg 133",
        "City": "Hilversum",
        "Full Address": "Hilvertsweg 133 Hilversum ",
        "Latitude": 52.2152008,
        "Longitude": 5.1680666
    },
    {
        "Name": "A Tutta Birra Di Mencucci Fabio",
        "Address": "Via Campo Boario 11",
        "City": "Senigallia AN, Italy",
        "Full Address": "Via Campo Boario 11 Senigallia AN, Italy ",
        "Latitude": 43.7151913,
        "Longitude": 13.2120082
    },
    {
        "Name": "Zabumba",
        "Address": "Via Marchetti 7",
        "City": "Senigallia AN, Italy",
        "Full Address": "Via Marchetti 7 Senigallia AN, Italy ",
        "Latitude": 43.713102,
        "Longitude": 13.217057
    },
    {
        "Name": "Slijterij De Hoorn",
        "Address": "Hoornesplein 53",
        "City": "Katwijk aan Zee",
        "Full Address": "Hoornesplein 53 Katwijk aan Zee ",
        "Latitude": 52.2061867,
        "Longitude": 4.4182211
    },
    {
        "Name": "Slijterij De Hoorn",
        "Address": "Meeuwenlaan 45",
        "City": "Katwijk aan Zee",
        "Full Address": "Meeuwenlaan 45 Katwijk aan Zee ",
        "Latitude": 52.1996581999999,
        "Longitude": 4.4061244
    },
    {
        "Name": "Slijterij Drinks & Gifts",
        "Address": "Heiligeweg 15a",
        "City": "Krommenie",
        "Full Address": "Heiligeweg 15a Krommenie ",
        "Latitude": 52.5002706,
        "Longitude": 4.7672175
    },
    {
        "Name": "Bierschuur Laren",
        "Address": "Zevenend 77",
        "City": "Laren",
        "Full Address": "Zevenend 77 Laren ",
        "Latitude": 52.2502229,
        "Longitude": 5.23044209999999
    },
    {
        "Name": "Bar Bruut",
        "Address": "Steenstraat 22",
        "City": "Leiden",
        "Full Address": "Steenstraat 22 Leiden ",
        "Latitude": 52.1628792,
        "Longitude": 4.48470099999999
    },
    {
        "Name": "Belgisch Bier Café Olivier",
        "Address": "Hooigracht 23",
        "City": "Leiden",
        "Full Address": "Hooigracht 23 Leiden ",
        "Latitude": 52.1575487,
        "Longitude": 4.4956865
    },
    {
        "Name": "Bierwinkel Leiden",
        "Address": "Hartesteeg 9",
        "City": "Leiden",
        "Full Address": "Hartesteeg 9 Leiden ",
        "Latitude": 52.1571248,
        "Longitude": 4.4941735
    },
    {
        "Name": "Drankenhandel Leiden",
        "Address": "Zeemanlaan 22B",
        "City": "Leiden",
        "Full Address": "Zeemanlaan 22B Leiden ",
        "Latitude": 52.1499558,
        "Longitude": 4.4958103
    },
    {
        "Name": "Eeterij en Proeverij \"Het Stadsbrouwhuis\"",
        "Address": "Aalmarkt 1",
        "City": "Leiden",
        "Full Address": "Aalmarkt 1 Leiden ",
        "Latitude": 52.160075,
        "Longitude": 4.48875119999999
    },
    {
        "Name": "Lemmy's Biercafé",
        "Address": "Morsstraat 24",
        "City": "Leiden",
        "Full Address": "Morsstraat 24 Leiden ",
        "Latitude": 52.16187,
        "Longitude": 4.4836873
    },
    {
        "Name": "Slijterij Leiden",
        "Address": "Diamantplein 1",
        "City": "Leiden",
        "Full Address": "Diamantplein 1 Leiden ",
        "Latitude": 52.1567953,
        "Longitude": 4.465123
    },
    {
        "Name": "De Burgemeester",
        "Address": "Raadhuisstraat 17",
        "City": "Linschoten",
        "Full Address": "Raadhuisstraat 17 Linschoten ",
        "Latitude": 52.0619447,
        "Longitude": 4.91452119999999
    },
    {
        "Name": "Eterij De Drie Gekroonde Laarsjes",
        "Address": "Rijksstraatweg 106",
        "City": "Loenen a/d Vecht",
        "Full Address": "Rijksstraatweg 106 Loenen a/d Vecht ",
        "Latitude": 52.20901,
        "Longitude": 5.02150529999999
    },
    {
        "Name": "Restaurant 't Amsterdammertje",
        "Address": "Rijksstraatweg 119",
        "City": "Loenen a/d Vecht",
        "Full Address": "Rijksstraatweg 119 Loenen a/d Vecht ",
        "Latitude": 52.2096261,
        "Longitude": 5.0214167
    },
    {
        "Name": "Restaurant Tante Koosje",
        "Address": "Kerkstraat 1",
        "City": "Loenen a/d Vecht",
        "Full Address": "Kerkstraat 1 Loenen a/d Vecht ",
        "Latitude": 52.2091062,
        "Longitude": 5.0235382
    },
    {
        "Name": "Restaurant Opbuuren",
        "Address": "De Hoopkade 51",
        "City": "Maarssen",
        "Full Address": "De Hoopkade 51 Maarssen ",
        "Latitude": 52.1286515,
        "Longitude": 5.05845119999999
    },
    {
        "Name": "Slijterij-Wijnhandel W. van Schaik",
        "Address": "Johannes Vermeerstraat 29",
        "City": "Maarssen",
        "Full Address": "Johannes Vermeerstraat 29 Maarssen ",
        "Latitude": 52.1426568,
        "Longitude": 5.0408363
    },
    {
        "Name": "Bierboetiek",
        "Address": "Professor ter Veenweg 11",
        "City": "Middenmeer",
        "Full Address": "Professor ter Veenweg 11 Middenmeer ",
        "Latitude": 52.8076115999999,
        "Longitude": 4.9982317
    },
    {
        "Name": "De Bottelarij",
        "Address": "Margrietstraat 65",
        "City": "Mierlo",
        "Full Address": "Margrietstraat 65 Mierlo ",
        "Latitude": 51.4430197999999,
        "Longitude": 5.6184897
    },
    {
        "Name": "Slijterij-Wijnhandel W. van Schaik",
        "Address": "Hoogstraat 14",
        "City": "Montfoort",
        "Full Address": "Hoogstraat 14 Montfoort ",
        "Latitude": 52.0461573,
        "Longitude": 4.9494064
    },
    {
        "Name": "Café Piet Huisman",
        "Address": "Sint Jacobslaan 30",
        "City": "Nijmegen",
        "Full Address": "Sint Jacobslaan 30 Nijmegen ",
        "Latitude": 51.8226334999999,
        "Longitude": 5.8511734
    },
    {
        "Name": "De Bierhoeder",
        "Address": "Bloemerstraat 86",
        "City": "Nijmegen",
        "Full Address": "Bloemerstraat 86 Nijmegen ",
        "Latitude": 51.8453818,
        "Longitude": 5.8612521
    },
    {
        "Name": "Santhe Dranken",
        "Address": "Havenstraat 12",
        "City": "Noordwijkerhout",
        "Full Address": "Havenstraat 12 Noordwijkerhout ",
        "Latitude": 52.2621856,
        "Longitude": 4.493131
    },
    {
        "Name": "De Kaapse Brouwers",
        "Address": "Veerlaan 19D",
        "City": "Rotterdam",
        "Full Address": "Veerlaan 19D Rotterdam ",
        "Latitude": 51.9018402,
        "Longitude": 4.4851426
    },
    {
        "Name": "Plan B",
        "Address": "s-Gravendijkwal 135",
        "City": "Rotterdam",
        "Full Address": "s-Gravendijkwal 135 Rotterdam ",
        "Latitude": 51.9131870999999,
        "Longitude": 4.4634
    },
    {
        "Name": "In de Hoftuin",
        "Address": "Anjelierenstraat 13",
        "City": "Rijnsburg",
        "Full Address": "Anjelierenstraat 13 Rijnsburg ",
        "Latitude": 52.1915243,
        "Longitude": 4.44255969999999
    },
    {
        "Name": "Belgisch Bier Café Olivier",
        "Address": "Achter Clarenburg 6a",
        "City": "Utrecht",
        "Full Address": "Achter Clarenburg 6a Utrecht ",
        "Latitude": 52.0906254999999,
        "Longitude": 5.1156592
    },
    {
        "Name": "Bert's Bierhuis",
        "Address": "Biltstraat 46",
        "City": "Utrecht",
        "Full Address": "Biltstraat 46 Utrecht ",
        "Latitude": 52.0952712,
        "Longitude": 5.1284107
    },
    {
        "Name": "BuurtBier",
        "Address": "Dickenslaan 56/1",
        "City": "Utrecht",
        "Full Address": "Dickenslaan 56/1 Utrecht ",
        "Latitude": 52.0888123,
        "Longitude": 5.08107119999999
    },
    {
        "Name": "Café de Zaak",
        "Address": "Korte Minrebroederstraat 9",
        "City": "Utrecht",
        "Full Address": "Korte Minrebroederstraat 9 Utrecht ",
        "Latitude": 52.0921386,
        "Longitude": 5.1203224
    },
    {
        "Name": "Guusjes eten en drinken",
        "Address": "`s Gravezandestraat 27",
        "City": "Utrecht",
        "Full Address": "`s Gravezandestraat 27 Utrecht ",
        "Latitude": 52.0999922,
        "Longitude": 5.1213342
    },
    {
        "Name": "Hooi",
        "Address": "Burgemeester Reigerstraat 25",
        "City": "Utrecht",
        "Full Address": "Burgemeester Reigerstraat 25 Utrecht ",
        "Latitude": 52.0897626,
        "Longitude": 5.1348421
    },
    {
        "Name": "Kafé België",
        "Address": "Oudegracht 196",
        "City": "Utrecht",
        "Full Address": "Oudegracht 196 Utrecht ",
        "Latitude": 52.089033,
        "Longitude": 5.1215853
    },
    {
        "Name": "Key West Beachhouse",
        "Address": "Strandboulevard 222",
        "City": "Utrecht",
        "Full Address": "Strandboulevard 222 Utrecht ",
        "Latitude": 52.1193082,
        "Longitude": 5.0246507
    },
    {
        "Name": "Klimmuur Utrecht",
        "Address": "Vlampijpstraat 79",
        "City": "Utrecht",
        "Full Address": "Vlampijpstraat 79 Utrecht ",
        "Latitude": 52.1046706,
        "Longitude": 5.0846718
    },
    {
        "Name": "MCD Utrecht",
        "Address": "Abel Tasmanstraat 13",
        "City": "Utrecht",
        "Full Address": "Abel Tasmanstraat 13 Utrecht ",
        "Latitude": 52.0890695999999,
        "Longitude": 5.0952864
    },
    {
        "Name": "Parc388",
        "Address": "Vleutenseweg 388",
        "City": "Utrecht",
        "Full Address": "Vleutenseweg 388 Utrecht ",
        "Latitude": 52.0941022,
        "Longitude": 5.0900241
    },
    {
        "Name": "Slijterij Besseling",
        "Address": "Kanaalstraat 65",
        "City": "Utrecht",
        "Full Address": "Kanaalstraat 65 Utrecht ",
        "Latitude": 52.0917122,
        "Longitude": 5.1029372
    },
    {
        "Name": "Stan & Co",
        "Address": "Ganzenmarkt 16A",
        "City": "Utrecht",
        "Full Address": "Ganzenmarkt 16A Utrecht ",
        "Latitude": 52.0923514,
        "Longitude": 5.119383
    },
    {
        "Name": "Ubica Utrecht",
        "Address": "Ganzenmarkt 24-26",
        "City": "Utrecht",
        "Full Address": "Ganzenmarkt 24-26 Utrecht ",
        "Latitude": 52.0925477,
        "Longitude": 5.1196737
    },
    {
        "Name": "De Fantast",
        "Address": "Frans van Beststraat 9",
        "City": "Valkenswaard",
        "Full Address": "Frans van Beststraat 9 Valkenswaard ",
        "Latitude": 51.3527975,
        "Longitude": 5.4642019
    },
    {
        "Name": "Bierkado.nl",
        "Address": "Newtonstraat 19",
        "City": "Veenendaal",
        "Full Address": "Newtonstraat 19 Veenendaal ",
        "Latitude": 52.0370462,
        "Longitude": 5.5764018
    },
    {
        "Name": "Exbeerience",
        "Address": "Zandstraat 113",
        "City": "Veenendaal",
        "Full Address": "Zandstraat 113 Veenendaal ",
        "Latitude": 52.0291721,
        "Longitude": 5.5508406
    },
    {
        "Name": "Beej Benders",
        "Address": "Monseigneur Nolensplein 54",
        "City": "Venlo",
        "Full Address": "Monseigneur Nolensplein 54 Venlo ",
        "Latitude": 51.3726521,
        "Longitude": 6.1718771
    },
    {
        "Name": "Slijterij-Wijnhandel W. van Schaik",
        "Address": "Vijfheerenlanden 544",
        "City": "Vianen",
        "Full Address": "Vijfheerenlanden 544 Vianen ",
        "Latitude": 51.9942565,
        "Longitude": 5.102363
    },
    {
        "Name": "Voorburgse Bierwinkel",
        "Address": "Wielemakersslop 8",
        "City": "Voorburg",
        "Full Address": "Wielemakersslop 8 Voorburg ",
        "Latitude": 52.0685578,
        "Longitude": 4.3651358
    },
    {
        "Name": "Slijterij Adegeest",
        "Address": "Van Beethovenlaan 17",
        "City": "Voorschoten",
        "Full Address": "Van Beethovenlaan 17 Voorschoten ",
        "Latitude": 52.1335385999999,
        "Longitude": 4.4525649
    },
    {
        "Name": "De Bierboutique",
        "Address": "Maaspoort 12",
        "City": "Weert",
        "Full Address": "Maaspoort 12 Weert ",
        "Latitude": 51.2518346,
        "Longitude": 5.7103833
    },
    {
        "Name": "De Zwart Dranken & Delicatessen",
        "Address": "Herenweg 35",
        "City": "Wilnis",
        "Full Address": "Herenweg 35 Wilnis ",
        "Latitude": 52.1944852,
        "Longitude": 4.8979459
    },
    {
        "Name": "Drank van Nap",
        "Address": "La Fontaineplein 26",
        "City": "Woerden",
        "Full Address": "La Fontaineplein 26 Woerden ",
        "Latitude": 52.0857328,
        "Longitude": 4.9041663
    },
    {
        "Name": "Slijterij Vonk",
        "Address": "Tuiniersstraat 8",
        "City": "Zaandam",
        "Full Address": "Tuiniersstraat 8 Zaandam ",
        "Latitude": 52.4394734,
        "Longitude": 4.8296505
    },
    {
        "Name": "Bierwinkel Zeist",
        "Address": "1e Hogeweg 160",
        "City": "Zeist",
        "Full Address": "1e Hogeweg 160 Zeist ",
        "Latitude": 52.08494,
        "Longitude": 5.24172489999999
    },
    {
        "Name": "de Mol DrankenSpecialist",
        "Address": "Laan van Cattenbroeck 7",
        "City": "Zeist",
        "Full Address": "Laan van Cattenbroeck 7 Zeist ",
        "Latitude": 52.0785602,
        "Longitude": 5.2287678
    }
];