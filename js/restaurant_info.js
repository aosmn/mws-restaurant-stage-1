import DBHelper from './dbhelper';
import {replaceWebp} from './webp';

// let restaurant;
let newMap;

function updateIndicator(e) {
	const snackbar = document.getElementById('snackbar');
	// Show a different icon based on offline/online
	if (e.type == "offline") {
		snackbar.className = "show";
	} else if (e.type == "online") {
		snackbar.className = snackbar.className.replace("show", "");
		DBHelper.setFavoriteRestaurantsOnline();
	}
}

// Update the online status icon based on connectivity
window.addEventListener('online',  updateIndicator);
window.addEventListener('offline', updateIndicator);


/**
 * Initialize map as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
	initMap();

	const addReview = document.getElementById('add-review');
	const starBtns = document.getElementsByClassName('star-rate');
	const ratingInput = document.getElementsByClassName('rating-input')[0];
	const reviewRatingInput = document.getElementById('rating');
	const ratingError = document.getElementById('rating-error');

	addReview.addEventListener('submit', (e) => {
		e.preventDefault();
		// console.log(e.target.username.value);
		// console.log(e.target.comments.value);
		// console.log(e.target.rating.value);
		ratingError.style.display = "none";

		if (e.target.rating.value) {
			var url = `http://localhost:1337/reviews/`;
			var data = {name: e.target.username.value,
				comments: e.target.comments.value,
				rating: e.target.rating.value,
				restaurant_id: self.restaurant.id};
				fetch(url, {
					method: 'POST', // or 'PUT'
					body: JSON.stringify(data), // data can be `string` or {object}!
					headers:{
						'Content-Type': 'application/json'
					}
				}).then(res => res.json())
				.then(review => {
					const ul = document.getElementById('reviews-list');
					ul.appendChild(createReviewHTML(review));
					addReview.reset()
					for (var i = 0; i < starBtns.length; i++) {
						starBtns[i].innerHTML = '&#9734;';
					}
				})
				.catch(error => console.error('Error:', error));
		} else {
			ratingError.style.display = "inherit";
		}
	});

	ratingInput.addEventListener('click', (e) => {
		const rate = parseInt(e.target.name.replace('rate', ''));
		ratingError.style.display = 'none';
		reviewRatingInput.value = rate;
		e.target['aria-checked'] = 'true';
		for (var i = 0; i < starBtns.length; i++) {
			starBtns[i].innerHTML = (i < rate) ? '&#9733;' : '&#9734;';
			starBtns[i]['aria-checked'] = 'false';
		}
	});

	const favoriteBtn = document.getElementsByClassName('favorite')[0];
	favoriteBtn.addEventListener('click', (e) => {
		var btnHtml = '&#9734;'
		var isChecked = 'false';

		if (favoriteBtn.innerHTML == '&#9734;' || favoriteBtn.innerHTML == '☆') {
			// data = {is_favorite: 'true'};
			btnHtml = '&#9733;';
			isChecked = 'true';
		}
		favoriteBtn.setAttribute('aria-checked', isChecked);

		DBHelper.setFavoriteRestaurant(restaurant, isChecked, (error) => {
			if (error) { // Got an error!
				error => console.error('Error:', error);
			} else {
				favoriteBtn.innerHTML = btnHtml;
			}
		});
	});
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
	const favoriteBtn = document.getElementsByClassName('favorite')[0];
	if (restaurant.is_favorite == 'true') {
		favoriteBtn.innerHTML = '&#9733;'
		favoriteBtn.setAttribute('aria-checked', 'true');
	}

	const imageSrc = '.webp';

	const imgURL = DBHelper.imageUrlForRestaurant(restaurant);

	const name = document.getElementById('restaurant-name');
	name.innerHTML = restaurant.name;

	const address = document.getElementById('restaurant-address');
	address.innerHTML = restaurant.address;


	const srcLarge = document.getElementById('src-lrg');
	srcLarge.setAttribute('srcset', `${imgURL}-1200_large_1x${imageSrc} 1x, ${
		imgURL}-1200_large_2x${imageSrc} 2x`);
	const srcMed = document.getElementById('src-med');
	srcMed.setAttribute('srcset', `${imgURL}-800_medium_1x${imageSrc} 1x, ${
		imgURL}-800_medium_2x${imageSrc} 2x`);

	const image = document.getElementById('restaurant-image');
	image.className = 'restaurant-img';
	image.setAttribute('alt', `restaurant ${
		restaurant.name}, ${restaurant.cuisine_type} cuisine`);
	image.src = `${imgURL}-600_small${imageSrc}`;

	const cuisine = document.getElementById('restaurant-cuisine');
	cuisine.innerHTML = restaurant.cuisine_type;
	replaceWebp();
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
const fillReviewsHTML = (restaurant = self.restaurant) => {
	const container = document.getElementById('reviews-container');
	const title = document.createElement('h2');
	title.innerHTML = 'Reviews';
	container.appendChild(title);

	var url = `http://localhost:1337/reviews/?restaurant_id=${restaurant.id}`;

	fetch(url, {
		method: 'GET', // or 'PUT'
		headers:{
			'Content-Type': 'application/json'
		}
	}).then(res => res.json())
	.then(reviews => {
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
	})
	.catch(error => console.error('Error:', error));
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
	date.innerHTML = new Date(review.createdAt).toUTCString();
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
	const link = document.createElement('a');
	link.setAttribute('aria-current', 'page');
	link.setAttribute('href', window.location.href);
	link.className = 'current';

	link.innerHTML = restaurant.name;
	li.appendChild(link);
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
	const refresh = document.getElementById('refresh');
	const dismiss = document.getElementById('dismiss');
	toast.setAttribute('class', 'visible');
	refresh.setAttribute('disabled', 'false');
	dismiss.setAttribute('disabled', 'false');
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
		refresh.setAttribute('disabled', 'true');
		dismiss.setAttribute('disabled', 'true');
	};
});
