
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

    $('#search-button').click(function(){
        calculateDistances();
    });
    /*map.on('mousemove',function(e){
        console.log(e.lngLat);
    });*/
});
