import 'whatwg-fetch';
/**
 * Common database helper functions.
 */
/*eslint no-unused-vars: "error"*/

const dbPromise = idb.open('restaurant-reviews-db', 3, upgradeDb => {
	let resStore = {};
	let revStore = {};
	switch (upgradeDb.oldVersion) {
		case 0:
			resStore = upgradeDb.createObjectStore('restaurants', {keyPath: 'id'});
			resStore.createIndex('id', 'id');
		case 1:
			resStore = upgradeDb.transaction.objectStore('restaurants');
			resStore.createIndex('offline', 'offline');
		case 2:
			revStore = upgradeDb.createObjectStore('reviews', {keyPath: 'id', autoIncrement: true});
			revStore.createIndex('id', 'id');
			revStore.createIndex('offline', 'offline');
			revStore.createIndex('restaurant_id', 'restaurant_id');
	}
});


class DBHelper {

	/**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
	static get DATABASE_URL() {
		const port = 1337; // Change this to your server port
		return `http://localhost:${port}`;
	}

	/**
   * Fetch all restaurants.
   */
	static fetchRestaurants(id) {
		let url = `${DBHelper.DATABASE_URL}/restaurants`;

		if (id) {
			url+= `/${id}`;
			return fetch(url).then((res) => {
				// console.log(res.json());
				return res.json();
			}).catch(() => {
				return dbPromise.then(db => {
					const tx = db.transaction('restaurants');
					const objectStore = tx.objectStore('restaurants');
					return objectStore.get(parseInt(id));
				}).then((restaurant) => {
					console.log('from db');
					if (restaurant)
						return restaurant;
				});
			});
		}
		return fetch(url).then((res) => {
			// console.log(res.json());
			return res.json();
		}).catch(() => {
			return dbPromise.then(db => {
				const tx = db.transaction('restaurants');
				const objectStore = tx.objectStore('restaurants');
				return objectStore.getAll();
			}).then((restaurants) => {
				if (restaurants && restaurants.length > 0)
					return restaurants;
			});
		});


	}

	/**
   * Fetch a restaurant by its ID.
   */
	static fetchRestaurantById(id, callback) {
		// fetch all restaurants with proper error handling.
		DBHelper.fetchRestaurants(id).then((restaurant) => {
			// const restaurant = restaurants.find(r => r.id == id);
			if (restaurant) { // Got the restaurant
				dbPromise.then(function(db) {
					const tx = db.transaction('restaurants', 'readwrite');
					const objectStore = tx.objectStore('restaurants');
					objectStore.put(restaurant); // returns a promise
					return tx.complete;
				}).then(function() {
					// console.log('success');
					callback(null, restaurant);
				});
			} else { // Restaurant does not exist in the database
				callback('Restaurant does not exist', null);
			}
		}).catch(function(error){
			if (error) {
				callback(error, null);
			}
		});
	}

	/**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
	static fetchRestaurantByCuisine(cuisine, callback) {
		// Fetch all restaurants  with proper error handling
		DBHelper.fetchRestaurants().then((restaurants) => {
			// Filter restaurants to have only given cuisine type
			const results = restaurants.filter(r =>
				r.cuisine_type == cuisine);
			callback(null, results);
		}).catch(function(error){
			if (error) {
				callback(error, null);
			}
		});
	}

	/**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
	static fetchRestaurantByNeighborhood(neighborhood, callback) {
		// Fetch all restaurants
		DBHelper.fetchRestaurants().then((restaurants) => {
			// Filter restaurants to have only given neighborhood
			const results = restaurants.filter(r =>
				r.neighborhood == neighborhood);
			callback(null, results);
		}).catch(function(error){
			if (error) {
				callback(error, null);
			}
		});
	}

	/**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
	static fetchRestaurantByCuisineAndNeighborhood(
		cuisine,
		neighborhood,
		callback) {
		// Fetch all restaurants
		DBHelper.fetchRestaurants().then((restaurants) => {
			let results = restaurants;
			dbPromise.then(function(db) {
				const tx = db.transaction('restaurants', 'readwrite');
				const objectStore = tx.objectStore('restaurants');
				for (let i = 0; i < results.length; i++) {
					const restaurant = results[i];
					objectStore.put(restaurant); // returns a promise
				}
				return tx.complete;
			}).then(function() {
				console.log('success');
			});
			if (cuisine != 'all') { // filter by cuisine
				results = results.filter(r => r.cuisine_type == cuisine);
			}
			if (neighborhood != 'all') { // filter by neighborhood
				results = results.filter(r =>
					r.neighborhood == neighborhood);
			}
			callback(null, results);
		}).catch(function(error){
			if (error) {
				callback(error, null);
			}
		});
	}

	/**
   * Fetch all neighborhoods with proper error handling.
   */
	static fetchNeighborhoods(callback) {
		// Fetch all restaurants
		DBHelper.fetchRestaurants().then((restaurants) => {
			// Get all neighborhoods from all restaurants
			const neighborhoods = restaurants.map((v, i) =>
				restaurants[i].neighborhood);
			// Remove duplicates from neighborhoods
			const uniqueNeighborhoods = neighborhoods.filter((v, i) =>
				neighborhoods.indexOf(v) == i);
			callback(null, uniqueNeighborhoods);
		}).catch(function(error){
			if (error) {
				callback(error, null);
			}
		});
	}

	/**
   * Fetch all cuisines with proper error handling.
   */
	static fetchCuisines(callback) {
		// Fetch all restaurants
		DBHelper.fetchRestaurants().then((restaurants) => {
			// Get all cuisines from all restaurants
			const cuisines = restaurants.map((v, i) =>
				restaurants[i].cuisine_type);
			// Remove duplicates from cuisines
			const uniqueCuisines = cuisines.filter((v, i) =>
				cuisines.indexOf(v) == i);
			callback(null, uniqueCuisines);
			// }
		}).catch(function(error){
			if (error) {
				callback(error, null);
			}
		});
	}

