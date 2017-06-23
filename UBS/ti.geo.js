exports.init = function() {
    Ti.Geolocation.purpose = 'Mileage Calculate';
    
    checkGeoPermission();
    
    Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
    
    //
    //  SET ACCURACY - THE FOLLOWING VALUES ARE SUPPORTED
    //
    // Ti.Geolocation.ACCURACY_BEST
    // Ti.Geolocation.ACCURACY_NEAREST_TEN_METERS
    // Ti.Geolocation.ACCURACY_HUNDRED_METERS
    // Ti.Geolocation.ACCURACY_KILOMETER
    // Ti.Geolocation.ACCURACY_THREE_KILOMETERS
    //
    Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;

    //
    //  SET DISTANCE FILTER.  THIS DICTATES HOW OFTEN AN EVENT FIRES BASED ON THE DISTANCE THE DEVICE MOVES
    //  THIS VALUE IS IN METERS
    //
    Ti.Geolocation.distanceFilter = 10;
};

function checkGeoPermission() {
    if (Ti.Geolocation.locationServicesEnabled === false){
        showDialog({
            title: 'Mapping Error', 
            message: 'Your device has geo turned off - turn it on.'
        });
    } else {
        var authorization = Ti.Geolocation.locationServicesAuthorization;
        if (authorization == Ti.Geolocation.AUTHORIZATION_DENIED) {           
            showDialog({
                title: 'Mapping Error', 
                message: 'You have disallowed App from running geolocation services.'
            });
        }
        else if (authorization == Ti.Geolocation.AUTHORIZATION_RESTRICTED) {
            showDialog({
                title: 'Mapping Error', 
                message: 'Your system has disallowed App from running geolocation services.'
            });
        }
    }    
};


/* =============================================================================
   Get current position
   ========================================================================== */


function getCurrentPosition(callback) {
    Ti.Geolocation.getCurrentPosition(callback);
}
exports.getCurrentPosition = getCurrentPosition;


/* =============================================================================
   Geocode: convert address to latitude - longitude and vice versa
   ========================================================================== */


/*
 type: 
    - 'address': '1600+Amphitheatre+Parkway,+Mountain+View,+CA'
    - 'latlng' : '40.714224,-73.961452'
 * */
function location(type, param, callback) {
    var xhr = Ti.Network.createHTTPClient();
    xhr.setTimeout(15000);
    xhr.open('GET', 'http://maps.googleapis.com/maps/api/geocode/json?' + (type == 'latlng' ? 'latlng' : 'address') + '=' + param + '&sensor=false');
    xhr.onload = function() {
        var obj = JSON.parse(this.responseText);
        
        if (obj.status != 'OK') {
            showDialog({
	            title: 'Mapping Error', 
	            message: 'Cannot determine a route from your address, please use a broader address'
	        });
            return;
        }
        
        if (obj.results.length) {
            var result = obj.results[0],
                location = result.geometry.location;        
            callback({
                title: result.formatted_address,
                latitude: location.lat,
                longitude: location.lng
            });
        }
    };
    xhr.onerror = function(e) {
        Ti.API.error(e.error);
        showDialog({
            title: 'Mapping Error', 
            message: 'Can not determine your current location'
        });
    };
    xhr.send();
};
exports.location = location;


/* =============================================================================
   Route Direction: find direction between two points
   ========================================================================== */


function route(origin, destination, callback) {
    var url = "http://maps.googleapis.com/maps/api/directions/json?sensor=false"
        + "&mode=driving"
        + "&alternatives=true" //show alternative directions
        + "&units=imperial"    //imperial: miles, metric: km
        + "&origin=" + origin
        + "&destination=" + destination;
        
    //https://developers.google.com/maps/documentation/directions/#UnitSystems    

    var xhr = Ti.Network.createHTTPClient();
    xhr.setTimeout(15000);
    xhr.open('GET', url);
    xhr.onload = function() {
        var result = JSON.parse(this.responseText);
        
        if (result.status != 'OK') {
            showDialog({
	            title: 'Mapping Error', 
	            message: 'Cannot determine a route from your address, please use a broader address'
	        });
	        callback(1, null);
            return;
        }
        
        var params = [],
            routes = result.routes;
        
        for(var i = 0, ii = routes.length; i < ii; i++) {
            var leg = routes[i].legs[0], // https://developers.google.com/maps/documentation/directions/#DirectionsLegs
                points = [];
            
            for(var j=0, jj = leg.steps.length; j < jj; j++){
                var step = leg.steps[j], 
                    point = step.start_location;
                
                points.push({
                    latitude: point.lat,
                    longitude: point.lng
                });
                
                decodeLine(step.polyline.points, points);
            };
            
            // Get last point and add it to the array, as we are only parsing start_location
            var lastPoint = leg.end_location;
            points.push({
                latitude: lastPoint.lat,
                longitude: lastPoint.lng
            });
            
            var bounds = routes[i].bounds,
                region = {
                    animate: true,
                    latitude: bounds.northeast.lat - (bounds.northeast.lat - bounds.southwest.lat) / 2,
                    longitude: bounds.northeast.lng - (bounds.northeast.lng - bounds.southwest.lng) / 2,
                    latitudeDelta: (bounds.northeast.lat - bounds.southwest.lat) / 1,
                    longitudeDelta: (bounds.northeast.lng - bounds.southwest.lng) / 1
                }; 
            
            params.push({ 
                bound: region,
                distance: leg.distance.text,
                duration: leg.duration.text,
                end_address: leg.end_address,
                end_location: {
                    latitude: leg.end_location.lat,
                    longitude: leg.end_location.lng
                },
                start_address: leg.start_address,
                start_location: {
                    latitude: leg.start_location.lat,
                    longitude: leg.start_location.lng
                },
                points: points 
            });
        }

        callback(0, params);
    };
    xhr.onerror = function(e) {
        Ti.API.error(e.error);
        showDialog({
            title: 'Mapping Error', 
            message: 'Cannot determine a route from your address, please use a broader address'
        });
        callback(1, null);
    };
    xhr.send();
};
exports.route = route;

