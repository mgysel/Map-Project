var map;

function initMap() {
	// initMap is a constructor function that creates a map background.
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 40.713, lng: -74.010},
		zoom: 12
	});
	console.log(map);
};
