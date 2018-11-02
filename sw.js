const staticCacheName = 'restaurant-static-v1';
const imagesCache = 'restaurant-images';
const allCaches = [staticCacheName, imagesCache];

// console.log("lala");

self.addEventListener('install', event => {
	event.waitUntil(caches.open(staticCacheName).then(cache => {
		return cache.addAll([
			'/',
			'/index.html',
			'/restaurant.html',
			'/css/styles.css',
			'/css/responsive.css',
			'/js/restaurant.bundle.js',
			'/js/app.bundle.js',
			'/js/indexedDB.js'
		]);
	}));
});
//
self.addEventListener('activate', event => {
	event.waitUntil(caches.keys().then(cacheNames => {
		return Promise.all(cacheNames.filter(cacheName => {
			return cacheName.startsWith('restaurant-')
							&& !allCaches.includes(cacheName);
		}).map(cacheName => {
			return caches.delete(cacheName);
		}));
	}));
});


self.addEventListener('fetch', event => {
	// console.log(event.request.url);
	event.respondWith(caches.match(event.request,
		{ignoreSearch: true}).then(response => {
		return response || fetch(event.request).then(res => {
			return caches.open(imagesCache).then(cache => {
				if (event.request.url.indexOf('/restaurants') == -1 && event.request.method != "POST" && event.request.url.indexOf('/reviews') == -1) {
					cache.put(event.request, res.clone());
				}
				return res;
			});
		});
	}));
});

self.addEventListener('message', event => {
	if (event.data.action === 'skipWaiting') {
		self.skipWaiting();
	}
});
