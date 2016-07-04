var model = {
	// Names and lat/longs of map locations.
	locations: [{name: "Brooklyn Heights Promenade", position: {lat: 40.6959, lng: -73.9979}},
	{name: "Brooklyn Botanic Garden", position: {lat: 40.6689, lng: -73.9651}},
	{name: "Brooklyn Bridge", position: {lat: 40.7061, lng: -73.9969}},
	{name: "Golden Gate Park", position: {lat: 40.7829, lng: -73.9654}},
	{name: "The High Line", position: {lat: 40.7480, lng: -74.0048}}],
};

// Place constructor function.
// function Place(eachlocation) {
// 	this.name = eachlocation.name;
// 	this.position = eachlocation.position;
// 	this.marker = null;
// };

var viewModel = function() {
	var self = this;

	// For ease of use throughout ViewModel.
	var modlength = model.locations.length;

	// Create the google map object.
	self.map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 40.713, lng: -74.010},
		zoom: 12
	});

	// Create markers for each location from the model data.
	for (var i=0; i<modlength; i++) {
		model.locations[i].marker = new google.maps.Marker({
			map: self.map,
			position: model.locations[i].position,
			animation: google.maps.Animation.DROP
		});
		// Make each marker bounce when it is clicked.
		model.locations[i].marker.addListener('click', function() {
			var self = this;
    		self.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){ self.setAnimation(null); }, 700);
    	});
	};

	// Create an array to hold visible objects, all initial objects and
	// all objects that match the search name. This is an observable array
	// so that any changes will be updated throughout the project.
	self.visiblePlaces = ko.observableArray();

	// Pushes all places to the visiblePlaces array, as all places should
	// initially be visible.
	for (var i=0; i<modlength; i++) {
		self.visiblePlaces.push(model.locations[i]);
	};

	// Stores the user search result at all times. This is an observable so any
	// changes will be tracked and then updated throughout the project.
	self.query = ko.observable('');

	// Function that initially sets all markers' visibility off, then
	// filters through the search results, and turns the visiblity on for
	// markers whose names match the search results. filterMarkers runs
	// every time a key is pressed in the search area.
	self.filterMarkers = function() {
		// Search result lower cased.
		var search = self.query().toLowerCase();
		// Removes all places in the visiblePlaces Array, which initially
		// contained all places.
		self.visiblePlaces.removeAll();

		// Compares the search result to the name of each place and makes its
		// marker visible if matches.
		for (i=0; i<modlength; i++) {
			// Each individual location object contained in the model data.
			var thisPlace = model.locations[i];
			// Set visibility of the marker for every initial place false.
			thisPlace.marker.setVisible(false);

			// If any place's name matches the search, that place is pushed to
			// the visible place array.
			if (thisPlace.name.toLowerCase().indexOf(search) >= 0) {
				self.visiblePlaces.push(thisPlace);
			}
		};

		// Turns the marker's visibility on for each place in the visible
		// places array.
		for (var i=0; i<self.visiblePlaces().length; i++) {
			self.visiblePlaces()[i].marker.setVisible(true);
		};
	};

	self.name = ko.observable('');
	// Function that highlights text when it is clicked and makes the
	// corresponding marker bounce.
	self.bounce = function() {
		// Sort through all of the model location names.
		for (var i=0; i<modlength; i++) {
			// If the model location name is the same as the name of the
			// li clicked on, the marker will bounce once.
			if (event.srcElement.innerHTML == model.locations[i].name) {
				var self = model.locations[i].marker;
				self.setAnimation(google.maps.Animation.BOUNCE);
				setTimeout(function(){ self.setAnimation(null); }, 700);
			};
		};
	};
};

ko.applyBindings(new viewModel());