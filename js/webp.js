export function replaceWebp() {
	const WebP = new Image();
	WebP.onload = WebP.onerror = function() {
		if (WebP.height != 2) {
			const pictures = document.getElementsByTagName('picture');
			for (let i = 0; i < pictures.length; i++) {
				const children = pictures[i].children;
				for (let j = 0; j < children.length; j++) {
					const el = children[j];
					if (el.hasAttribute('srcset')) {
						el.srcset = el.srcset.replace('.webp', '.jpg');
					} else if(el.hasAttribute('src')){
						el.src = el.src.replace('.webp', '.jpg');
					}
				}
				// console.log(children[i].type);
			}
			// const sources = document.getElementsByTagName('source');
			// for (let i = 0; i < sources.length; i++) {
			// 	sources[i].srcset = sources[i].srcset.replace('.webp', '.jpg');
			// }
			// const images = document.getElementsByTagName('img');
			// for (let i = 0; i < images.length; i++) {
			// 	images[i].src = images[i].src.replace('.webp', '.jpg');
			// }
		}
	};
	WebP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAg'+
	'CdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
}