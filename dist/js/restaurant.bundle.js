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
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/restaurant_info.js");
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
      var port = 3000; // Change this to your server port

      return "http://localhost:".concat(port, "/data/restaurants.json");
    }
  }]);

  return DBHelper;
}();

/* harmony default export */ __webpack_exports__["default"] = (DBHelper);

/***/ }),

/***/ "./js/restaurant_info.js":
/*!*******************************!*\
  !*** ./js/restaurant_info.js ***!
  \*******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dbhelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dbhelper */ "./js/dbhelper.js");
 // let restaurant;

var newMap;
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
      }).addTo(self.newMap);
      fillBreadcrumb();
      _dbhelper__WEBPACK_IMPORTED_MODULE_0__["default"].mapMarkerForRestaurant(self.restaurant, self.newMap);
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
    _dbhelper__WEBPACK_IMPORTED_MODULE_0__["default"].fetchRestaurantById(id, function (error, restaurant) {
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
  address.innerHTML = restaurant.address; //
  // <picture>
  //     <source media="(min-width: 800px)" srcset="images/still_life-1600_large_1x.jpg 1x, images/still_life-1600_large_2x.jpg 2x">
  //     <source media="(min-width: 500px)" srcset="images/still_life-800_medium_1x.jpg 1x, images/still_life-8_medium_2x.jpg 2x">
  //     <img src="images/still_life-600_small.jpg" alt="Image of horses in hawaii">
  //   </picture>
  // const picture = document.getElementById('restaurant-img');

  var srcLarge = document.getElementById('src-lrg');
  srcLarge.setAttribute('srcset', "".concat(_dbhelper__WEBPACK_IMPORTED_MODULE_0__["default"].imageUrlForRestaurant(restaurant), "-1600_large_1x.jpg 1x, ").concat(_dbhelper__WEBPACK_IMPORTED_MODULE_0__["default"].imageUrlForRestaurant(restaurant), "-1600_large_2x.jpg 2x"));
  var srcMed = document.getElementById('src-med');
  srcMed.setAttribute('srcset', "".concat(_dbhelper__WEBPACK_IMPORTED_MODULE_0__["default"].imageUrlForRestaurant(restaurant), "-800_medium_1x.jpg 1x, ").concat(_dbhelper__WEBPACK_IMPORTED_MODULE_0__["default"].imageUrlForRestaurant(restaurant), "-800_medium_2x.jpg 2x"));
  var image = document.getElementById('restaurant-image');
  image.className = 'restaurant-img';
  image.setAttribute('alt', "restaurant ".concat(restaurant.name, ", ").concat(restaurant.cuisine_type, " cuisine"));
  image.src = "".concat(_dbhelper__WEBPACK_IMPORTED_MODULE_0__["default"].imageUrlForRestaurant(restaurant), "-600_small.jpg");
  var cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type; // fill operating hours

  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  } // fill reviews


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
      var operatingHoursArr = operatingHours[key].split(','); // console.log(operatingHours[key].split(","));

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
  rating.innerHTML = "Rating: <span class=\"rating\">".concat(review.rating, "</span>");
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
  var regex = new RegExp("[?&]".concat(name, "(=([^&#]*)|&|#|$)")),
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
//# sourceMappingURL=restaurant.bundle.js.map