import DBHelper from './dbhelper';
// let restaurant;
let newMap;

/**
 * Initialize map as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
	initMap();
});

/**
 * Initialize leaflet map
 */
/*eslint-disable*/
const initMap = () => {
	fetchRestaurantFromURL((error, restaurant) => {
		if (error) { // Got an error!
			console.error(error);
		} else {
			self.newMap = L.map('map', {
				center: [
					restaurant.latlng.lat, restaurant.latlng.lng
				],
				zoom: 16,
				scrollWheelZoom: false
			});
			L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
				mapboxToken: 'pk.eyJ1IjoiYW9zbW4iLCJhIjoiY2prOW1lYWV6MjJoNjN3cGFzZ3cybnhhbCJ9.MooMDpdnW4vnA4Aee7JnDQ',
				maxZoom: 18,
				attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' + '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' + 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
				id: 'mapbox.streets'
			}).addTo(self.newMap);
			fillBreadcrumb();
			DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
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
const fetchRestaurantFromURL = (callback) => {
	if (self.restaurant) { // restaurant already fetched!
		callback(null, self.restaurant);
		return;
	}
	const id = getParameterByName('id');
	if (!id) { // no id found in URL
		const error = 'No restaurant id in URL';
		callback(error, null);
	} else {
		DBHelper.fetchRestaurantById(id, (error, restaurant) => {
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
const fillRestaurantHTML = (restaurant = self.restaurant) => {
	const name = document.getElementById('restaurant-name');
	name.innerHTML = restaurant.name;

	const address = document.getElementById('restaurant-address');
	address.innerHTML = restaurant.address;

	//
	// <picture>
	//     <source media="(min-width: 800px)" srcset="images/still_life-1600_large_1x.jpg 1x, images/still_life-1600_large_2x.jpg 2x">
	//     <source media="(min-width: 500px)" srcset="images/still_life-800_medium_1x.jpg 1x, images/still_life-8_medium_2x.jpg 2x">
	//     <img src="images/still_life-600_small.jpg" alt="Image of horses in hawaii">
	//   </picture>

	// const picture = document.getElementById('restaurant-img');
	const srcLarge = document.getElementById('src-lrg');
	srcLarge.setAttribute('srcset', `${
		DBHelper.imageUrlForRestaurant(restaurant)}-1600_large_1x.webp 1x, ${
		DBHelper.imageUrlForRestaurant(restaurant)}-1600_large_2x.webp 2x`);
	const srcMed = document.getElementById('src-med');
	srcMed.setAttribute('srcset', `${
		DBHelper.imageUrlForRestaurant(restaurant)}-800_medium_1x.webp 1x, ${
		DBHelper.imageUrlForRestaurant(restaurant)}-800_medium_2x.webp 2x`);

	const image = document.getElementById('restaurant-image');
	image.className = 'restaurant-img';
	image.setAttribute('alt', `restaurant ${
		restaurant.name}, ${restaurant.cuisine_type} cuisine`);
	image.src = `${DBHelper.imageUrlForRestaurant(restaurant)}-600_small.webp`;

	const cuisine = document.getElementById('restaurant-cuisine');
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
const fillRestaurantHoursHTML =
(operatingHours = self.restaurant.operating_hours) => {
	const hours = document.getElementById('restaurant-hours');
	for (const key in operatingHours) {
		const row = document.createElement('tr');

		const day = document.createElement('td');
		day.className = 'day';
		day.innerHTML = key;
		row.appendChild(day);

		const time = document.createElement('td');
		time.className = 'time';

		if (operatingHours[key].indexOf(',') > -1) {
			const operatingHoursArr = operatingHours[key].split(',');
			// console.log(operatingHours[key].split(","));
			time.innerHTML = operatingHoursArr[0];
			row.appendChild(time);
			hours.appendChild(row);
			for (let i = 1; i < operatingHoursArr.length; i++) {
				const hourRow = document.createElement('tr');
				hourRow.appendChild(document.createElement('td'));
				const hourCell = document.createElement('td');
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
const fillReviewsHTML = (reviews = self.restaurant.reviews) => {
	const container = document.getElementById('reviews-container');
	const title = document.createElement('h2');
	title.innerHTML = 'Reviews';
	container.appendChild(title);

	if (!reviews) {
		const noReviews = document.createElement('p');
		noReviews.innerHTML = 'No reviews yet!';
		container.appendChild(noReviews);
		return;
	}
	const ul = document.getElementById('reviews-list');
	reviews.forEach(review => {
		ul.appendChild(createReviewHTML(review));
	});
	container.appendChild(ul);
};

/**
 * Create review HTML and add it to the webpage.
 */
const createReviewHTML = (review) => {
	const li = document.createElement('li');
	const name = document.createElement('p');
	name.innerHTML = review.name;
	name.className = 'user-name';
	li.appendChild(name);

	const date = document.createElement('p');
	date.innerHTML = review.date;
	date.className = 'date';
	li.appendChild(date);

	const rating = document.createElement('p');
	rating.innerHTML = `Rating: <span class="rating">${review.rating}</span>`;
	li.appendChild(rating);

	const comments = document.createElement('p');
	comments.innerHTML = review.comments;
	comments.className = 'comment';
	li.appendChild(comments);

	return li;
};

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
const fillBreadcrumb = (restaurant = self.restaurant) => {
	const breadcrumb = document.getElementById('breadcrumb');
	const li = document.createElement('li');
	li.innerHTML = restaurant.name;
	breadcrumb.appendChild(li);
};

/**
 * Get a parameter by name from page URL.
 */
/* eslint-disable no-useless-escape*/

const getParameterByName = (name, url) => {
	if (!url)
		url = window.location.href;
	name = name.replace(/[\[\]]/g, '\\$&');
	const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
		results = regex.exec(url);
	if (!results)
		return null;
	if (!results[2])
		return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
};
/* eslint-disable no-useless-escape*/

// =============================================================================
let serviceWorker = {};
const registerServiceWorker = () => {
	if (!navigator.serviceWorker)
		return;
	navigator.serviceWorker.register('../sw.js').then(reg => {
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

		reg.addEventListener('updatefound', () => {
			serviceWorker = reg.installing;
			trackInstalling(reg.installing);
		});
	});

	// Ensure refresh is only called once.
	// This works around a bug in "force update on reload".
	let refreshing;
	navigator.serviceWorker.addEventListener('controllerchange', () => {
		if (refreshing)
			return;
		window.location.reload();
		refreshing = true;
	});
};

const trackInstalling = worker => {
	worker.addEventListener('statechange', () => {
		if (worker.state == 'installed') {
			updateReady(worker);
		}
	});
};

const updateReady = () => {
	const toast = document.getElementById('simple-toast');
	toast.setAttribute('class', 'visible');
};

registerServiceWorker();

// USING PURE JS To AVOID NEEDING TO CACHE JQUERY , SAVE MEMORY
document.addEventListener('DOMContentLoaded', () => {
	const toast = document.getElementById('simple-toast');
	const refresh = document.getElementById('refresh');
	const dismiss = document.getElementById('dismiss');

	refresh.onclick = () => {
		// console.log('refreshed');
		serviceWorker.postMessage({action: 'skipWaiting'});
	};
	dismiss.onclick = () => {
		toast.setAttribute('class', '');
	};
});
