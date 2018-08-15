let restaurants,
  neighborhoods,
  cuisines
var newMap
var markers = []

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  initMap(); // added 
  fetchNeighborhoods();
  fetchCuisines();
  
  const neighbourSelect = document.getElementById("neighborhoods-select");
  const cuisineSelect = document.getElementById('cuisines-select');

  if(window.innerWidth > 450){           
    neighbourSelect.tabIndex = 0;
    cuisineSelect.tabIndex = 0;
  }
  
  // show filter
  const filterBtn = document.getElementById('show-filter');
  filterBtn.addEventListener('click', () => {
    const filter = document.getElementsByClassName('filter-options')[0];
    const map = document.getElementById('map');
    const arrow = document.getElementById('arrow');
    const btnText = document.getElementById('btnText');
    if (filter.classList.contains('open')) {
      filter.classList.remove('open');
      map.classList.remove('smaller');
      arrow.innerHTML = "&#9660;";
      btnText.innerHTML = "Show filters ";
      neighbourSelect.tabIndex = -1;
      cuisineSelect.tabIndex = -1;
    } else {
      filter.classList.add('open');
      map.classList.add('smaller');
      arrow.innerHTML = "&#9650;";
      btnText.innerHTML = "Hide filters ";
      neighbourSelect.tabIndex = 0;
      cuisineSelect.tabIndex = 0;
    }
  });
  

});

/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
}

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}

/**
 * Initialize leaflet map, called from HTML.
 */
initMap = () => {
  self.newMap = L.map('map', {
        center: [40.722216, -73.987501],
        zoom: 12,
        scrollWheelZoom: false
      });
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
    mapboxToken: 'pk.eyJ1IjoiYW9zbW4iLCJhIjoiY2prOW1lYWV6MjJoNjN3cGFzZ3cybnhhbCJ9.MooMDpdnW4vnA4Aee7JnDQ',
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
  }).addTo(newMap);

  updateRestaurants();
}
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
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  })
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  if (self.markers) {
    self.markers.forEach(marker => marker.remove());
  }
  self.markers = [];
  self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
}

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');
  const content = document.createElement('div');
  content.classList.add("content");

  const imageContainer = document.createElement('div');
  imageContainer.className = 'restaurant-img-container';
  
  const image = document.createElement('img');
  image.className = 'restaurant-img';
  const altText = `Photo of restaurant ${restaurant.name}, ${restaurant.cuisine_type} cuisine`;
  image.setAttribute('alt', altText);
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  imageContainer.append(image);
  li.append(imageContainer);

  const name = document.createElement('h1');
  name.innerHTML = restaurant.name;
  content.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  content.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  content.append(address);

  const moreContainer = document.createElement('div');
  moreContainer.className = "actions";
  const more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.setAttribute('aria-label', `${restaurant.name}, view restaurant details`)
  more.href = DBHelper.urlForRestaurant(restaurant);
  moreContainer.append(more);

  li.append(content);
  li.append(moreContainer);

  return li;
}

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.newMap);
    marker.on("click", onClick);
    function onClick() {
      window.location.href = marker.options.url;
    }
    self.markers.push(marker);
  });

} 
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

