var model = {
	// Names and lat/longs of map locations
	locations: [{name: "Brooklyn Heights Promenade", position: {lat: 40.6959, lng: -73.9979}, number: 0},
	{name: "Brooklyn Botanic Garden", position: {lat: 40.6689, lng: -73.9651}, number: 1},
	{name: "Brooklyn Bridge", position: {lat: 40.7061, lng: -73.9969}, number: 2},
	{name: "Golden Gate Park", position: {lat: 40.7829, lng: -73.9654}, number: 3},
	{name: "The High Line", position: {lat: 40.7480, lng: -74.0048}, number: 4}],
};

var ViewModel = new function() {
	// Title of each location
	this.title = ko.observable(model.title);
	// Lat and lng of each location
	this.query = ko.observable('');
};

// Function that compares the form value to each locaton and updates list.
ViewModel.locations = ko.computed(function() {
	// The search result, checked and changed onkeyup.
	var search = this.query().toLowerCase();
	// returns the model.locations values which search is some component of onto the list.
	return ko.utils.arrayFilter(model.locations, function(location) {
		return location.name.toLowerCase().indexOf(search) >= 0;
	});
}, ViewModel);

ko.applyBindings(ViewModel);

var Pin = function Marker(map, name, position) {
	var marker;

	this.name = ko.observable(name);
	this.position = ko.observable(position);
}

var map;
function initMap() {
	// initMap is a constructor function that creates a map background.
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 40.713, lng: -74.010},
		zoom: 12
	});

	var marker = [];

	mapMarker = function(name, position)  {
		this.name = ko.observable(name);
		this.lat = ko.observable(latlng);
		this.marker = new google.maps.Marker({
			position: new google.maps.LatLng(position),
			map: map,
			animation: google.maps.Animation.DROP
		});
	};
	toggleMarkers = ko.computed(function() {
		// The search result, checked and changed onkeyup.
		var search = ViewModel.query().toLowerCase();
		// The objects that pass the search
		var names = ko.utils.arrayFilter(model.locations, function(location) {
			return location.name.toLowerCase().indexOf(search) >= 0;
		});
		console.log(names.length);
	});
};