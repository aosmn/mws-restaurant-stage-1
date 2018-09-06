import {replaceWebp} from './webp';
let ticking = false;

export function lazyload() {
	const imageSrc = '.webp';
	const pictures = document.getElementsByTagName('picture');
	for (let i = 0; i < pictures.length; i++) {
		const children = pictures[i].children;
		const srcLarge = children[0];
		const srcMed = children[1];
		const image = children[2];

		const imgURL = image.getAttribute('data-id');
		if(image.getBoundingClientRect().top < window.innerHeight){
			srcLarge.setAttribute('srcset', `${
				imgURL
			}-1600_large_1x${imageSrc} 1x`);

			srcMed.setAttribute('srcset', `${
				imgURL
			}-800_medium_1x${imageSrc} 1x, ${
				imgURL
			}-800_medium_2x${imageSrc} 2x`);

			image.src = `${
				image.getAttribute('data-id')}-600_small${imageSrc}`;
		}
		replaceWebp();
	}
}


window.addEventListener('scroll', function() {

	// last_known_scroll_position = window.scrollY;

	if (!ticking) {

		window.requestAnimationFrame(function() {
			// iswebp(() => { imageSrc = '.jpg'; });
			lazyload();
			ticking = false;
		});

		ticking = true;

	}

});