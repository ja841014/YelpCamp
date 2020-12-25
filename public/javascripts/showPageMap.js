// const parseBackCampground = JSON.parse(campground);

// mapToken is predefined in show.ejs
mapboxgl.accessToken = mapToken;
console.log(campground.geometry.coordinates);
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 8 // starting zoom
});
// add zoon control to the map
map.addControl(new mapboxgl.NavigationControl({
    showZoom: true,
    visualizePitch: true

}));
// set a pin on the map
new mapboxgl.Marker()
            .setLngLat(campground.geometry.coordinates)
            .setPopup(
                new mapboxgl.Popup({offset: 25})
                .setHTML(
                    `<h3>${campground.title}</h3>`
                )
            )
            .addTo(map);