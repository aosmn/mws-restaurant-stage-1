'use strict';

var _dbhelper = require('./dbhelper');

var _dbhelper2 = _interopRequireDefault(_dbhelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// let restaurant;
var newMap = void 0;

/**
 * Initialize map as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', function () {
	initMap();
});

/**
 * Initialize leaflet map
 */
/*eslint-disable*/
var initMap = function initMap() {
	fetchRestaurantFromURL(function (error, restaurant) {
		if (error) {
			// Got an error!
			console.error(error);
		} else {
			self.newMap = L.map('map', {
				center: [restaurant.latlng.lat, restaurant.latlng.lng],
				zoom: 16,
				scrollWheelZoom: false
			});
			L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
				mapboxToken: 'pk.eyJ1IjoiYW9zbW4iLCJhIjoiY2prOW1lYWV6MjJoNjN3cGFzZ3cybnhhbCJ9.MooMDpdnW4vnA4Aee7JnDQ',
				maxZoom: 18,
				attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' + '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' + 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
				id: 'mapbox.streets'
			}).addTo(newMap);
			fillBreadcrumb();
			_dbhelper2.default.mapMarkerForRestaurant(self.restaurant, self.newMap);
		}
	});
};
/* eslint-enable*/

/* window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
} */

/**
 * Get current restaurant from page URL.
 */
/* eslint-disable no-console*/
var fetchRestaurantFromURL = function fetchRestaurantFromURL(callback) {
	if (self.restaurant) {
		// restaurant already fetched!
		callback(null, self.restaurant);
		return;
	}
	var id = getParameterByName('id');
	if (!id) {
		// no id found in URL
		var error = 'No restaurant id in URL';
		callback(error, null);
	} else {
		_dbhelper2.default.fetchRestaurantById(id, function (error, restaurant) {
			self.restaurant = restaurant;
			if (!restaurant) {
				console.error(error);
				return;
			}
			fillRestaurantHTML();
			callback(null, restaurant);
		});
	}
};
/* eslint-enable no-console*/

/**
 * Create restaurant HTML and add it to the webpage
 */
var fillRestaurantHTML = function fillRestaurantHTML() {
	var restaurant = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant;

	var name = document.getElementById('restaurant-name');
	name.innerHTML = restaurant.name;

	var address = document.getElementById('restaurant-address');
	address.innerHTML = restaurant.address;

	//
	// <picture>
	//     <source media="(min-width: 800px)" srcset="images/still_life-1600_large_1x.jpg 1x, images/still_life-1600_large_2x.jpg 2x">
	//     <source media="(min-width: 500px)" srcset="images/still_life-800_medium_1x.jpg 1x, images/still_life-8_medium_2x.jpg 2x">
	//     <img src="images/still_life-600_small.jpg" alt="Image of horses in hawaii">
	//   </picture>

	// const picture = document.getElementById('restaurant-img');
	var srcLarge = document.getElementById('src-lrg');
	srcLarge.setAttribute('srcset', _dbhelper2.default.imageUrlForRestaurant(restaurant) + '-1600_large_1x.jpg 1x, ' + _dbhelper2.default.imageUrlForRestaurant(restaurant) + '-1600_large_2x.jpg 2x');
	var srcMed = document.getElementById('src-med');
	srcMed.setAttribute('srcset', _dbhelper2.default.imageUrlForRestaurant(restaurant) + '-800_medium_1x.jpg 1x, ' + _dbhelper2.default.imageUrlForRestaurant(restaurant) + '-800_medium_2x.jpg 2x');

	var image = document.getElementById('restaurant-image');
	image.className = 'restaurant-img';
	image.setAttribute('alt', 'restaurant ' + restaurant.name + ', ' + restaurant.cuisine_type + ' cuisine');
	image.src = _dbhelper2.default.imageUrlForRestaurant(restaurant) + '-600_small.jpg';

	var cuisine = document.getElementById('restaurant-cuisine');
	cuisine.innerHTML = restaurant.cuisine_type;

	// fill operating hours
	if (restaurant.operating_hours) {
		fillRestaurantHoursHTML();
	}
	// fill reviews
	fillReviewsHTML();
};

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
var fillRestaurantHoursHTML = function fillRestaurantHoursHTML() {
	var operatingHours = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant.operating_hours;

	var hours = document.getElementById('restaurant-hours');
	for (var key in operatingHours) {
		var row = document.createElement('tr');

		var day = document.createElement('td');
		day.className = 'day';
		day.innerHTML = key;
		row.appendChild(day);

		var time = document.createElement('td');
		time.className = 'time';

		if (operatingHours[key].indexOf(',') > -1) {
			var operatingHoursArr = operatingHours[key].split(',');
			// console.log(operatingHours[key].split(","));
			time.innerHTML = operatingHoursArr[0];
			row.appendChild(time);
			hours.appendChild(row);
			for (var i = 1; i < operatingHoursArr.length; i++) {
				var hourRow = document.createElement('tr');
				hourRow.appendChild(document.createElement('td'));
				var hourCell = document.createElement('td');
				hourCell.className = 'time';
				hourCell.innerHTML = operatingHoursArr[1];
				hourRow.append(hourCell);
				hours.appendChild(hourRow);
			}
		} else {
			time.innerHTML = operatingHours[key];
			row.appendChild(time);
			hours.appendChild(row);
		}
	}
};

/**
 * Create all reviews HTML and add them to the webpage.
 */
var fillReviewsHTML = function fillReviewsHTML() {
	var reviews = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant.reviews;

	var container = document.getElementById('reviews-container');
	var title = document.createElement('h2');
	title.innerHTML = 'Reviews';
	container.appendChild(title);

	if (!reviews) {
		var noReviews = document.createElement('p');
		noReviews.innerHTML = 'No reviews yet!';
		container.appendChild(noReviews);
		return;
	}
	var ul = document.getElementById('reviews-list');
	reviews.forEach(function (review) {
		ul.appendChild(createReviewHTML(review));
	});
	container.appendChild(ul);
};

/**
 * Create review HTML and add it to the webpage.
 */
var createReviewHTML = function createReviewHTML(review) {
	var li = document.createElement('li');
	var name = document.createElement('p');
	name.innerHTML = review.name;
	name.className = 'user-name';
	li.appendChild(name);

	var date = document.createElement('p');
	date.innerHTML = review.date;
	date.className = 'date';
	li.appendChild(date);

	var rating = document.createElement('p');
	rating.innerHTML = 'Rating: <span class="rating">' + review.rating + '</span>';
	li.appendChild(rating);

	var comments = document.createElement('p');
	comments.innerHTML = review.comments;
	comments.className = 'comment';
	li.appendChild(comments);

	return li;
};

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
var fillBreadcrumb = function fillBreadcrumb() {
	var restaurant = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant;

	var breadcrumb = document.getElementById('breadcrumb');
	var li = document.createElement('li');
	li.innerHTML = restaurant.name;
	breadcrumb.appendChild(li);
};

/**
 * Get a parameter by name from page URL.
 */
/* eslint-disable no-useless-escape*/

var getParameterByName = function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, '\\$&');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
	    results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
};
/* eslint-disable no-useless-escape*/

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