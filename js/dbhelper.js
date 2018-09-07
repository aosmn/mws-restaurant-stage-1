import 'whatwg-fetch';
/**
 * Common database helper functions.
 */
/*eslint no-unused-vars: "error"*/

const dbPromise = idb.open('restaurant-reviews-db', 1, upgradeDb => {
	let resStore = {};
	switch (upgradeDb.oldVersion) {
	case 0:
		resStore = upgradeDb.createObjectStore('restaurants', {keyPath: 'id'});
		resStore.createIndex('id', 'id');
	}
});


class DBHelper {

	/**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
	static get DATABASE_URL() {
		const port = 1337; // Change this to your server port
		return `http://localhost:${port}/restaurants`;
	}

	/**
   * Fetch all restaurants.
   */
	static fetchRestaurants(id) {
		let url = DBHelper.DATABASE_URL;

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

}

export default DBHelper;