// This decodes the lines
function decodeLine(encoded, points) {
    var len = encoded.length;
    var index = 0;
    var array = [];
    var lat = 0;
    var lng = 0;

    while(index < len) {
        var b;
        var shift = 0;
        var result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lat += dlat;

        shift = 0;
        result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lng += dlng;

        // Create new Vars for the created lats and lng
        var newLat = lat * 1e-5;
        var newLon = lng * 1e-5;

        // push them into the array at the end (thus adding it to the correct place)
        points.push({
            latitude: newLat,
            longitude: newLon
        });
    }
}

// places API
/*
* author @boydleep
* 
* example usage
* places.getData(-33.8670522, 151.1957362, radius, types, sensor, 
* function(e) {
* 
* },  
* function(e) {
            Ti.UI.createAlertDialog({
                title: "API call failed",
                message: e,
                buttonNames: ['OK']
            }).show();
    });
*/
var api = {
    xhr: null
};
 

 //create an object which will be our public API
 //data format must be json or xml
exports.getData = function(lat, lon, radius, types, name, sensor, success, error) {    
    if(api.xhr == null){
        api.xhr = Ti.Network.createHTTPClient();
    }   
	
    var url = "https://maps.googleapis.com/maps/api/place/search/json?";    
	url = url + "location=" + lat + ',' + lon;
	url = url + "&radius=" + radius;
	url = url + "&types=" + types;
    url = url + "&name=" + name;
    url = url + "&sensor=" + sensor;
    url = url + "&key=" +Ti.App.Properties.getString("googlePlacesAPIKey");
    Ti.API.info(url);
    
	api.xhr.open('GET', url);
    api.xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
   
    api.xhr.onerror = function(e){
        Ti.API.error("API ERROR " + e.error);
        if (error) {
            error(e);
        }
    };
    
    api.xhr.onload = function(){
        Ti.API.debug("API response: " + this.responseText);
        if (success) {
            var jsonResponse = JSON.parse(this.responseText);
            success(jsonResponse);
        }
    };
                   
    api.xhr.send();
};
 
 //data format must be json or xml
exports.getPlaceDetails = function(reference, sensor, success, error) {    
    if(api.xhr == null){
        api.xhr = Ti.Network.createHTTPClient();
    }   
	    
    var url = "https://maps.googleapis.com/maps/api/place/details/json?";
	url = url + "reference=" + reference;
    url = url + "&sensor=" + sensor;
    url = url + "&key=" +Ti.App.Properties.getString("googlePlacesAPIKey");
    Ti.API.info(url);
    
	api.xhr.open('GET', url);
    api.xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
   
    api.xhr.onerror = function(e){
        Ti.API.error("API ERROR " + e.error);
        if (error) {
            error(e);
        }
    };
    
    api.xhr.onload = function(){
        Ti.API.debug("API response: " + this.responseText);
        if (success) {
            var jsonResponse = JSON.parse(this.responseText);
            success(jsonResponse);
        }
    };
                   
    api.xhr.send();
};
//

// pixel to lat lng
vars = {
	region: null	
};

function pxToLatLng(mapview, xPixels, yPixels) {
    var region = vars.region,
	    widthInPixels = mapview.rect.width,
	    heightInPixels = mapview.rect.height;

    // should invert because of the pixel reference frame
    var heightDegPerPixel = -region.latitudeDelta / heightInPixels,
    	widthDegPerPixel = region.longitudeDelta / widthInPixels;
 
    return {
        lat : (yPixels - heightInPixels / 2) * heightDegPerPixel + region.latitude,
        lng : (xPixels - widthInPixels / 2) * widthDegPerPixel + region.longitude
    };
}

function regionChanged(e) {
  	vars.region = e;
}

//

function showDialog(args) {
	var dialog =  Ti.UI.createAlertDialog(args);
	dialog.show();
	return dialog;
};