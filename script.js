var currentLocation; //lon and lat
var myLocation; //map element
var map;
var options = { enableHighAccuracy: true, maximumAge: 100, timeout: 50000 };

/*function update_position(){
	console.log('update');
	navigator.geolocation.getCurrentPosition(function(position) {
		console.log('in');
		lat = position.coords.latitude;
		lon = position.coords.longitude;
		console.log('a');
		//console.log(lat+','+lon);
		map.removeLayer(myLocation);
		console.log('removed');
		myLocation = L.marker([lat, lon]).addTo(map);
		console.log('marked');
	});
}*/

function gotPos(position){
	console.log(position);
	lat = position.coords.latitude;
	lon = position.coords.longitude;
	map.removeLayer(myLocation);
	myLocation = L.marker([lat, lon]).addTo(map);
	console.log('position updated');
}

function gotErr(){
	console.log('error yo');
}

function update_position(){
	//var watchID = navigator.geolocation.watchPosition( gotPos, gotErr, options );
	var watchID = navigator.geolocation.getCurrentPosition( gotPos, gotErr, options );
	var timeout = setTimeout( function() { navigator.geolocation.clearWatch( watchID ); }, 5000 );
}

function distance(lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1/180
	var radlat2 = Math.PI * lat2/180
	var theta = lon1-lon2
	var radtheta = Math.PI * theta/180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515
	if (unit=="K") { dist = dist * 1.609344 }
	if (unit=="N") { dist = dist * 0.8684 }
	return dist/5280
}


function calculateDistances() {
	var lat = currentLocation['latitude'];
	var lon = currentLocation['longitude'];
	for (key in dataSet){
		dataSet[key]['distance'] = distance(dataSet[key]['latitude'],dataSet[key]['longitude'],lat,lon,'M');
	}
}

function generateData(){
	var autocompleteData = {
		data: dataSet,
		getValue: "name",

		template: {
			type: "custom",
			method: function(value, item) {
				return value + '<span class="distance">' + item.distance + '</span>';
			}
		},
		list: {
			onSelectItemEvent: function(){
				//var value = $("#function-data").getSelectedItemData().realName;
				//$("#data-holder").val(value).trigger("change");
			}
		}
	}
	return autocompleteData;
}

$(document).ready(function(){
	L.mapbox.accessToken = 'pk.eyJ1IjoiYWtudWNrIiwiYSI6ImNqNDk2aGhzNDB1MHkzM3FsNGl1ZGozZHEifQ.qBgXJJjDj12Axzefkw9Cdw';
	var imageUrl = 'floor2rotated2.png',
		// This is the trickiest part - you'll need accurate coordinates for the
		// corners of the image. You can find and create appropriate values at
		// http://maps.nypl.org/warper/ or
		// http://www.georeferencer.org/
		imageBounds = L.latLngBounds([
			//[40.760492, -74.024205], what I think it actually should be
			[40.760412, -74.024102],
			[40.759117, -74.022496]]);

	map = L.mapbox.map('map')//, 'mapbox.streets')
		.fitBounds(imageBounds);

	map.options.maxZoom = 22;
	map.options.minZoom = 19;

	// See full documentation for the ImageOverlay type:
	// http://leafletjs.com/reference.html#imageoverlay
	var overlay = L.imageOverlay(imageUrl, imageBounds)
		.addTo(map);
	var latList = [];
	var lonList = [];
	var lat = 0;
	var lon = 0;

	if (navigator.geolocation) {
		console.log('1');
		navigator.geolocation.getCurrentPosition(function(position) {
			console.log('2');
			lat = position.coords.latitude;
			console.log('3');
			lon = position.coords.longitude;
			console.log('4');
			console.log(lat+','+lon);
			myLocation = L.marker([lat, lon]).addTo(map);
			console.log('5');
			//map.addLayer(myLocation);
			//myLocation.bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();
			//.addTo(map);
			//map.removeLayer(myLocation);
			console.log('6');
		});
	}
	window.setInterval(update_position, 5000);
});