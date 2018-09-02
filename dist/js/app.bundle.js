/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/dbhelper.js":
/*!************************!*\
  !*** ./js/dbhelper.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Common database helper functions.
 */

/*eslint no-unused-vars: "error"*/
var DBHelper =
/*#__PURE__*/
function () {
  function DBHelper() {
    _classCallCheck(this, DBHelper);
  }

  _createClass(DBHelper, null, [{
    key: "fetchRestaurants",

    /**
      * Fetch all restaurants.
      */
    value: function fetchRestaurants(callback) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', DBHelper.DATABASE_URL);

      xhr.onload = function () {
        if (xhr.status === 200) {
          // Got a success response from server!
          var json = JSON.parse(xhr.responseText);
          var restaurants = json.restaurants;
          callback(null, restaurants);
        } else {
          // Oops!. Got an error from server.
          var error = "Request failed. Returned status of ".concat(xhr.status);
          callback(error, null);
        }
      };

      xhr.send();
    }
    /**
      * Fetch a restaurant by its ID.
      */

  }, {
    key: "fetchRestaurantById",
    value: function fetchRestaurantById(id, callback) {
      // fetch all restaurants with proper error handling.
      DBHelper.fetchRestaurants(function (error, restaurants) {
        if (error) {
          callback(error, null);
        } else {
          var restaurant = restaurants.find(function (r) {
            return r.id == id;
          });

          if (restaurant) {
            // Got the restaurant
            callback(null, restaurant);
          } else {
            // Restaurant does not exist in the database
            callback('Restaurant does not exist', null);
          }
        }
      });
    }
    /**
      * Fetch restaurants by a cuisine type with proper error handling.
      */

  }, {
    key: "fetchRestaurantByCuisine",
    value: function fetchRestaurantByCuisine(cuisine, callback) {
      // Fetch all restaurants  with proper error handling
      DBHelper.fetchRestaurants(function (error, restaurants) {
        if (error) {
          callback(error, null);
        } else {
          // Filter restaurants to have only given cuisine type
          var results = restaurants.filter(function (r) {
            return r.cuisine_type == cuisine;
          });
          callback(null, results);
        }
      });
    }
    /**
      * Fetch restaurants by a neighborhood with proper error handling.
      */

  }, {
    key: "fetchRestaurantByNeighborhood",
    value: function fetchRestaurantByNeighborhood(neighborhood, callback) {
      // Fetch all restaurants
      DBHelper.fetchRestaurants(function (error, restaurants) {
        if (error) {
          callback(error, null);
        } else {
          // Filter restaurants to have only given neighborhood
          var results = restaurants.filter(function (r) {
            return r.neighborhood == neighborhood;
          });
          callback(null, results);
        }
      });
    }
    /**
      * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
      */

  }, {
    key: "fetchRestaurantByCuisineAndNeighborhood",
    value: function fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
      // Fetch all restaurants
      DBHelper.fetchRestaurants(function (error, restaurants) {
        if (error) {
          callback(error, null);
        } else {
          var results = restaurants;

          if (cuisine != 'all') {
            // filter by cuisine
            results = results.filter(function (r) {
              return r.cuisine_type == cuisine;
            });
          }

          if (neighborhood != 'all') {
            // filter by neighborhood
            results = results.filter(function (r) {
              return r.neighborhood == neighborhood;
            });
          }

          callback(null, results);
        }
      });
    }
    /**
      * Fetch all neighborhoods with proper error handling.
      */

  }, {
    key: "fetchNeighborhoods",
    value: function fetchNeighborhoods(callback) {
      // Fetch all restaurants
      DBHelper.fetchRestaurants(function (error, restaurants) {
        if (error) {
          callback(error, null);
        } else {
          // Get all neighborhoods from all restaurants
          var neighborhoods = restaurants.map(function (v, i) {
            return restaurants[i].neighborhood;
          }); // Remove duplicates from neighborhoods

          var uniqueNeighborhoods = neighborhoods.filter(function (v, i) {
            return neighborhoods.indexOf(v) == i;
          });
          callback(null, uniqueNeighborhoods);
        }
      });
    }
    /**
      * Fetch all cuisines with proper error handling.
      */

  }, {
    key: "fetchCuisines",
    value: function fetchCuisines(callback) {
      // Fetch all restaurants
      DBHelper.fetchRestaurants(function (error, restaurants) {
        if (error) {
          callback(error, null);
        } else {
          // Get all cuisines from all restaurants
          var cuisines = restaurants.map(function (v, i) {
            return restaurants[i].cuisine_type;
          }); // Remove duplicates from cuisines

          var uniqueCuisines = cuisines.filter(function (v, i) {
            return cuisines.indexOf(v) == i;
          });
          callback(null, uniqueCuisines);
        }
      });
    }
    /**
      * Restaurant page URL.
      */

  }, {
    key: "urlForRestaurant",
    value: function urlForRestaurant(restaurant) {
      return "/restaurant.html?id=".concat(restaurant.id);
    }
    /**
      * Restaurant image URL.
      */

  }, {
    key: "imageUrlForRestaurant",
    value: function imageUrlForRestaurant(restaurant) {
      return "/img/".concat(restaurant.photograph.replace('.jpg', ''));
    }
    /* eslint-disable */

    /**
      * Map marker for a restaurant.
      */

  }, {
    key: "mapMarkerForRestaurant",
    value: function mapMarkerForRestaurant(restaurant, map) {
      // https://leafletjs.com/reference-1.3.0.html#marker
      var marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng], {
        title: restaurant.name,
        alt: restaurant.name,
        url: DBHelper.urlForRestaurant(restaurant)
      });
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

  }, {
    key: "DATABASE_URL",

    /**
      * Database URL.
      * Change this to restaurants.json file location on your server.
      */
    get: function get() {
      var port = 1337; // Change this to your server port

      return "http://localhost:".concat(port, "/restaurants");
    }
  }]);

  return DBHelper;
}();

