var model = {
	// Names and lat/longs of map locations.
	locations: [
		{
			name: 'Brooklyn Heights Promenade',
			position: {lat: 40.6959, lng: -73.9979},
			venueID: '42377700f964a52024201fe3'
		},
		{
			name: 'Brooklyn Botanic Garden',
			position: {lat: 40.6689, lng: -73.9651},
			venueID: '42717900f964a5206f211fe3'
		},
		{
			name: 'Brooklyn Bridge',
			position: {lat: 40.7061, lng: -73.9969},
			venueID: '4a43bcb7f964a520bba61fe3'
		},
		{
			name: 'Golden Gate Park',
			position: {lat: 40.7829, lng: -73.9654},
			venueID: '445e36bff964a520fb321fe3'
		},
		{
			name: 'The High Line',
			position: {lat: 40.7480, lng: -74.0048},
			venueID: '40f1d480f964a5206a0a1fe3'
		}
	],

	foursquareconfig: {apiKey: 'NJAHHABYCD2FWFRBKTORDSHJIL3FOQBYU5E5B12HBYNCCTQN',
    					authUrl: 'https://foursquare.com/',
    					apiUrl: 'https://api.foursquare.com/'},

    styles: [
		    {
		        'featureType': 'landscape',
		        'stylers': [
		            {
		                'hue': '#F1FF00'
		            },
		            {
		                'saturation': -27.4
		            },
		            {
		                'lightness': 9.4
		            },
		            {
		                'gamma': 1
		            }
		        ]
		    },
		    {
		        'featureType': 'road.highway',
		        'stylers': [
		            {
		                'hue': '#0099FF'
		            },
		            {
		                'saturation': -20
		            },
		            {
		                'lightness': 36.4
		            },
		            {
		                'gamma': 1
		            }
		        ]
		    },
		    {
		        'featureType': 'road.arterial',
		        'stylers': [
		            {
		                'hue': '#00FF4F'
		            },
		            {
		                'saturation': 0
		            },
		            {
		                'lightness': 0
		            },
		            {
		                'gamma': 1
		            }
		        ]
		    },
		    {
		        'featureType': 'road.local',
		        'stylers': [
		            {
		                'hue': '#FFB300'
		            },
		            {
		                'saturation': -38
		            },
		            {
		                'lightness': 11.2
		            },
		            {
		                'gamma': 1
		            }
		        ]
		    },
		    {
		        'featureType': 'water',
		        'stylers': [
		            {
		                'hue': '#00B6FF'
		            },
		            {
		                'saturation': 4.2
		            },
		            {
		                'lightness': -63.4
		            },
		            {
		                'gamma': 1
		            }
		        ]
		    },
		    {
		        'featureType': 'poi',
		        'stylers': [
		            {
		                'hue': '#9FFF00'
		            },
		            {
		                'saturation': 0
		            },
		            {
		                'lightness': 0
		            },
		            {
		                'gamma': 1
		            }
		        ]
		    }
		]
};


var viewModel = function() {
	var self = this;

	// For ease of use throughout ViewModel.
	var modlength = model.locations.length;

	// Create new StyledMapType object, passing through the styles data
	// and name of the style.
	var styledMap = new google.maps.StyledMapType(model.styles,
		{name: 'Styled Map'});

	// Create the google map object.
	self.map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 40.730, lng: -73.990},
		zoom: 12,
		// Add MapTypeId for the map type control.
		mapTypeControlOptions: {
			mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
		}
	});

	self.map.addListener('click', function() {
		for (var i=0; i<modlength; i++) {
			model.locations[i].marker.info.close();
		}
	});

	// Associate the styled map with the MapTypeId
	self.map.mapTypes.set('map_style', styledMap);
	// Set the map to display
	self.map.setMapTypeId('map_style');

	// Foursquare API request. Upon success, create markers for each location
	// from the model data, make them bounce and for infowindows to pop up
	// when clicked.
	model.locations.forEach(function(location) {
		// API request
		$.ajax({
			url: 'https://api.foursquare.com/v2/venues/'+ location.venueID +'?client_id=NJAHHABYCD2FWFRBKTORDSHJIL3FOQBYU5E5B12HBYNCCTQN&client_secret=WLQVWEN444HSVYNEIAFXSHI4E4P24XNVG5PMP0MVEEBEZHTP&v=20160706',
			dataType: 'jsonp',
			success: function(results) {
				// Create each marker
				location.marker = new google.maps.Marker({
					map: self.map,
					position: location.position,
					clickable: true,
					animation: google.maps.Animation.DROP
				});
				// Make infowindows
				location.marker.info = new google.maps.InfoWindow({
					content: '<strong>'+location.name+'</strong>: ' +
					results.response.venue.description
				});
				// Make each marker bounce when it is clicked.
				location.marker.addListener('click', function() {
					var markerself = this;
					markerself.setAnimation(google.maps.Animation.BOUNCE);
					setTimeout(function(){ markerself.setAnimation(null); }, 700);
					// model.locations[i].marker.info.open(self.map, model.locations[i].marker);
					markerself.info.open(self.map, markerself);
				});
			},
			// Error handling
			error: function (jqxhr, textStatus, error) {
				document.getElementById('error').textContent = 'Sorry friend, '
				+ 'there was an error grabbing data'
			}
		});
	});


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
				self.info.open(this.map, model.locations[i].marker);

			};
		};
	};

};

ko.applyBindings(new viewModel())