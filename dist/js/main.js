'use strict';

var _dbhelper = require('./dbhelper');

var _dbhelper2 = _interopRequireDefault(_dbhelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// let restaurants,
//   neighborhoods,
//   cuisines
var newMap = void 0;
// let markers = [];

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', function () {
	initMap(); // added
	fetchNeighborhoods();
	fetchCuisines();

	var neighbourSelect = document.getElementById('neighborhoods-select');
	var cuisineSelect = document.getElementById('cuisines-select');

	if (window.innerWidth > 450) {
		neighbourSelect.tabIndex = 0;
		cuisineSelect.tabIndex = 0;
	}

	// show filter
	var filterBtn = document.getElementById('show-filter');
	filterBtn.addEventListener('click', function () {
		var filter = document.getElementsByClassName('filter-options')[0];
		var map = document.getElementById('map');
		var arrow = document.getElementById('arrow');
		var btnText = document.getElementById('btnText');
		if (filter.classList.contains('open')) {
			filter.classList.remove('open');
			map.classList.remove('smaller');
			arrow.innerHTML = '&#9660;';
			btnText.innerHTML = 'Show filters ';
			neighbourSelect.tabIndex = -1;
			cuisineSelect.tabIndex = -1;
		} else {
			filter.classList.add('open');
			map.classList.add('smaller');
			arrow.innerHTML = '&#9650;';
			btnText.innerHTML = 'Hide filters ';
			neighbourSelect.tabIndex = 0;
			cuisineSelect.tabIndex = 0;
		}
	});
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
/* eslint-disable no-console */
var fetchNeighborhoods = function fetchNeighborhoods() {
	_dbhelper2.default.fetchNeighborhoods(function (error, neighborhoods) {
		if (error) {
			// Got an error
			console.error(error);
		} else {
			self.neighborhoods = neighborhoods;
			fillNeighborhoodsHTML();
		}
	});
};
/* eslint-enable no-console */
/**
 * Set neighborhoods HTML.
 */
var fillNeighborhoodsHTML = function fillNeighborhoodsHTML() {
	var neighborhoods = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.neighborhoods;

	var select = document.getElementById('neighborhoods-select');
	neighborhoods.forEach(function (neighborhood) {
		var option = document.createElement('option');
		option.innerHTML = neighborhood;
		option.value = neighborhood;
		select.append(option);
	});
};

/**
 * Fetch all cuisines and set their HTML.
 */
/* eslint-disable no-console */
var fetchCuisines = function fetchCuisines() {
	_dbhelper2.default.fetchCuisines(function (error, cuisines) {
		if (error) {
			// Got an error!
			console.error(error);
		} else {
			self.cuisines = cuisines;
			fillCuisinesHTML();
		}
	});
};
/* eslint-enable no-console */
/**
 * Set cuisines HTML.
 */
var fillCuisinesHTML = function fillCuisinesHTML() {
	var cuisines = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.cuisines;

	var select = document.getElementById('cuisines-select');

	cuisines.forEach(function (cuisine) {
		var option = document.createElement('option');
		option.innerHTML = cuisine;
		option.value = cuisine;
		select.append(option);
	});
};

/**
 * Initialize leaflet map, called from HTML.
 */
/*eslint-disable*/
var initMap = function initMap() {
	self.newMap = L.map('map', {
		center: [40.722216, -73.987501],
		zoom: 12,
		scrollWheelZoom: false
	});
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
		mapboxToken: 'pk.eyJ1IjoiYW9zbW4iLCJhIjoiY2prOW1lYWV6MjJoNjN3cGFzZ3cybnhhbCJ9.MooMDpdnW4vnA4Aee7JnDQ',
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' + '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' + 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox.streets'
	}).addTo(newMap);

	updateRestaurants();
};
/*eslint-enable*/

/* window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
  updateRestaurants();
} */

/**
 * Update page and map for current restaurants.
 */
/* eslint-disable no-console */
var updateRestaurants = function updateRestaurants() {
	var cSelect = document.getElementById('cuisines-select');
	var nSelect = document.getElementById('neighborhoods-select');

	var cIndex = cSelect.selectedIndex;
	var nIndex = nSelect.selectedIndex;

	var cuisine = cSelect[cIndex].value;
	var neighborhood = nSelect[nIndex].value;

	_dbhelper2.default.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, function (error, restaurants) {
		if (error) {
			// Got an error!
			console.error(error);
		} else {
			resetRestaurants(restaurants);
			fillRestaurantsHTML();
		}
	});
};
/* eslint-enable no-console */
/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
var resetRestaurants = function resetRestaurants(restaurants) {
	// Remove all restaurants
	self.restaurants = [];
	var ul = document.getElementById('restaurants-list');
	ul.innerHTML = '';

	// Remove all map markers
	if (self.markers) {
		self.markers.forEach(function (marker) {
			return marker.remove();
		});
	}
	self.markers = [];
	self.restaurants = restaurants;
};

/**
 * Create all restaurants HTML and add them to the webpage.
 */