	/**
   * Restaurant page URL.
   */
	static urlForRestaurant(restaurant) {
		return (`/restaurant.html?id=${restaurant.id}`);
	}

	/**
   * Restaurant image URL.
   */
	static imageUrlForRestaurant(restaurant) {
		if (restaurant.photograph) {
			return `/img/${restaurant.photograph}`;
		}
		return '/img/nophoto';
	}

	/* eslint-disable */
	/**
   * Map marker for a restaurant.
   */
	static mapMarkerForRestaurant(restaurant, map) {
		// https://leafletjs.com/reference-1.3.0.html#marker
		const marker = new L.marker([
			restaurant.latlng.lat, restaurant.latlng.lng
		], {
			title: restaurant.name,
			alt: restaurant.name,
			url: DBHelper.urlForRestaurant(restaurant)
		})
		marker.addTo(newMap);
		return marker;
	}
	/* static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  } */

	static setFavoriteRestaurant(restaurant, isFavorite, callback) {
		let url = `${DBHelper.DATABASE_URL}/restaurants/${restaurant.id}`;
		return fetch(url, {
			method: 'PUT', // or 'PUT'
			body: JSON.stringify({is_favorite: isFavorite}), // data can be `string` or {object}!
			headers:{
				'Content-Type': 'application/json'
			}
		}).then(res => {
			return res.json();
		})
		.then((result)=>{
			dbPromise.then(function(db) {
				const tx = db.transaction('restaurants', 'readwrite');
				const objectStore = tx.objectStore('restaurants');
				objectStore.put(restaurant);
				return tx.complete;
			}).then(()=>{
				callback(null);
			}).catch( err => callback(err));
		})
		.catch(error => {
			dbPromise.then(function(db) {
				const tx = db.transaction('restaurants', 'readwrite');
				const objectStore = tx.objectStore('restaurants');
				restaurant.is_favorite = isFavorite;
				restaurant.offline = "true";

			  objectStore.put(restaurant);
			  return tx.complete;
			}).then(function() {
			  console.log('item updated!');
				callback(null)
			}).catch((error) => {
				callback(error);
			});
		});
	}

	static setFavoriteRestaurantsOnline(){
		dbPromise.then(db => {
			const tx = db.transaction('restaurants');
			const objectStore = tx.objectStore('restaurants');
			const offlineIndex = objectStore.index('offline')
			return offlineIndex.getAll("true");
		}).then((restaurants) => {
			if (restaurants && restaurants.length > 0){
					for (var i = 0; i < restaurants.length; i++) {
						let restaurant = restaurants[i];
						delete restaurant.offline;
						DBHelper.setFavoriteRestaurant(restaurant, restaurant.is_favorite, (err) => {
							if (err) {
								console.log(err);
							} else {
								console.log("updated online");
							}
						});
					}
			}
		});
	}

	// REVIEWS API

	static createReview(review, callback){
		var url = `${DBHelper.DATABASE_URL}/reviews/`;
		fetch(url, {
			method: 'POST', // or 'PUT'
			body: JSON.stringify(review), // data can be `string` or {object}!
			headers:{
				'Content-Type': 'application/json'
			}
		})
		.then(res => res.json())
		.then(review => {
			DBHelper.addReviewToDB(review, false).then(function() {
			  console.log('item updated!');
				if (callback)
					callback(review);
			}).catch((error) => {
				// callback(error);
				console.error('Error:', error)
			});

			// callback(review);
		})
		.catch(error => {
			// save to db
			DBHelper.addReviewToDB(review, true).then(function() {
			  console.log('item added!');
				if (callback)
					callback(review);
			}).catch((error) => {
				// callback(error);
				console.error('Error:', error)
			});
		});
	}

	static addReviewToDB(review, offline){
		return dbPromise.then(function(db) {
			const tx = db.transaction('reviews', 'readwrite');
			const objectStore = tx.objectStore('reviews');
			if(offline)
				review.offline = "true";

			objectStore.put(review);
			return tx.complete;
		})
	}

	static getAllReviews(id, callback){
		var url = `${DBHelper.DATABASE_URL}/reviews/?restaurant_id=${id}`;

		fetch(url, {
			method: 'GET',
			headers:{
				'Content-Type': 'application/json'
			}
		})
		.then(res => res.json())
		.then(reviews => {
			dbPromise.then(function(db) {
				const tx = db.transaction('reviews', 'readwrite');
				const objectStore = tx.objectStore('reviews');
				for (let i = 0; i < reviews.length; i++) {
					const review = reviews[i];
					objectStore.put(review); // returns a promise
				}
				return tx.complete;
			}).then(function() {
				console.log('success');
				callback(reviews);
			});
		})
		.catch(error => {
			// get from db
			dbPromise.then(db => {
				const tx = db.transaction('reviews');
				const objectStore = tx.objectStore('reviews');
				const restaurantIndex = objectStore.index('restaurant_id');

				return restaurantIndex.getAll(id);
			}).then((reviews) => {
				console.log("loaded from db");
				callback(reviews);
			});
		});
	}

	static addReviewsOnline(){
		dbPromise.then(db => {
			const tx = db.transaction('reviews');
			const objectStore = tx.objectStore('reviews');
			const offlineIndex = objectStore.index('offline')
			return offlineIndex.getAll("true");
		}).then((reviews) => {
			if (reviews && reviews.length > 0){
					for (var i = 0; i < reviews.length; i++) {
						let review = reviews[i];
						delete review.offline;
						DBHelper.createReview(review);
					}
			}
		});
	}
}

export default DBHelper;