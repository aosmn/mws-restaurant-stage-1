const staticCacheName = 'restaurant-static-v1';
const allCaches = [staticCacheName];

// console.log("lala");

self.addEventListener('install', event => {
	event.waitUntil(caches.open(staticCacheName).then(cache => {
		return cache.addAll([
			'/index.html',
			'/restaurant.html',
			'/css/styles.css',
			'/css/responsive.css',
			'/js/main.js',
			'/js/dbhelper.js',
			'/js/restaurant_info.js'
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

// self.addEventListener('fetch', event => {
//   const requestUrl = new URL(event.request.url);
//   if (requestUrl.origin === location.origin) {
//     if (requestUrl.pathname === '/' || requestUrl.pathname === '/converr/') {
//       event.respondWith(caches.match(event.request, { ignoreSearch: true }));
//       return;
//     }
//   }
//
//   event.respondWith(
//     caches.match(event.request).then(response => {
//       return response || fetch(event.request);
//     })
//   );
// });

self.addEventListener('fetch', event => {
	// console.log(event.request.url);
	event.respondWith(caches.match(event.request,
		{ignoreSearch: true}).then(response => {
		return response || fetch(event.request).then(res => {
			return caches.open(staticCacheName).then(cache => {
				// console.log("hereee");
				cache.put(event.request, res.clone());
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
