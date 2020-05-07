// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
var infoWindow;

function getDeviceGeoLocation(map) {

    // InfoWindow is a drawable in google map. can be used to show some content.
    // https://developers.google.com/maps/documentation/javascript/infowindows
    infoWindow = new google.maps.InfoWindow;

    // navigator is a browser object that returns many informations including geolocation
    // https://www.w3schools.com/jsref/obj_navigator.asp
    // Try HTML5 geolocation.
    // apparently getCurrentPosition (callback function in JS) will return an object we care calling it position.
    // here are passing position to a function and checking what does it have?  and checking what does it have?
    // navigator.geolocation.getCurrentPosition(success[, error[, [options]]) need 3 parameters. out of which 2 are optional.
    // we gave 1st as callback option, error - function that calls handleLocationError
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                infoWindow.setPosition(pos);
                infoWindow.setContent('Current Location');
                infoWindow.open(map);
                map.setCenter(pos);
            },
            function() {
                handleLocationError(true, infoWindow, map.getCenter());
            });
    }
    else {
    // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    // we are saying if browser support geolocation then error else another error
    infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}