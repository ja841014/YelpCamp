"use strict";

// const parseBackCampground = JSON.parse(campground);
// mapToken is predefined in show.ejs
mapboxgl.accessToken = mapToken;
console.log(campground.geometry.coordinates);
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  // stylesheet location
  center: campground.geometry.coordinates,
  // starting position [lng, lat]
  zoom: 8 // starting zoom

}); // set a pin on the map

new mapboxgl.Marker().setLngLat(campground.geometry.coordinates).addTo(map);