var fillRestaurantsHTML = function fillRestaurantsHTML() {
	var restaurants = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurants;

	var ul = document.getElementById('restaurants-list');
	restaurants.forEach(function (restaurant) {
		ul.append(createRestaurantHTML(restaurant));
	});
	addMarkersToMap();
};

/**
 * Create restaurant HTML.
 */
var createRestaurantHTML = function createRestaurantHTML(restaurant) {
	var li = document.createElement('li');
	var content = document.createElement('div');
	content.classList.add('content');

	var imageContainer = document.createElement('div');
	imageContainer.className = 'restaurant-img-container';

	var picture = document.createElement('picture');
	var srcLarge = document.createElement('source');
	srcLarge.setAttribute('media', '(min-width: 800px)');
	srcLarge.setAttribute('srcset', _dbhelper2.default.imageUrlForRestaurant(restaurant) + '-1600_large_1x.jpg 1x, ' + _dbhelper2.default.imageUrlForRestaurant(restaurant) + '-1600_large_2x.jpg 2x');
	var srcMed = document.createElement('source');
	srcMed.setAttribute('media', '(min-width: 800px)');
	srcMed.setAttribute('srcset', _dbhelper2.default.imageUrlForRestaurant(restaurant) + '-800_medium_1x.jpg 1x, ' + _dbhelper2.default.imageUrlForRestaurant(restaurant) + '-800_medium_2x.jpg 2x');

	picture.append(srcLarge);
	picture.append(srcMed);

	var image = document.createElement('img');
	image.className = 'restaurant-img';
	var altText = 'restaurant ' + restaurant.name + ', ' + restaurant.cuisine_type + ' cuisine';
	image.setAttribute('alt', altText);
	image.src = _dbhelper2.default.imageUrlForRestaurant(restaurant) + '-600_small.jpg';
	picture.append(image);
	imageContainer.append(picture);
	li.append(imageContainer);

	var name = document.createElement('h1');
	name.innerHTML = restaurant.name;
	content.append(name);

	var neighborhood = document.createElement('p');
	neighborhood.innerHTML = restaurant.neighborhood;
	content.append(neighborhood);

	var address = document.createElement('p');
	address.innerHTML = restaurant.address;
	content.append(address);

	var moreContainer = document.createElement('div');
	moreContainer.className = 'actions';
	var more = document.createElement('a');
	more.innerHTML = 'View Details';
	more.setAttribute('aria-label', restaurant.name + ', view restaurant details');
	more.href = _dbhelper2.default.urlForRestaurant(restaurant);
	moreContainer.append(more);

	li.append(content);
	li.append(moreContainer);

	return li;
};

/**
 * Add markers for current restaurants to the map.
 */
var addMarkersToMap = function addMarkersToMap() {
	var restaurants = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurants;

	restaurants.forEach(function (restaurant) {
		// Add marker to the map
		var marker = _dbhelper2.default.mapMarkerForRestaurant(restaurant, self.newMap);
		marker.on('click', onClick);
		function onClick() {
			window.location.href = marker.options.url;
		}
		self.markers.push(marker);
	});
};
/* addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    });
    self.markers.push(marker);
  });
} */

// =============================================================================
var serviceWorker = {};
var registerServiceWorker = function registerServiceWorker() {
	if (!navigator.serviceWorker) return;
	navigator.serviceWorker.register('../sw.js').then(function (reg) {
		if (!navigator.serviceWorker.controller) {
			return;
		}

		if (reg.waiting) {
			serviceWorker = reg.waiting;
			updateReady(reg.waiting);
			return;
		}

		if (reg.installing) {
			serviceWorker = reg.installing;
			trackInstalling(reg.installing);
			return;
		}

		reg.addEventListener('updatefound', function () {
			serviceWorker = reg.installing;
			trackInstalling(reg.installing);
		});
	});

	// Ensure refresh is only called once.
	// This works around a bug in "force update on reload".
	var refreshing = void 0;
	navigator.serviceWorker.addEventListener('controllerchange', function () {
		if (refreshing) return;
		window.location.reload();
		refreshing = true;
	});
};

var trackInstalling = function trackInstalling(worker) {
	worker.addEventListener('statechange', function () {
		if (worker.state == 'installed') {
			updateReady(worker);
		}
	});
};

var updateReady = function updateReady() {
	var toast = document.getElementById('simple-toast');
	toast.setAttribute('class', 'visible');
};

registerServiceWorker();

// USING PURE JS To AVOID NEEDING TO CACHE JQUERY , SAVE MEMORY
document.addEventListener('DOMContentLoaded', function () {
	var toast = document.getElementById('simple-toast');
	var refresh = document.getElementById('refresh');
	var dismiss = document.getElementById('dismiss');

	refresh.onclick = function () {
		// console.log('refreshed');
		serviceWorker.postMessage({ action: 'skipWaiting' });
	};
	dismiss.onclick = function () {
		toast.setAttribute('class', '');
	};
});