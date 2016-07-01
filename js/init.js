var map;

// The names of map locations
var title = ["Brooklyn Heights Promenade", "Brooklyn Botanic Garden",
	"Brooklyn Bridge", "Golden Gate Park", "The High Line"];
// The lat and lng of map locations
var position = [{lat: 40.6959, lng: -73.9979}, {lat: 40.6689, lng: -73.9651},
	{lat: 40.7061, lng: -73.9969}, {lat: 40.7829, lng: -73.9654},
	{lat: 40.7480, lng: -74.0048},];

function initMap() {
	// initMap is a constructor function that creates a map background.
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 40.713, lng: -74.010},
		zoom: 12
	});
	console.log(map);

	for (i=0; i<position.length; i++) {
		var marker = new google.maps.Marker({
		position: position[i],
		draggable: true,
		animation: google.maps.Animation.DROP,
		map: map,
		title: title[i]
		});
	};
};