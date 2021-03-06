
var currentLocation; //lon and lat
var myLocation; //map element

function gotPos(position){
    console.log(position);
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    currentLocation = [lat,lon];
    //map.removeLayer(myLocation);
    //myLocation = L.marker([lat, lon]).addTo(map);
    console.log('position updated');
}

function gotErr(){
    console.log('error yo');
}

function update_position(){
    //var watchID = navigator.geolocation.watchPosition( gotPos, gotErr, options );
    var watchID = navigator.geolocation.getCurrentPosition( gotPos, gotErr, { enableHighAccuracy: true, maximumAge: 100, timeout: 50000 } );
    var timeout = setTimeout( function() { navigator.geolocation.clearWatch( watchID ); }, 5000 );
}

function addMarker(map,lat,lon){
    map.addSource('markers', {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [lon, lat]
                },
                "properties": {
                    //"title": "Mapbox DC",
                    "marker-color": "#ff00ff",
                    "marker-symbol": "secondary_marker"
                    //"marker-symbol": "default_marker"
                }
            },/* {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [-122.414, 37.776]
                },
                "properties": {
                    "title": "Mapbox SF",
                    "marker-color": "#ff00ff",
                    "marker-symbol": "secondary_marker"
                }
            }*/]
        }
    });

    map.addLayer({
        "id": "markers",
        "source": "markers",
        "type": "symbol",
        "layout": {
            "icon-image": "{marker-symbol}",
            "text-field": "{title}",
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-offset": [0, 0.6],
            "text-anchor": "top"
        }
    });
}

$(document).ready(function(){

    mapboxgl.accessToken = 'pk.eyJ1IjoiYWtudWNrIiwiYSI6ImNqNDk2aGhzNDB1MHkzM3FsNGl1ZGozZHEifQ.qBgXJJjDj12Axzefkw9Cdw';
    var mapStyle = {
        "version": 8,
        "sources": {
            /*"mapbox": {
                "type": "vector",
                "url": "mapbox://mapbox.mapbox-streets-v6"
            },*/
            "overlay": {
                "type": "image",
                "url": "floor2rotated2.png",
                "coordinates": [
                    [-74.024102, 40.760412],
                    [-74.022496, 40.760412],
                    [-74.022496, 40.759117],
                    [-74.024102, 40.759117]
                ]
            }
        },
        "sprite": "mapbox://sprites/mapbox/dark-v9",
        "glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
        "layers": [
            {
                "id": "overlay",
                "source": "overlay",
                "type": "raster",
                "paint": {"raster-opacity": 0.85}
            },
        ]
    };

    var map = new mapboxgl.Map({
        container: 'map',
        maxZoom: 21,
        minZoom: 18,
        zoom: 18,
        center: [-74.023299, 40.7597645],
        style: mapStyle,
        hash: false
    });

    var lat = 0;
    var lon = 0;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            var marker = L.marker([lat, lon]).addTo(map);
            addMarker(map,lat,lon);
            //myLocation = L.marker([lat, lon])//.addTo(map);
            //map.addLayer(myLocation);
            //myLocation.bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();
            //.addTo(map);
            //map.removeLayer(myLocation);
        });
    }
    window.setInterval(update_position, 5000);

    $('#search-button').click(function(){
        calculateDistances();
        $("#search-bar").easyAutocomplete(autocompleteData);
    });
    /*map.on('mousemove',function(e){
        console.log(e.lngLat);
    });*/
});
