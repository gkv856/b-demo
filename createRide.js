
var originInput = document.getElementById('origin-input');
var destinationInput = document.getElementById('destination-input');
var directionsService;
var directionsRenderer;
var originAutocomplete = new google.maps.places.Autocomplete(originInput);

// Specify just the place data fields that you need.
// originAutocomplete.setFields(['place_id']);

var destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput);

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center: {lat: 20.5937, lng: 78.9629}  // India.
    });
    getDeviceGeoLocation(map);

    directionsService = new google.maps.DirectionsService;
    directionsRenderer = new google.maps.DirectionsRenderer({
        draggable: true,
        map: map,
        //panel: document.getElementById('right-panel')
    });

    directionsRenderer.addListener('directions_changed', function() {
        directionsResult = directionsRenderer.getDirections();
        computeTotalDistance(directionsResult);

    });

    var directionsRequested = {};
    displayRoute(directionsRequested, directionsService, directionsRenderer);

    originAutocomplete = new google.maps.places.Autocomplete(originInput);

    destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput);


}

//this function calculates path between start and end point
function findRouteOnMyMap(){

    var place = originAutocomplete.getPlace();
    originPlaceId = place.place_id;

    place = destinationAutocomplete.getPlace();
    destinationPlaceId = place.place_id;

    var directionsRequested = {
        // note we are passing placeid and not textual name of place or lat or lng
        origin: {'placeId': originPlaceId},
        destination: {'placeId': destinationPlaceId},
        //waypoints: [{location: 'Adelaide, SA'}, {location: 'Broken Hill, NSW'}],
        travelMode: 'DRIVING',

    };
    displayRoute(directionsRequested, directionsService, directionsRenderer);
}


function displayRoute(directionsRequested, service, display) {
    //service.route takes 2 inputs route options and a function re work on the response from gmap
    service.route(directionsRequested, function(response, status){
        if (status === 'OK') {
            display.setDirections(response);
            //just to verify things are same
            //document.getElementById('dets').innerHTML =
            document.getElementById("ride_details").value = getJSONData("DRIVING", response);
            //document.getElementById("collist1").innerHTML = document.getElementById("ride_details").value
        }
        else {
            alert('Could not display directions due to: ' + status);
        }
    });
}

// this function manually converts the google map objects to JSON
function getJSONData (drivingModeUsed, directionsResult) {

        var travelMode = drivingModeUsed;
        var myroute = directionsResult.routes[0].legs[0];
        var copyrights = directionsResult.routes[0].copyrights;
        var startLat = myroute.start_location.lat();
        var startLng = myroute.start_location.lng();
        var endLat = myroute.end_location.lat();
        var endLng = myroute.end_location.lng();

        var steps = [];
        for (var i = 0; i < myroute.steps.length; i++){
                var pathLatLngs = [];
                for (var c = 0; c < myroute.steps[i].path.length; c++){
                        var lat = myroute.steps[i].path[c].lat();
                        var lng = myroute.steps[i].path[c].lng();
                        pathLatLngs.push( { "lat":lat , "lng":lng }  );
                }
                steps.push( pathLatLngs );
        }


        document.getElementById("coord_list").value = JSON.stringify(steps);
      //  document.getElementById("collist1").innerHTML = document.getElementById("coord_list").value

        var jsss = {
                "copyrights": copyrights,
                "sp_lat": startLat,
                "sp_lng": startLng,
                "ep_lat": endLat,
                "ep_lng": endLng,
                "start_address": originInput.value,
                "end_address": destinationInput.value
        };


        return JSON.stringify(jsss);
}

function computeTotalDistance(result) {
    var total = 0;
    var myroute = result.routes[0];
    for (var i = 0; i < myroute.legs.length; i++) {
        total += myroute.legs[i].distance.value;
    }
    document.getElementById('total_distance').value = total;

    var sp = myroute.legs[0].start_location;
    var ep = myroute.legs[0].end_location;

    var contentToShow = {

        //"cords": JSON.stringify(myroute.bounds.toJSON()),
        "copyrights": myroute.copyrights,
        "sp_lat": sp.lat(),
        "sp_lng": sp.lng(),
        "ep_lat": ep.lat(),
        "ep_lng": ep.lng(),
        "start_address": myroute.legs[0].start_address,
        "end_address": myroute.legs[0].end_address,

    };
    //document.getElementById('dets').innerHTML =
    document.getElementById("ride_details").value = JSON.stringify(contentToShow);

    myroute = result.routes[0].legs[0];

    var steps = [];
        for (var i = 0; i < myroute.steps.length; i++){
                var pathLatLngs = [];
                for (var c = 0; c < myroute.steps[i].path.length; c++){
                        var lat = myroute.steps[i].path[c].lat();
                        var lng = myroute.steps[i].path[c].lng();
                        pathLatLngs.push( { "lat":lat , "lng":lng }  );
                }
                steps.push( pathLatLngs );
        }
    document.getElementById("coord_list").value = JSON.stringify(steps);
    //document.getElementById("collist1").innerHTML = document.getElementById("coord_list").value
}