/* harmony default export */ __webpack_exports__["default"] = (DBHelper);

/***/ }),

/***/ "./js/main.js":
/*!********************!*\
  !*** ./js/main.js ***!
  \********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dbhelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dbhelper */ "./js/dbhelper.js");

var restaurants, neighborhoods, cuisines;
var newMap;
var markers = [];
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
  } // show filter


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
  _dbhelper__WEBPACK_IMPORTED_MODULE_0__["default"].fetchNeighborhoods(function (error, neighborhoods) {
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
  _dbhelper__WEBPACK_IMPORTED_MODULE_0__["default"].fetchCuisines(function (error, cuisines) {
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
  _dbhelper__WEBPACK_IMPORTED_MODULE_0__["default"].fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, function (error, restaurants) {
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
  ul.innerHTML = ''; // Remove all map markers

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
  srcLarge.setAttribute('srcset', "".concat(_dbhelper__WEBPACK_IMPORTED_MODULE_0__["default"].imageUrlForRestaurant(restaurant), "-1600_large_1x.jpg 1x, ").concat(_dbhelper__WEBPACK_IMPORTED_MODULE_0__["default"].imageUrlForRestaurant(restaurant), "-1600_large_2x.jpg 2x"));
  var srcMed = document.createElement('source');
  srcMed.setAttribute('media', '(min-width: 800px)');
  srcMed.setAttribute('srcset', "".concat(_dbhelper__WEBPACK_IMPORTED_MODULE_0__["default"].imageUrlForRestaurant(restaurant), "-800_medium_1x.jpg 1x, ").concat(_dbhelper__WEBPACK_IMPORTED_MODULE_0__["default"].imageUrlForRestaurant(restaurant), "-800_medium_2x.jpg 2x"));
  picture.append(srcLarge);
  picture.append(srcMed);
  var image = document.createElement('img');
  image.className = 'restaurant-img';
  var altText = "restaurant ".concat(restaurant.name, ", ").concat(restaurant.cuisine_type, " cuisine");
  image.setAttribute('alt', altText);
  image.src = _dbhelper__WEBPACK_IMPORTED_MODULE_0__["default"].imageUrlForRestaurant(restaurant) + '-600_small.jpg';
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
  more.setAttribute('aria-label', "".concat(restaurant.name, ", view restaurant details"));
  more.href = _dbhelper__WEBPACK_IMPORTED_MODULE_0__["default"].urlForRestaurant(restaurant);
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
    var marker = _dbhelper__WEBPACK_IMPORTED_MODULE_0__["default"].mapMarkerForRestaurant(restaurant, self.newMap);
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
  }); // Ensure refresh is only called once.
  // This works around a bug in "force update on reload".

  var refreshing;
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

registerServiceWorker(); // USING PURE JS To AVOID NEEDING TO CACHE JQUERY , SAVE MEMORY

document.addEventListener('DOMContentLoaded', function () {
  var toast = document.getElementById('simple-toast');
  var refresh = document.getElementById('refresh');
  var dismiss = document.getElementById('dismiss');

  refresh.onclick = function () {
    // console.log('refreshed');
    serviceWorker.postMessage({
      action: 'skipWaiting'
    });
  };

  dismiss.onclick = function () {
    toast.setAttribute('class', '');
  };
});

/***/ })

/******/ });
//# sourceMappingURL=app.bundle.js.map